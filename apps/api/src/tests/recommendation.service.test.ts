import { describe, expect, it } from "vitest";
import { buildCardUpdateData } from "../controllers/cards.controller.js";
import { applyRewardCap, recommendCards } from "../services/recommendation.service.js";

const baseCard = {
  id: "flat",
  name: "Flat 2 Percent",
  issuer: "Test",
  network: "Visa",
  annualFee: 0 as any,
  rewardType: "cashback",
  rewardCurrency: "cash",
  baseRate: 0.02 as any,
  pointValueCents: 1 as any,
  rewardRules: {},
  categoryCaps: {},
  credits: [],
  signupBonus: null,
  signupBonusValue: 0 as any,
  foreignTransactionFee: null,
  isStudentCard: false,
  hasNoAnnualFee: true,
  bestFor: [],
  applyUrl: null,
  sourceUrl: null,
  lastVerified: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  rewardCategories: [
    {
      id: "flat-default",
      creditCardId: "flat",
      category: "default",
      rewardRate: 0.02 as any,
      monthlyCap: null,
      yearlyCap: null,
      notes: null
    }
  ]
};

describe("recommendCards", () => {
  it("ranks stronger category cards first", () => {
    const groceryCard = {
      ...baseCard,
      id: "grocery",
      name: "Grocery Card",
      annualFee: 95 as any,
      rewardCategories: [
        {
          ...baseCard.rewardCategories[0],
          id: "grocery-rule",
          creditCardId: "grocery",
          category: "groceries",
          rewardRate: 0.06 as any
        },
        baseCard.rewardCategories[0]
      ]
    };

    const results = recommendCards({ groceries: 8000 }, [baseCard, groceryCard]);
    expect(results[0].cardId).toBe("grocery");
  });

  it("subtracts annual fees", () => {
    const feeCard = { ...baseCard, id: "fee", annualFee: 100 as any };
    const [result] = recommendCards({ dining: 1000 }, [feeCard]);
    expect(result.estimatedNetValue).toBe(-80);
  });

  it("uses other as the fallback reward category before default", () => {
    const otherCard = {
      ...baseCard,
      rewardCategories: [
        {
          ...baseCard.rewardCategories[0],
          id: "other-rule",
          category: "other",
          rewardRate: 0.03 as any
        },
        baseCard.rewardCategories[0]
      ]
    };

    const [result] = recommendCards({ dining: 100 }, [otherCard]);
    expect(result.estimatedGrossRewards).toBe(3);
    expect(result.categoryBreakdown[0].rewardRate).toBe(0.03);
  });

  it("includes card metadata needed by the web recommendations UI", () => {
    const metadataCard = {
      ...baseCard,
      bestFor: ["flat cashback"],
      applyUrl: "https://example.com/apply",
      sourceUrl: "https://example.com/source",
      lastVerified: new Date("2026-05-17T00:00:00.000Z")
    };

    const [result] = recommendCards({ dining: 100 }, [metadataCard]);
    expect(result).toMatchObject({
      network: "Visa",
      rewardCurrency: "cash",
      bestFor: ["flat cashback"],
      applyUrl: "https://example.com/apply",
      sourceUrl: "https://example.com/source",
      lastVerified: "2026-05-17"
    });
  });

  it("only adds signup bonus value when requested", () => {
    const bonusCard = { ...baseCard, signupBonusValue: 300 as any };

    expect(recommendCards({ dining: 1000 }, [bonusCard])[0].estimatedNetValue).toBe(20);
    expect(
      recommendCards({ dining: 1000 }, [bonusCard], { includeSignupBonus: true })[0].estimatedNetValue
    ).toBe(320);
  });

  it("applies issuer preference and avoidance weights", () => {
    const preferred = recommendCards({ dining: 1000 }, [baseCard], {
      preferredIssuer: "test"
    })[0];
    const avoided = recommendCards({ dining: 1000 }, [baseCard], {
      avoidedIssuer: "test"
    })[0];

    expect(preferred.preferenceScore).toBe(100);
    expect(avoided.preferenceScore).toBe(-250);
  });

  it("returns a stable zero-spend recommendation", () => {
    const [result] = recommendCards({}, [baseCard]);

    expect(result.estimatedGrossRewards).toBe(0);
    expect(result.estimatedNetValue).toBe(0);
    expect(result.reasoning).toContain("This card has no annual fee, so all estimated rewards count toward net value.");
  });
});

describe("applyRewardCap", () => {
  it("uses the lowest annualized cap", () => {
    expect(applyRewardCap(10000, 500, 7000)).toBe(6000);
  });
});

describe("buildCardUpdateData", () => {
  it("preserves hasNoAnnualFee when annualFee is not patched", () => {
    const data = buildCardUpdateData({ issuer: "Updated Issuer" });

    expect(data).toEqual({ issuer: "Updated Issuer" });
    expect(data).not.toHaveProperty("hasNoAnnualFee");
  });

  it("recomputes hasNoAnnualFee when annualFee is patched", () => {
    expect(buildCardUpdateData({ annualFee: 0 }).hasNoAnnualFee).toBe(true);
    expect(buildCardUpdateData({ annualFee: 95 }).hasNoAnnualFee).toBe(false);
  });

  it("replaces reward categories only when rewardCategories is supplied", () => {
    const rewardCategories = [
      {
        category: "dining",
        rewardRate: 0.03,
        notes: "Restaurants"
      }
    ];

    expect(buildCardUpdateData({ rewardCategories }).rewardCategories).toEqual({
      deleteMany: {},
      create: rewardCategories
    });
  });
});
