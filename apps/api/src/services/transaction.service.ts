import type { AccountBase, Transaction } from "plaid";
import { prisma } from "../config/prisma.js";
import { normalizePlaidCategory } from "../utils/categoryMapping.js";
import { rebuildSpendingAggregates } from "./aggregation.service.js";

export async function upsertAccounts(
  userId: string,
  plaidItemId: string,
  accounts: AccountBase[]
) {
  await Promise.all(
    accounts.map((account) =>
      prisma.account.upsert({
        where: { plaidAccountId: account.account_id },
        update: {
          name: account.name,
          mask: account.mask ?? null,
          type: String(account.type),
          subtype: account.subtype ? String(account.subtype) : null
        },
        create: {
          userId,
          plaidItemId,
          plaidAccountId: account.account_id,
          name: account.name,
          mask: account.mask ?? null,
          type: String(account.type),
          subtype: account.subtype ? String(account.subtype) : null
        }
      })
    )
  );
}

export async function upsertTransactions(userId: string, transactions: Transaction[]) {
  const accounts = await prisma.account.findMany({ where: { userId } });
  const accountsByPlaidId = new Map(accounts.map((account) => [account.plaidAccountId, account]));

  for (const tx of transactions) {
    const account = accountsByPlaidId.get(tx.account_id);
    if (!account) continue;

    const detailed = tx.personal_finance_category?.detailed ?? tx.category?.[1] ?? null;
    const primary = normalizePlaidCategory(
      tx.personal_finance_category?.primary ?? tx.category?.[0] ?? null,
      detailed
    );

    await prisma.transaction.upsert({
      where: { plaidTransactionId: tx.transaction_id },
      update: {
        merchantName: tx.merchant_name ?? null,
        name: tx.name,
        amount: tx.amount,
        isoCurrencyCode: tx.iso_currency_code ?? null,
        date: new Date(tx.date),
        categoryPrimary: primary,
        categoryDetailed: detailed,
        pending: tx.pending
      },
      create: {
        userId,
        accountId: account.id,
        plaidTransactionId: tx.transaction_id,
        merchantName: tx.merchant_name ?? null,
        name: tx.name,
        amount: tx.amount,
        isoCurrencyCode: tx.iso_currency_code ?? null,
        date: new Date(tx.date),
        categoryPrimary: primary,
        categoryDetailed: detailed,
        pending: tx.pending
      }
    });
  }

  await rebuildSpendingAggregates(userId);
}
