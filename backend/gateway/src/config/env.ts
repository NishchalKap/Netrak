import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.string().default('development'),
  JWT_SECRET: z.string().default('mock-secret-key-for-sprint'),
  DATABASE_URL: z.string().default('postgresql://mock:mock@localhost:5432/mockdb'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
