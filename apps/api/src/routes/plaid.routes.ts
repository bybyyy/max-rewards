import { Router } from "express";
import {
  createLinkTokenHandler,
  deletePlaidItemHandler,
  exchangePublicTokenHandler,
  exchangePublicTokenSchema,
  listPlaidItemsHandler,
  syncTransactionsHandler
} from "../controllers/plaid.controller.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validateRequest.js";

export const plaidRoutes = Router();

plaidRoutes.use(requireAuth);
plaidRoutes.post("/link-token", createLinkTokenHandler);
plaidRoutes.post(
  "/exchange-public-token",
  validateBody(exchangePublicTokenSchema),
  exchangePublicTokenHandler
);
plaidRoutes.post("/sync-transactions", syncTransactionsHandler);
plaidRoutes.get("/items", listPlaidItemsHandler);
plaidRoutes.delete("/items/:itemId", deletePlaidItemHandler);
