import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import {
  createLinkToken,
  exchangePublicToken,
  removePlaidItem,
  syncTransactions
} from "../services/plaid.service.js";

export const exchangePublicTokenSchema = z.object({
  publicToken: z.string().min(1)
});

export async function createLinkTokenHandler(req: Request, res: Response) {
  const token = await createLinkToken(req.user!);
  res.json(token);
}

export async function exchangePublicTokenHandler(req: Request, res: Response) {
  const item = await exchangePublicToken(req.user!.id, req.body.publicToken);
  res.status(201).json({
    item: {
      id: item.id,
      institutionName: item.institutionName,
      status: item.status
    }
  });
}

export async function syncTransactionsHandler(req: Request, res: Response) {
  const result = await syncTransactions(req.user!.id);
  res.json(result);
}

export async function listPlaidItemsHandler(req: Request, res: Response) {
  const items = await prisma.plaidItem.findMany({
    where: { userId: req.user!.id },
    select: {
      id: true,
      institutionName: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      accounts: {
        select: {
          id: true,
          name: true,
          mask: true,
          type: true,
          subtype: true
        }
      }
    }
  });

  res.json({ items });
}

export async function deletePlaidItemHandler(req: Request, res: Response) {
  await removePlaidItem(req.user!.id, String(req.params.itemId));
  res.status(204).send();
}
