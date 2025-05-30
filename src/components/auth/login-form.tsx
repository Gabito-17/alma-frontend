"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { loginUser } from "@/actions/auth/login";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { loginSchema } from "@/lib/validators/login-schema";

type Inputs = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const form = useForm<Inputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  /** ---------- onSubmit ----------- */
  const onSubmit = async (values: Inputs) => {
    setServerError("");
    const result = await loginUser(values);

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    // Guarda el token
    localStorage.setItem("access_token", result.accessToken);

    // Opcional: muestra toast de éxito
    // toast.success("¡Bienvenido nuevamente!");

    router.push("/dashboard");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
          <p className="text-muted-foreground text-sm">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <div className="grid gap-6">
          {/* Email */}
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="m@example.com" {...field} />
                </FormControl>
                <FormMessage name="email" />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage name="password" />
              </FormItem>
            )}
          />

          {serverError && (
            <p className="text-red-500 text-sm text-center">{serverError}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Ingresando..." : "Ingresar"}
          </Button>
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Ingresando..."
              : "Iniciar con Google"}
          </Button>
        </div>

        <div className="text-center text-sm">
          ¿No tienes cuenta?
          <a href="/register" className="underline underline-offset-4">
            Crea una
          </a>
        </div>
      </form>
    </Form>
  );
}
