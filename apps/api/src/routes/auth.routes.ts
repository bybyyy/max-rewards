import { Router } from "express";
import {
  authSchema,
  loginHandler,
  logoutHandler,
  meHandler,
  signupHandler
} from "../controllers/auth.controller.js";
import { authRateLimiter } from "../config/security.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validateRequest.js";

export const authRoutes = Router();

authRoutes.post("/signup", authRateLimiter, validateBody(authSchema), signupHandler);
authRoutes.post("/login", authRateLimiter, validateBody(authSchema.omit({ name: true })), loginHandler);
authRoutes.post("/logout", logoutHandler);
authRoutes.get("/me", requireAuth, meHandler);
