"use client";

import { useEffect } from "react";
import { captureException } from "@/lib/observability/monitoring";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    captureException(error, {
      scope: "global-error",
      digest: error.digest,
    });
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="max-w-md w-full border rounded-lg p-6 shadow-sm space-y-4">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Algo deu errado</h1>
            <p className="text-sm text-muted-foreground">
              Registramos o erro para análise. Você pode tentar novamente ou
              voltar para a página inicial.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={reset}
              variant="default"
              className="flex-1"
            >
              Tentar novamente
            </Button>
            <Link href="/" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Ir para o início
              </Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
