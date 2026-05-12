import { Router } from "express";
import {
  authSchema,
  loginHandler,
  logoutHandler,
  meHandler,
  signupHandler
} from "../controllers/auth.controller.js";
import { authRateLimiter } from "../config/security.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validateRequest.js";

export const authRoutes = Router();

authRoutes.post("/signup", authRateLimiter, validateBody(authSchema), asyncHandler(signupHandler));
authRoutes.post("/login", authRateLimiter, validateBody(authSchema.omit({ name: true })), asyncHandler(loginHandler));
authRoutes.post("/logout", logoutHandler);
authRoutes.get("/me", requireAuth, asyncHandler(meHandler));
