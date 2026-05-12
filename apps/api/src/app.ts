import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { apiRateLimiter } from "./config/security.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRoutes } from "./routes/auth.routes.js";
import { cardsRoutes } from "./routes/cards.routes.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";
import { plaidRoutes } from "./routes/plaid.routes.js";
import { recommendationsRoutes } from "./routes/recommendations.routes.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.WEB_ORIGIN,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(apiRateLimiter);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/plaid", plaidRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cards", cardsRoutes);
app.use("/api/recommendations", recommendationsRoutes);

app.use(errorHandler);
