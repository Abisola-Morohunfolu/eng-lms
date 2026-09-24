import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  DATABASE_URL: z.string().min(1),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_CALLBACK_URL: z.string().url(),

  JWT_SECRET: z.string().min(16),
  POST_LOGIN_REDIRECT: z.string().url(),
  WEB_ORIGIN: z.string().url().default("http://localhost:5173"),

  SESSION_COOKIE_NAME: z.string().min(1).default("eda_session"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Environment validation failed");
}

export const envs = parsed.data;

export const isProd = envs.NODE_ENV === "production";
