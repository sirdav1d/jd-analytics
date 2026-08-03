import "server-only";
import { z } from "zod";
import { LINX_PRODUCTION_URL } from "./client";

const envSchema = z.object({
  LINX_API_KEY: z.string().uuid(),
  LINX_API_USER: z.string().min(1).default("linx_export"),
  LINX_API_PASSWORD: z.string().min(1).default("linx_export"),
});

export type LinxConfig = ReturnType<typeof readLinxConfig>;

export function readLinxConfig() {
  const env = envSchema.parse(process.env);
  return {
    endpoint: LINX_PRODUCTION_URL,
    key: env.LINX_API_KEY,
    user: env.LINX_API_USER,
    password: env.LINX_API_PASSWORD,
  };
}

export function getPublicLinxConfig() {
  return { endpoint: LINX_PRODUCTION_URL };
}
