import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Bienvenido a ALMA</h1>
        <p className="text-muted-foreground text-sm">
          Esta es una prueba para verificar que Tailwind CSS y ShadCN UI están
          funcionando correctamente.
        </p>
        <Button className="w-full">¡Funciona!</Button>
      </div>
    </main>
  );
}
