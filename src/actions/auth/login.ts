"use server";

import { loginSchema } from "@/lib/validators/login-schema";
import { cookies } from "next/headers";
import { z } from "zod";

type LoginData = z.infer<typeof loginSchema>;
type LoginResult =
  | { success: true; accessToken: string }
  | { success: false; message: string };

export async function loginUser(data: LoginData): Promise<LoginResult> {
  //Validamos los datos antes de enviarlos
  const validated = loginSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, message: "Datos inválidos" };
  }
  try {
    //Envia peticion al backend
    const res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    //Valida la respuesta
    if (!res.ok) {
      const err = await res.json();
      return {
        success: false,
        message: err.message ?? "Credenciales inválidas",
      };
    }

    //Obtenemos el token desde el backend
    const { access_token } = await res.json();
    //Devuelve el acces_token
    //Guardamos el token en una cookie HttpOnly desde el servidor
    (await cookies()).set("token", access_token, {
      httpOnly: true, // No accesible por JavaScript
      secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
      path: "/", // Disponible para todo el sitio
      maxAge: 60 * 60 * 24, // 1 día
    });
    return { success: true, accessToken: access_token };
  } catch {
    return { success: false, message: "No se pudo conectar con el servidor" };
  }
}
