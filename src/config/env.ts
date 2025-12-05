import z from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  PORT: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1).max(65535))
    .default(3000),

  DATABASE_URL: z.url(),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.string().transform(Number).pipe(z.number()).default(6379),
  REDIS_PASSWORD: z.string().optional(),

  BASE_URL: z.url(),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Invalid environment variables:");
    console.error(JSON.stringify(z.treeifyError(result.error), null, 2));
    process.exit(1);
  }

  return result.data;
};

export const env = parseEnv();
