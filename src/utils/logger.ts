const timestamp = (): string => new Date().toISOString();

export const logger = {
  info: (message: string, meta?: unknown): void => {
    // Keep logs structured but minimal for MVP debugging.
    console.log(JSON.stringify({ level: "info", at: timestamp(), message, meta }));
  },
  error: (message: string, meta?: unknown): void => {
    console.error(JSON.stringify({ level: "error", at: timestamp(), message, meta }));
  }
};
