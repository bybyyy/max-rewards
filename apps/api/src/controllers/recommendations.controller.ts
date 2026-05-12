import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { runRecommendations } from "../services/recommendation.service.js";

export const recommendationFilterSchema = z.object({
  noAnnualFee: z.boolean().optional(),
  rewardType: z.string().optional(),
  studentCards: z.boolean().optional(),
  includeSignupBonus: z.boolean().optional(),
  goal: z.enum(["cashback", "travel", "flexible"]).optional(),
  welcomeBonusImportance: z.enum(["low", "medium", "high"]).optional(),
  preferredIssuer: z.string().optional(),
  avoidedIssuer: z.string().optional()
});

function parseFilters(query: Request["query"]) {
  return {
    noAnnualFee: query.noAnnualFee === "true" ? true : undefined,
    rewardType: query.rewardType ? String(query.rewardType) : undefined,
    studentCards: query.studentCards === "true" ? true : undefined,
    includeSignupBonus: query.includeSignupBonus !== "false",
    goal: query.goal ? String(query.goal) as "cashback" | "travel" | "flexible" : undefined,
    welcomeBonusImportance: query.welcomeBonusImportance
      ? String(query.welcomeBonusImportance) as "low" | "medium" | "high"
      : undefined,
    preferredIssuer: query.preferredIssuer ? String(query.preferredIssuer) : undefined,
    avoidedIssuer: query.avoidedIssuer ? String(query.avoidedIssuer) : undefined
  };
}

export async function getRecommendationsHandler(req: Request, res: Response) {
  const recommendations = await runRecommendations(req.user!.id, parseFilters(req.query));
  res.json({ recommendations });
}

export async function runRecommendationsHandler(req: Request, res: Response) {
  const recommendations = await runRecommendations(req.user!.id, req.body);
  res.status(201).json({ recommendations });
}

export async function recommendationHistoryHandler(req: Request, res: Response) {
  const runs = await prisma.recommendationRun.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
    take: 20
  });
  res.json({ runs });
}
