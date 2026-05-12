import type { CreditCard, CardRewardCategory } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { roundMoney } from "../utils/money.js";

export type RecommendationFilters = {
  noAnnualFee?: boolean;
  rewardType?: string;
  studentCards?: boolean;
  includeSignupBonus?: boolean;
  goal?: "cashback" | "travel" | "flexible";
  welcomeBonusImportance?: "low" | "medium" | "high";
  preferredIssuer?: string;
  avoidedIssuer?: string;
};

type CardWithRewards = CreditCard & {
  rewardCategories: CardRewardCategory[];
};

export async function runRecommendations(userId: string, filters: RecommendationFilters = {}) {
  const spending = await getAnnualizedSpending(userId);
  const cards = await prisma.creditCard.findMany({
    where: {
      ...(filters.noAnnualFee ? { hasNoAnnualFee: true } : {}),
      ...(filters.rewardType ? { rewardType: filters.rewardType } : {}),
      ...(filters.studentCards ? { isStudentCard: true } : {})
    },
    include: { rewardCategories: true }
  });

  const recommendations = recommendCards(spending, cards, filters);

  await prisma.recommendationRun.create({
    data: {
      userId,
      filters,
      results: recommendations
    }
  });

  return recommendations;
}

export async function getAnnualizedSpending(userId: string) {
  const aggregates = await prisma.spendingAggregate.findMany({ where: { userId } });
  const months = new Set(aggregates.map((aggregate) => aggregate.month));
  const multiplier = months.size >= 12 ? 1 : months.size > 0 ? 12 / months.size : 1;
  const spending: Record<string, number> = {};

  for (const aggregate of aggregates) {
    spending[aggregate.categoryPrimary] =
      (spending[aggregate.categoryPrimary] ?? 0) + Number(aggregate.totalAmount) * multiplier;
  }

  return spending;
}

export function recommendCards(
  spending: Record<string, number>,
  cards: CardWithRewards[],
  filters: RecommendationFilters = {}
) {
  return cards
    .map((card) => {
      let grossRewards = 0;

      const categoryBreakdown = Object.entries(spending).map(([category, annualSpend]) => {
        const rule =
          card.rewardCategories.find((reward) => reward.category === category) ??
          card.rewardCategories.find((reward) => reward.category === "default");

        const rewardRate = Number(rule?.rewardRate ?? 0.01);
        const eligibleSpend = applyRewardCap(
          annualSpend,
          rule?.monthlyCap ? Number(rule.monthlyCap) : undefined,
          rule?.yearlyCap ? Number(rule.yearlyCap) : undefined
        );
        const estimatedRewards = eligibleSpend * rewardRate;
        grossRewards += estimatedRewards;

        return {
          category,
          annualSpend: roundMoney(annualSpend),
          rewardRate,
          estimatedRewards: roundMoney(estimatedRewards)
        };
      });

      const signupBonusValue = filters.includeSignupBonus
        ? Number(card.signupBonusValue ?? 0)
        : 0;
      const annualFee = Number(card.annualFee);
      const estimatedNetValue = grossRewards + signupBonusValue - annualFee;
      const preference = scorePreferences(card, filters);

      return {
        cardId: card.id,
        name: card.name,
        issuer: card.issuer,
        rewardType: card.rewardType,
        estimatedGrossRewards: roundMoney(grossRewards),
        signupBonusValue: roundMoney(signupBonusValue),
        annualFee: roundMoney(annualFee),
        estimatedNetValue: roundMoney(estimatedNetValue),
        preferenceScore: preference.score,
        rankingScore: roundMoney(estimatedNetValue + preference.score),
        categoryBreakdown: categoryBreakdown
          .sort((a, b) => b.estimatedRewards - a.estimatedRewards)
          .slice(0, 6),
        reasoning: buildRecommendationReasons(card, categoryBreakdown).concat(preference.reasons)
      };
    })
    .sort((a, b) => b.rankingScore - a.rankingScore);
}

export function applyRewardCap(
  annualSpend: number,
  monthlyCap?: number,
  yearlyCap?: number
) {
  const monthlyAnnualCap = monthlyCap ? monthlyCap * 12 : undefined;
  const caps = [monthlyAnnualCap, yearlyCap].filter((cap): cap is number => Boolean(cap));
  if (caps.length === 0) return annualSpend;
  return Math.min(annualSpend, ...caps);
}

function buildRecommendationReasons(card: CardWithRewards, categoryBreakdown: Array<{
  category: string;
  annualSpend: number;
  rewardRate: number;
  estimatedRewards: number;
}>) {
  const topCategories = categoryBreakdown
    .filter((item) => item.estimatedRewards > 0)
    .sort((a, b) => b.estimatedRewards - a.estimatedRewards)
    .slice(0, 2);

  const reasons = topCategories.map((item) => {
    const percent = Math.round(item.rewardRate * 100);
    return `${card.name} earns about ${percent}% back on your ${item.category} spending.`;
  });

  if (Number(card.annualFee) === 0) {
    reasons.push("This card has no annual fee, so all estimated rewards count toward net value.");
  }

  return reasons.length > 0 ? reasons : ["This card provides a solid base reward rate across everyday spending."];
}

function scorePreferences(card: CardWithRewards, filters: RecommendationFilters) {
  let score = 0;
  const reasons: string[] = [];

  if (filters.goal && filters.goal !== "flexible") {
    if (card.rewardType === filters.goal) {
      score += 75;
      reasons.push(`Matches your preference for ${filters.goal} rewards.`);
    } else {
      score -= 35;
    }
  }

  const signupBonusValue = Number(card.signupBonusValue ?? 0);
  if (filters.welcomeBonusImportance === "high") {
    score += signupBonusValue * 0.3;
    if (signupBonusValue > 0) {
      reasons.push("Welcome bonus is weighted heavily based on your questionnaire.");
    }
  } else if (filters.welcomeBonusImportance === "medium") {
    score += signupBonusValue * 0.12;
  } else if (filters.welcomeBonusImportance === "low") {
    score -= signupBonusValue * 0.08;
  }

  const preferredIssuer = filters.preferredIssuer?.trim().toLowerCase();
  if (preferredIssuer && card.issuer.toLowerCase().includes(preferredIssuer)) {
    score += 100;
    reasons.push(`Issuer preference matched: ${card.issuer}.`);
  }

  const avoidedIssuer = filters.avoidedIssuer?.trim().toLowerCase();
  if (avoidedIssuer && card.issuer.toLowerCase().includes(avoidedIssuer)) {
    score -= 250;
    reasons.push(`Lower ranked because you prefer to avoid ${card.issuer}.`);
  }

  return { score: roundMoney(score), reasons };
}
