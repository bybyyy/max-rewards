import { Router } from "express";
import {
  dashboardSummaryHandler,
  monthlyTrendsHandler,
  spendingByCategoryHandler,
  topMerchantsHandler,
  transactionsHandler
} from "../controllers/dashboard.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const dashboardRoutes = Router();

dashboardRoutes.use(requireAuth);
dashboardRoutes.get("/summary", asyncHandler(dashboardSummaryHandler));
dashboardRoutes.get("/spending-by-category", asyncHandler(spendingByCategoryHandler));
dashboardRoutes.get("/monthly-trends", asyncHandler(monthlyTrendsHandler));
dashboardRoutes.get("/top-merchants", asyncHandler(topMerchantsHandler));
dashboardRoutes.get("/transactions", asyncHandler(transactionsHandler));
