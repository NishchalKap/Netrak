import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../config/env';

let prismaClient: PrismaClient;

if (env.DATABASE_URL.startsWith('postgresql://') || env.DATABASE_URL.startsWith('postgres://')) {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  prismaClient = new PrismaClient({ adapter });
} else {
  prismaClient = new PrismaClient();
}

export const prisma = prismaClient;
