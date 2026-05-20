import type { Request, Response } from "express";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/prisma.js";

export const cardSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  network: z.string().optional(),
  annualFee: z.number().nonnegative(),
  rewardType: z.string().min(1),
  rewardCurrency: z.string().min(1).optional(),
  baseRate: z.number().nonnegative().optional(),
  pointValueCents: z.number().nonnegative().optional(),
  rewardRules: z.record(z.unknown()).or(z.array(z.unknown())).optional(),
  categoryCaps: z.record(z.unknown()).optional(),
  credits: z.array(z.unknown()).optional(),
  signupBonus: z.record(z.unknown()).optional(),
  signupBonusValue: z.number().nonnegative().optional(),
  foreignTransactionFee: z.number().nonnegative().optional(),
  isStudentCard: z.boolean().optional(),
  bestFor: z.array(z.string()).optional(),
  applyUrl: z.string().url().optional(),
  sourceUrl: z.string().url().optional(),
  lastVerified: z.coerce.date().optional(),
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
      network: req.body.network,
      annualFee: req.body.annualFee,
      rewardType: req.body.rewardType,
      rewardCurrency: req.body.rewardCurrency,
      baseRate: req.body.baseRate,
      pointValueCents: req.body.pointValueCents,
      rewardRules: req.body.rewardRules,
      categoryCaps: req.body.categoryCaps,
      credits: req.body.credits,
      signupBonus: req.body.signupBonus,
      signupBonusValue: req.body.signupBonusValue,
      foreignTransactionFee: req.body.foreignTransactionFee,
      isStudentCard: req.body.isStudentCard ?? false,
      hasNoAnnualFee: req.body.annualFee === 0,
      bestFor: req.body.bestFor,
      applyUrl: req.body.applyUrl,
      sourceUrl: req.body.sourceUrl,
      lastVerified: req.body.lastVerified,
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
    data: buildCardUpdateData(req.body),
    include: { rewardCategories: true }
  });
  res.json({ card });
}

export function buildCardUpdateData(body: Partial<z.infer<typeof cardSchema>>) {
  const data: Prisma.CreditCardUpdateInput = {};

  if (body.name !== undefined) data.name = body.name;
  if (body.issuer !== undefined) data.issuer = body.issuer;
  if (body.network !== undefined) data.network = body.network;
  if (body.rewardType !== undefined) data.rewardType = body.rewardType;
  if (body.rewardCurrency !== undefined) data.rewardCurrency = body.rewardCurrency;
  if (body.baseRate !== undefined) data.baseRate = body.baseRate;
  if (body.pointValueCents !== undefined) data.pointValueCents = body.pointValueCents;
  if (body.rewardRules !== undefined) data.rewardRules = body.rewardRules as Prisma.InputJsonValue;
  if (body.categoryCaps !== undefined) data.categoryCaps = body.categoryCaps as Prisma.InputJsonValue;
  if (body.credits !== undefined) data.credits = body.credits as Prisma.InputJsonValue;
  if (body.signupBonus !== undefined) data.signupBonus = body.signupBonus as Prisma.InputJsonValue;
  if (body.signupBonusValue !== undefined) data.signupBonusValue = body.signupBonusValue;
  if (body.foreignTransactionFee !== undefined) data.foreignTransactionFee = body.foreignTransactionFee;
  if (body.isStudentCard !== undefined) data.isStudentCard = body.isStudentCard;
  if (body.bestFor !== undefined) data.bestFor = body.bestFor;
  if (body.applyUrl !== undefined) data.applyUrl = body.applyUrl;
  if (body.sourceUrl !== undefined) data.sourceUrl = body.sourceUrl;
  if (body.lastVerified !== undefined) data.lastVerified = body.lastVerified;

  if (body.annualFee !== undefined) {
    data.annualFee = body.annualFee;
    data.hasNoAnnualFee = body.annualFee === 0;
  }

  if (body.rewardCategories !== undefined) {
    data.rewardCategories = {
      deleteMany: {},
      create: body.rewardCategories
    };
  }

  return data;
}
