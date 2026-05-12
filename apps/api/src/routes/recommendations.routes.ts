import { Router } from "express";
import {
  getRecommendationsHandler,
  recommendationFilterSchema,
  recommendationHistoryHandler,
  runRecommendationsHandler
} from "../controllers/recommendations.controller.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validateRequest.js";

export const recommendationsRoutes = Router();

recommendationsRoutes.use(requireAuth);
recommendationsRoutes.get("/", getRecommendationsHandler);
recommendationsRoutes.post("/run", validateBody(recommendationFilterSchema), runRecommendationsHandler);
recommendationsRoutes.get("/history", recommendationHistoryHandler);
