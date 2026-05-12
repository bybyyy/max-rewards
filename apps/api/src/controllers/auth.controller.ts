import type { Request, Response } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { createSessionToken, login, signup, toSafeUser } from "../services/auth.service.js";

export const authSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8),
  name: z.string().min(1).optional()
});

const cookieOptions = {
  httpOnly: true,
  secure: env.WEB_ORIGIN.startsWith("https://"),
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export async function signupHandler(req: Request, res: Response) {
  const user = await signup(req.body.email, req.body.password, req.body.name);
  res.cookie("session", createSessionToken(user), cookieOptions);
  res.status(201).json({ user });
}

export async function loginHandler(req: Request, res: Response) {
  const user = await login(req.body.email, req.body.password);
  res.cookie("session", createSessionToken(user), cookieOptions);
  res.json({ user });
}

export function logoutHandler(_req: Request, res: Response) {
  res.clearCookie("session", cookieOptions);
  res.status(204).send();
}

export async function meHandler(req: Request, res: Response) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.id } });
  res.json({ user: toSafeUser(user) });
}
