import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const DEVELOPMENT_JWT_SECRET = 'netrak-development-only-secret-change-before-release';
const DEVELOPMENT_REFRESH_TOKEN_SECRET = 'netrak-development-refresh-secret-change-before-release';
const DEVELOPMENT_DATABASE_URL = 'postgresql://mock:mock@localhost:5432/mockdb';
const booleanString = z.enum(['true', 'false']).transform((value) => value === 'true');
const optionalUrl = z.preprocess((value) => value === '' ? undefined : value, z.string().url().optional());

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().max(65535).default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  JWT_SECRET: z.string().min(32).default(DEVELOPMENT_JWT_SECRET),
  REFRESH_TOKEN_SECRET: z.string().min(32).default(DEVELOPMENT_REFRESH_TOKEN_SECRET),
  JWT_ISSUER: z.string().min(1).default('netrak-gateway'),
  JWT_AUDIENCE: z.string().min(1).default('netrak-clients'),
  JWT_REFRESH_GRACE_SECONDS: z.coerce.number().int().min(60).max(3600).default(900),
  DATABASE_URL: z.string().min(1).default(DEVELOPMENT_DATABASE_URL),
  DIRECT_URL: z.string().min(1).default(DEVELOPMENT_DATABASE_URL),
  SUPABASE_URL: optionalUrl,
  SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SUPABASE_STORAGE_BUCKET: z.string().trim().min(3).max(63).regex(/^[a-z0-9][a-z0-9._-]*[a-z0-9]$/).optional(),
  CORS_ORIGINS: z.string().default('http://localhost:8081,http://localhost:4173'),
  MAX_LIST_RESULTS: z.coerce.number().int().min(50).max(1000).default(500),
  TRUST_PROXY: booleanString.default(false),
  API_DOCS_ENABLED: booleanString.optional(),
  PUBLIC_API_URL: optionalUrl,
  ALLOW_PRIVILEGED_REGISTRATION: booleanString.default(false),
  ALLOW_LEGACY_PASSWORD_MIGRATION: booleanString.default(false),
  LOAD_REFERENCE_ADVISORIES: booleanString.optional(),
  
  // AI Configuration
  AI_SPEECH_PROVIDER: z.string().default('databricks'),
  DATABRICKS_SPEECH_URL: optionalUrl,
  DATABRICKS_API_KEY: z.string().optional(),
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
  if (values.REFRESH_TOKEN_SECRET === DEVELOPMENT_REFRESH_TOKEN_SECRET) productionErrors.push('REFRESH_TOKEN_SECRET must be explicitly configured');
  if (/replace|change|example|development|secret/i.test(values.JWT_SECRET)) productionErrors.push('JWT_SECRET must not contain a known placeholder value');
  if (/replace|change|example|development|secret/i.test(values.REFRESH_TOKEN_SECRET)) productionErrors.push('REFRESH_TOKEN_SECRET must not contain a known placeholder value');
  if (values.DATABASE_URL === DEVELOPMENT_DATABASE_URL) productionErrors.push('DATABASE_URL must be explicitly configured');
  if (values.DIRECT_URL === DEVELOPMENT_DATABASE_URL) productionErrors.push('DIRECT_URL must be explicitly configured');
  if (values.SUPABASE_SERVICE_ROLE_KEY && !values.SUPABASE_URL) productionErrors.push('SUPABASE_URL is required when Supabase Storage credentials are configured');
  const suppliedSupabaseValues = [values.SUPABASE_URL, values.SUPABASE_ANON_KEY, values.SUPABASE_SERVICE_ROLE_KEY];
  if (suppliedSupabaseValues.some(Boolean) && suppliedSupabaseValues.some((value) => !value)) {
    productionErrors.push('SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY must be configured together');
  }
  for (const suppliedOrigin of values.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)) {
    if (suppliedOrigin === '*') {
      productionErrors.push('CORS_ORIGINS cannot contain a wildcard');
      continue;
    }
    try {
      const origin = new URL(suppliedOrigin);
      if (origin.origin !== suppliedOrigin) productionErrors.push(`CORS origin must not contain a path, query, or trailing slash: ${suppliedOrigin}`);
      if (origin.protocol !== 'https:') productionErrors.push(`CORS origin must use HTTPS in production: ${suppliedOrigin}`);
    } catch {
      productionErrors.push(`Invalid CORS origin: ${suppliedOrigin}`);
    }
  }
  if (values.PUBLIC_API_URL && new URL(values.PUBLIC_API_URL).protocol !== 'https:') productionErrors.push('PUBLIC_API_URL must use HTTPS in production');
  if (values.ALLOW_LEGACY_PASSWORD_MIGRATION) productionErrors.push('ALLOW_LEGACY_PASSWORD_MIGRATION must be false in production');
  if (values.AI_SPEECH_PROVIDER === 'databricks' && (!values.DATABRICKS_SPEECH_URL || !values.DATABRICKS_API_KEY)) {
    productionErrors.push('DATABRICKS_SPEECH_URL and DATABRICKS_API_KEY must be configured when AI_SPEECH_PROVIDER is databricks');
  }
}

if (productionErrors.length) {
  console.error('Production environment validation failed', productionErrors);
  process.exit(1);
}

export const env = {
  ...values,
  API_DOCS_ENABLED: values.API_DOCS_ENABLED ?? values.NODE_ENV !== 'production',
  LOAD_REFERENCE_ADVISORIES: values.LOAD_REFERENCE_ADVISORIES ?? values.NODE_ENV !== 'production',
  CORS_ORIGINS: values.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean),
};
