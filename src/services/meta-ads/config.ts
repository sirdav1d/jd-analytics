import "server-only";
import { z } from "zod";

const schema = z.object({
  META_AD_ACCOUNT_ID: z.string().regex(/^(?:act_)?\d+$/u),
  META_ACCESS_TOKEN: z.string().min(20),
});

export type MetaAdsConfig = {
  accountId: string;
  accessToken: string;
  apiVersion: "v25.0";
};

export function readMetaAdsConfig(): MetaAdsConfig {
  const env = schema.parse(process.env);
  return {
    accountId: env.META_AD_ACCOUNT_ID,
    accessToken: env.META_ACCESS_TOKEN,
    apiVersion: "v25.0",
  };
}
