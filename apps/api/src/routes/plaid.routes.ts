import { Router } from "express";
import {
  createLinkTokenHandler,
  deletePlaidItemHandler,
  exchangePublicTokenHandler,
  exchangePublicTokenSchema,
  listPlaidItemsHandler,
  syncTransactionsHandler
} from "../controllers/plaid.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validateRequest.js";

export const plaidRoutes = Router();

plaidRoutes.use(requireAuth);
plaidRoutes.post("/link-token", asyncHandler(createLinkTokenHandler));
plaidRoutes.post(
  "/exchange-public-token",
  validateBody(exchangePublicTokenSchema),
  asyncHandler(exchangePublicTokenHandler)
);
plaidRoutes.post("/sync-transactions", asyncHandler(syncTransactionsHandler));
plaidRoutes.get("/items", asyncHandler(listPlaidItemsHandler));
plaidRoutes.delete("/items/:itemId", asyncHandler(deletePlaidItemHandler));
