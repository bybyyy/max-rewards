import { prisma } from "../config/prisma.js";
import { toMonthKey } from "../utils/dates.js";

export async function rebuildSpendingAggregates(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      pending: false,
      categoryPrimary: { not: "transfer" }
    }
  });

  await prisma.spendingAggregate.deleteMany({ where: { userId } });

  const buckets = new Map<string, { total: number; count: number; month: string; category: string }>();

  for (const tx of transactions) {
    const amount = Number(tx.amount);
    if (amount <= 0) continue;

    const month = toMonthKey(tx.date);
    const key = `${month}:${tx.categoryPrimary}`;
    const current = buckets.get(key) ?? {
      total: 0,
      count: 0,
      month,
      category: tx.categoryPrimary
    };
    current.total += amount;
    current.count += 1;
    buckets.set(key, current);
  }

  await Promise.all(
    [...buckets.values()].map((bucket) =>
      prisma.spendingAggregate.create({
        data: {
          userId,
          month: bucket.month,
          categoryPrimary: bucket.category,
          totalAmount: bucket.total,
          transactionCount: bucket.count
        }
      })
    )
  );
}
