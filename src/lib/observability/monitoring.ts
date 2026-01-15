"use client";

type MonitoringLevel = "error" | "warning" | "info";

interface MonitoringContext {
  [key: string]: unknown;
}

interface MonitoringPayload {
  level: MonitoringLevel;
  type: "exception" | "message" | "event";
  message?: string;
  error?: {
    name?: string;
    message?: string;
    stack?: string;
  };
  context?: MonitoringContext;
  timestamp: string;
}

const isDev = process.env.NODE_ENV !== "production";

const normalizeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    name: "NonError",
    message: String(error),
    stack: undefined,
  };
};

const sendToCollector = (payload: MonitoringPayload) => {
  if (typeof window === "undefined") return;

  if (isDev) {
    // Em desenvolvimento, apenas loga estruturado no console
    console.log("[Monitor]", payload);
  }

  // Ponto de extensão: aqui poderíamos integrar com Sentry, LogRocket, etc.
  // Exemplo (não habilitado por padrão):
  // if ((window as any).Sentry && payload.type === "exception" && payload.error) {
  //   (window as any).Sentry.captureException(new Error(payload.error.message ?? "Unknown error"));
  // }
};

export const captureException = (
  error: unknown,
  context?: MonitoringContext
) => {
  const normalized = normalizeError(error);

  const payload: MonitoringPayload = {
    level: "error",
    type: "exception",
    error: normalized,
    context,
    timestamp: new Date().toISOString(),
  };

  sendToCollector(payload);
};

export const captureMessage = (
  message: string,
  level: MonitoringLevel = "info",
  context?: MonitoringContext
) => {
  const payload: MonitoringPayload = {
    level,
    type: "message",
    message,
    context,
    timestamp: new Date().toISOString(),
  };

  sendToCollector(payload);
};

export const captureEvent = (
  name: string,
  context?: MonitoringContext
) => {
  const payload: MonitoringPayload = {
    level: "info",
    type: "event",
    message: name,
    context,
    timestamp: new Date().toISOString(),
  };

  sendToCollector(payload);
};

