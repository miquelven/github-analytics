import "server-only";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  [key: string]: unknown;
}

const isDev = process.env.NODE_ENV !== "production";

const formatPayload = (
  level: LogLevel,
  message: string,
  context?: LogContext
) => {
  return {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  };
};

export const logDebug = (message: string, context?: LogContext) => {
  if (!isDev) return;
  const payload = formatPayload("debug", message, context);
  console.debug("[App]", payload);
};

export const logInfo = (message: string, context?: LogContext) => {
  const payload = formatPayload("info", message, context);
  if (isDev) {
    console.info("[App]", payload);
  }
};

export const logWarn = (message: string, context?: LogContext) => {
  const payload = formatPayload("warn", message, context);
  console.warn("[App]", payload);
};

export const logError = (message: string, context?: LogContext) => {
  const payload = formatPayload("error", message, context);
  if (isDev) {
    console.warn("[App][error]", payload);
  } else {
    console.error("[App]", payload);
  }
};
