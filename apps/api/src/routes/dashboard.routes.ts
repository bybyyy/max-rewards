import { Router } from "express";
import {
  dashboardSummaryHandler,
  monthlyTrendsHandler,
  spendingByCategoryHandler,
  topMerchantsHandler
} from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const dashboardRoutes = Router();

dashboardRoutes.use(requireAuth);
dashboardRoutes.get("/summary", dashboardSummaryHandler);
dashboardRoutes.get("/spending-by-category", spendingByCategoryHandler);
dashboardRoutes.get("/monthly-trends", monthlyTrendsHandler);
dashboardRoutes.get("/top-merchants", topMerchantsHandler);
