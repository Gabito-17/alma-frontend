"use server";

import { loginSchema } from "@/lib/validators/login-schema";
import { z } from "zod";

type LoginData = z.infer<typeof loginSchema>;
type LoginResult =
  | { success: true; accessToken: string }
  | { success: false; message: string };

export async function loginUser(data: LoginData): Promise<LoginResult> {
  try {
    const res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json();
      return {
        success: false,
        message: err.message ?? "Credenciales inválidas",
      };
    }

    const { access_token } = await res.json();
    return { success: true, accessToken: access_token };
  } catch {
    return { success: false, message: "No se pudo conectar con el servidor" };
  }
}
