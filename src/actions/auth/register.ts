"use server";

import { registerSchema } from "@/lib/validators/register-schema";
import { z } from "zod";

export async function registerUser(data: z.infer<typeof registerSchema>) {
  try {
    // llamada a API del backend NestJS
    const response = await fetch(`${process.env.API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const { message } = await response.json();
      return { success: false, message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "Error: no se pudo registrar el usuario",
    };
  }
}
