import { RegisterForm } from "@/components/auth/register-form";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Image
          src="/login-medic.svg"
          alt="Bienvenido al Policonsultorio"
          className="w-full h-auto p-32"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}
