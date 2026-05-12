import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { runRecommendations } from "../services/recommendation.service.js";

export const recommendationFilterSchema = z.object({
  noAnnualFee: z.boolean().optional(),
  rewardType: z.string().optional(),
  studentCards: z.boolean().optional(),
  includeSignupBonus: z.boolean().optional()
});

function parseFilters(query: Request["query"]) {
  return {
    noAnnualFee: query.noAnnualFee === "true" ? true : undefined,
    rewardType: query.rewardType ? String(query.rewardType) : undefined,
    studentCards: query.studentCards === "true" ? true : undefined,
    includeSignupBonus: query.includeSignupBonus !== "false"
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
