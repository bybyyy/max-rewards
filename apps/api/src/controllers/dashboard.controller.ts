import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { monthsAgo } from "../utils/dates.js";

export async function dashboardSummaryHandler(req: Request, res: Response) {
  const [transactionCount, connectedItems, aggregates] = await Promise.all([
    prisma.transaction.count({ where: { userId: req.user!.id } }),
    prisma.plaidItem.count({ where: { userId: req.user!.id, status: "active" } }),
    prisma.spendingAggregate.findMany({ where: { userId: req.user!.id } })
  ]);

  const totalSpend = aggregates.reduce((sum, aggregate) => sum + Number(aggregate.totalAmount), 0);

  res.json({
    transactionCount,
    connectedItems,
    totalSpend,
    categoryCount: new Set(aggregates.map((aggregate) => aggregate.categoryPrimary)).size
  });
}

export async function spendingByCategoryHandler(req: Request, res: Response) {
  const from = req.query.from ? new Date(String(req.query.from)) : monthsAgo(12);
  const to = req.query.to ? new Date(String(req.query.to)) : new Date();

  const transactions = await prisma.transaction.groupBy({
    by: ["categoryPrimary"],
    where: {
      userId: req.user!.id,
      pending: false,
      date: { gte: from, lte: to },
      categoryPrimary: { not: "transfer" }
    },
    _sum: { amount: true },
    _count: true
  });

  res.json({
    categories: transactions
      .map((row) => ({
        category: row.categoryPrimary,
        total: Number(row._sum.amount ?? 0),
        transactionCount: row._count
      }))
      .sort((a, b) => b.total - a.total)
  });
}

export async function monthlyTrendsHandler(req: Request, res: Response) {
  const months = Number(req.query.months ?? 12);
  const minMonth = monthsAgo(months).toISOString().slice(0, 7);
  const aggregates = await prisma.spendingAggregate.findMany({
    where: { userId: req.user!.id, month: { gte: minMonth } },
    orderBy: { month: "asc" }
  });

  const byMonth = new Map<string, number>();
  for (const aggregate of aggregates) {
    byMonth.set(aggregate.month, (byMonth.get(aggregate.month) ?? 0) + Number(aggregate.totalAmount));
  }

  res.json({
    trends: [...byMonth.entries()].map(([month, total]) => ({ month, total }))
  });
}

export async function topMerchantsHandler(req: Request, res: Response) {
  const limit = Number(req.query.limit ?? 10);
  const merchants = await prisma.transaction.groupBy({
    by: ["merchantName"],
    where: {
      userId: req.user!.id,
      pending: false,
      merchantName: { not: null },
      categoryPrimary: { not: "transfer" }
    },
    _sum: { amount: true },
    _count: true,
    orderBy: { _sum: { amount: "desc" } },
    take: limit
  });

  res.json({
    merchants: merchants.map((merchant) => ({
      merchantName: merchant.merchantName,
      total: Number(merchant._sum.amount ?? 0),
      transactionCount: merchant._count
    }))
  });
}

export async function transactionsHandler(req: Request, res: Response) {
  const range = String(req.query.range ?? "30d");
  const today = new Date();
  const from = getRangeStart(range, today);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: req.user!.id,
      date: { gte: from, lte: today }
    },
    orderBy: { date: "desc" },
    take: 500,
    select: {
      id: true,
      merchantName: true,
      name: true,
      amount: true,
      date: true,
      categoryPrimary: true,
      pending: true,
      account: {
        select: {
          name: true,
          mask: true
        }
      }
    }
  });

  res.json({
    transactions: transactions.map((transaction) => ({
      id: transaction.id,
      merchant: transaction.merchantName ?? transaction.name,
      name: transaction.name,
      amount: Number(transaction.amount),
      date: transaction.date.toISOString(),
      category: transaction.categoryPrimary,
      pending: transaction.pending,
      accountName: transaction.account.name,
      accountMask: transaction.account.mask
    }))
  });
}

function getRangeStart(range: string, today: Date) {
  const start = new Date(today);
  start.setUTCHours(0, 0, 0, 0);

  if (range === "this_month") {
    start.setUTCDate(1);
    return start;
  }

  if (range === "ytd") {
    start.setUTCMonth(0, 1);
    return start;
  }

  if (range === "1y") {
    start.setUTCFullYear(start.getUTCFullYear() - 1);
    return start;
  }

  start.setUTCDate(start.getUTCDate() - 30);
  return start;
}
