import { apiFetch } from "./apiClient";

export type SafeUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

export async function getMe() {
  return apiFetch<{ user: SafeUser }>("/auth/me");
}

export async function login(email: string, password: string) {
  return apiFetch<{ user: SafeUser }>("/auth/login", {
    method: "POST",
    json: { email, password }
  });
}

export async function signup(email: string, password: string, name?: string) {
  return apiFetch<{ user: SafeUser }>("/auth/signup", {
    method: "POST",
    json: { email, password, name }
  });
}

export async function logout() {
  return apiFetch<void>("/auth/logout", { method: "POST" });
}
