"use client";

import { registerUser } from "@/actions/auth/register";
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
import { registerSchema } from "@/lib/validators/register-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";

type Inputs = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<Inputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      lastName: "",
      birthDate: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: Inputs) => {
    setServerError("");
    setSuccessMessage("");

    const { confirmPassword, ...dataToSend } = values;
    void confirmPassword;
    const result = await registerUser(dataToSend as Inputs);

    if (!result.success) {
      setServerError(result.message);
    } else {
      setSuccessMessage(
        "✅ Registro exitoso. Redigirigiendo a inicio de sesion."
      );
      form.reset(); // Limpia el formulario
      setTimeout(() => {
        router.push("/login");
      }, 3000); // Espera 2 segundos para que el usuario vea el mensaje
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="name"
          render={({
            field,
          }: {
            field: ControllerRenderProps<Inputs, "name">;
          }) => (
            <FormItem>
              <FormLabel>Nombre/s</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage name="name" />
            </FormItem>
          )}
        />{" "}
        <FormField
          name="lastName"
          render={({
            field,
          }: {
            field: ControllerRenderProps<Inputs, "lastName">;
          }) => (
            <FormItem>
              <FormLabel>Apellido</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage name="lastName" />
            </FormItem>
          )}
        />{" "}
        <FormField
          name="birthDate"
          render={({
            field,
          }: {
            field: ControllerRenderProps<Inputs, "birthDate">;
          }) => (
            <FormItem>
              <FormLabel>Fecha de nacimiento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage name="birthDate" />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          render={({
            field,
          }: {
            field: ControllerRenderProps<Inputs, "email">;
          }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage name="email" />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          render={({
            field,
          }: {
            field: ControllerRenderProps<Inputs, "password">;
          }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage name="password" />
            </FormItem>
          )}
        />
        <FormField
          name="confirmPassword"
          render={({
            field,
          }: {
            field: ControllerRenderProps<Inputs, "confirmPassword">;
          }) => (
            <FormItem>
              <FormLabel>Confirmar Contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage name="confirmPassword" />
            </FormItem>
          )}
        />
        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
        {successMessage && (
          <p className="text-green-600 text-sm font-medium">{successMessage}</p>
        )}
        <Button type="submit" className="w-full">
          {form.formState.isSubmitting ? "Registrando..." : "Registrarse"}
        </Button>
        <div className="text-center text-sm">
          Ya tienes cuenta?
          <a href="/login" className="underline underline-offset-4">
            Inicia sesion
          </a>
        </div>
      </form>
    </Form>
  );
}
