import { Router } from "express";
import {
  getRecommendationsHandler,
  recommendationFilterSchema,
  recommendationHistoryHandler,
  runRecommendationsHandler
} from "../controllers/recommendations.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validateRequest.js";

export const recommendationsRoutes = Router();

recommendationsRoutes.use(requireAuth);
recommendationsRoutes.get("/", asyncHandler(getRecommendationsHandler));
recommendationsRoutes.post(
  "/run",
  validateBody(recommendationFilterSchema),
  asyncHandler(runRecommendationsHandler)
);
recommendationsRoutes.get("/history", asyncHandler(recommendationHistoryHandler));
