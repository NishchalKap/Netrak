import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const DEVELOPMENT_JWT_SECRET = 'netrak-development-only-secret-change-before-release';
const DEVELOPMENT_DATABASE_URL = 'postgresql://mock:mock@localhost:5432/mockdb';
const booleanString = z.enum(['true', 'false']).transform((value) => value === 'true');
const optionalUrl = z.preprocess((value) => value === '' ? undefined : value, z.string().url().optional());
const optionalSecret = z.preprocess((value) => value === '' ? undefined : value, z.string().min(1).optional());

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().max(65535).default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  JWT_SECRET: z.string().min(32).default(DEVELOPMENT_JWT_SECRET),
  JWT_ISSUER: z.string().min(1).default('netrak-gateway'),
  JWT_AUDIENCE: z.string().min(1).default('netrak-clients'),
  DATABASE_URL: z.string().min(1).default(DEVELOPMENT_DATABASE_URL),
  CORS_ORIGINS: z.string().default('http://localhost:8081,http://localhost:4173'),
  TRUST_PROXY: booleanString.default(false),
  API_DOCS_ENABLED: booleanString.optional(),
  PUBLIC_API_URL: optionalUrl,
  ALLOW_PRIVILEGED_REGISTRATION: booleanString.default(false),
  SUPABASE_URL: optionalUrl,
  SUPABASE_SERVICE_ROLE_KEY: optionalSecret,
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Environment validation failed', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const values = parsed.data;
const productionErrors: string[] = [];

if (values.NODE_ENV === 'production') {
  if (values.JWT_SECRET === DEVELOPMENT_JWT_SECRET) productionErrors.push('JWT_SECRET must be explicitly configured');
  if (values.DATABASE_URL === DEVELOPMENT_DATABASE_URL) productionErrors.push('DATABASE_URL must be explicitly configured');
  if (values.CORS_ORIGINS.split(',').some((origin) => origin.trim() === '*')) productionErrors.push('CORS_ORIGINS cannot contain a wildcard');
}

if (productionErrors.length) {
  console.error('Production environment validation failed', productionErrors);
  process.exit(1);
}

export const env = {
  ...values,
  API_DOCS_ENABLED: values.API_DOCS_ENABLED ?? values.NODE_ENV !== 'production',
  CORS_ORIGINS: values.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean),
};
