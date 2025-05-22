import * as React from "react";
import {
  Controller,
  FormProvider as RHFProvider,
  useFormContext,
  useFormState,
} from "react-hook-form";

const Form = RHFProvider;

function FormField({ name, render }: { name: string; render: any }) {
  const { control } = useFormContext();
  return <Controller name={name} control={control} render={render} />;
}

function FormItem({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

function FormLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium">{children}</label>;
}

function FormControl({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function FormMessage({ name }: { name?: string }) {
  const { errors } = useFormState();
  const message = name && errors[name]?.message;
  return message ? (
    <p className="text-sm text-red-500">{String(message)}</p>
  ) : null;
}

export { Form, FormControl, FormField, FormItem, FormLabel, FormMessage };
