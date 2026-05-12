import { Router } from "express";
import {
  cardSchema,
  createCardHandler,
  getCardHandler,
  listCardsHandler,
  updateCardHandler
} from "../controllers/cards.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validateRequest.js";

export const cardsRoutes = Router();

cardsRoutes.get("/", asyncHandler(listCardsHandler));
cardsRoutes.get("/:id", asyncHandler(getCardHandler));
cardsRoutes.post("/", requireAuth, requireAdmin, validateBody(cardSchema), asyncHandler(createCardHandler));
cardsRoutes.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  validateBody(cardSchema.partial()),
  asyncHandler(updateCardHandler)
);
