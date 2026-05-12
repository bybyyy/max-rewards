import {
  Configuration,
  CountryCode,
  LinkTokenCreateRequest,
  PlaidApi,
  PlaidEnvironments,
  Products
} from "plaid";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { HttpError } from "../middleware/errorHandler.js";
import { decryptSecret, encryptSecret } from "./encryption.service.js";
import { upsertAccounts, upsertTransactions } from "./transaction.service.js";

const configuration = new Configuration({
  basePath: PlaidEnvironments[env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": env.PLAID_CLIENT_ID ?? "",
      "PLAID-SECRET": env.PLAID_SECRET ?? ""
    }
  }
});

const plaid = new PlaidApi(configuration);

export async function createLinkToken(user: { id: string; email: string }) {
  assertPlaidConfigured();

  const request: LinkTokenCreateRequest = {
    user: { client_user_id: user.id },
    client_name: "Max Rewards",
    products: [Products.Transactions],
    country_codes: [CountryCode.Us],
    language: "en",
    webhook: undefined
  };

  const response = await plaid.linkTokenCreate(request);
  return response.data;
}

export async function exchangePublicToken(userId: string, publicToken: string) {
  assertPlaidConfigured();

  const exchange = await plaid.itemPublicTokenExchange({ public_token: publicToken });
  const accessToken = exchange.data.access_token;
  const itemId = exchange.data.item_id;

  const item = await plaid.itemGet({ access_token: accessToken });
  const institutionId = item.data.item.institution_id;
  let institutionName: string | null = null;

  if (institutionId) {
    const institution = await plaid.institutionsGetById({
      institution_id: institutionId,
      country_codes: [CountryCode.Us]
    });
    institutionName = institution.data.institution.name;
  }

  const plaidItem = await prisma.plaidItem.create({
    data: {
      userId,
      plaidItemId: itemId,
      encryptedAccessToken: encryptSecret(accessToken),
      institutionName
    }
  });

  const accounts = await plaid.accountsGet({ access_token: accessToken });
  await upsertAccounts(userId, plaidItem.id, accounts.data.accounts);

  return plaidItem;
}

export async function syncTransactions(userId: string) {
  assertPlaidConfigured();

  const items = await prisma.plaidItem.findMany({ where: { userId, status: "active" } });
  let addedCount = 0;

  for (const item of items) {
    const accessToken = decryptSecret(item.encryptedAccessToken);
    let cursor = item.transactionsCursor ?? undefined;
    let hasMore = true;

    while (hasMore) {
      const response = await plaid.transactionsSync({
        access_token: accessToken,
        cursor,
        count: 500
      });

      await upsertTransactions(userId, response.data.added.concat(response.data.modified));
      addedCount += response.data.added.length + response.data.modified.length;

      if (response.data.removed.length > 0) {
        await prisma.transaction.deleteMany({
          where: {
            userId,
            plaidTransactionId: { in: response.data.removed.map((tx) => tx.transaction_id) }
          }
        });
      }

      cursor = response.data.next_cursor;
      hasMore = response.data.has_more;
    }

    await prisma.plaidItem.update({
      where: { id: item.id },
      data: { transactionsCursor: cursor }
    });
  }

  return { syncedTransactions: addedCount };
}

export async function removePlaidItem(userId: string, itemId: string) {
  const item = await prisma.plaidItem.findFirst({ where: { id: itemId, userId } });
  if (!item) {
    throw new HttpError(404, "Plaid item not found");
  }

  if (env.PLAID_CLIENT_ID && env.PLAID_SECRET) {
    await plaid.itemRemove({ access_token: decryptSecret(item.encryptedAccessToken) });
  }

  await prisma.plaidItem.delete({ where: { id: itemId } });
}

function assertPlaidConfigured() {
  if (!env.PLAID_CLIENT_ID || !env.PLAID_SECRET) {
    throw new HttpError(500, "Plaid credentials are not configured");
  }
}
