import { Router } from "express";
import {
  cardSchema,
  createCardHandler,
  getCardHandler,
  listCardsHandler,
  updateCardHandler
} from "../controllers/cards.controller.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validateRequest.js";

export const cardsRoutes = Router();

cardsRoutes.get("/", listCardsHandler);
cardsRoutes.get("/:id", getCardHandler);
cardsRoutes.post("/", requireAuth, requireAdmin, validateBody(cardSchema), createCardHandler);
cardsRoutes.patch("/:id", requireAuth, requireAdmin, validateBody(cardSchema.partial()), updateCardHandler);
