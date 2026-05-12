import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";

export const cardSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  annualFee: z.number().nonnegative(),
  rewardType: z.string().min(1),
  signupBonusValue: z.number().nonnegative().optional(),
  foreignTransactionFee: z.number().nonnegative().optional(),
  isStudentCard: z.boolean().optional(),
  rewardCategories: z.array(
    z.object({
      category: z.string().min(1),
      rewardRate: z.number().nonnegative(),
      monthlyCap: z.number().positive().optional(),
      yearlyCap: z.number().positive().optional(),
      notes: z.string().optional()
    })
  )
});

export async function listCardsHandler(_req: Request, res: Response) {
  const cards = await prisma.creditCard.findMany({
    include: { rewardCategories: true },
    orderBy: [{ issuer: "asc" }, { name: "asc" }]
  });
  res.json({ cards });
}

export async function getCardHandler(req: Request, res: Response) {
  const card = await prisma.creditCard.findUniqueOrThrow({
    where: { id: String(req.params.id) },
    include: { rewardCategories: true }
  });
  res.json({ card });
}

export async function createCardHandler(req: Request, res: Response) {
  const card = await prisma.creditCard.create({
    data: {
      name: req.body.name,
      issuer: req.body.issuer,
      annualFee: req.body.annualFee,
      rewardType: req.body.rewardType,
      signupBonusValue: req.body.signupBonusValue,
      foreignTransactionFee: req.body.foreignTransactionFee,
      isStudentCard: req.body.isStudentCard ?? false,
      hasNoAnnualFee: req.body.annualFee === 0,
      rewardCategories: {
        create: req.body.rewardCategories
      }
    },
    include: { rewardCategories: true }
  });
  res.status(201).json({ card });
}

export async function updateCardHandler(req: Request, res: Response) {
  const card = await prisma.creditCard.update({
    where: { id: String(req.params.id) },
    data: {
      ...req.body,
      hasNoAnnualFee: req.body.annualFee === 0
    },
    include: { rewardCategories: true }
  });
  res.json({ card });
}
