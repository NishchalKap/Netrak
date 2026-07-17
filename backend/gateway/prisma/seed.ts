import crypto from 'crypto';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

if (process.env.NODE_ENV === 'production' && process.env.SEED_ALLOW_PRODUCTION !== 'true') {
  throw new Error('Refusing to seed production. Set SEED_ALLOW_PRODUCTION=true only for an intentional, approved seed operation.');
}

const prisma = new PrismaClient();
const SCRYPT_OPTIONS: crypto.ScryptOptions = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('base64url');
  const key = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, SCRYPT_OPTIONS, (error, derivedKey) => error ? reject(error) : resolve(derivedKey));
  });
  return `scrypt-v1$${salt}$${key.toString('hex')}`;
}

async function upsertUser(email: string, role: 'ADMIN' | 'OFFICER' | 'CITIZEN', password: string, name: string) {
  return prisma.user.upsert({
    where: { email },
    update: { role, name, password: await hashPassword(password) },
    create: { email, role, name, password: await hashPassword(password) },
  });
}

async function main() {
  const credentials = [
    ['admin@netrak.local', 'ADMIN', process.env.SEED_ADMIN_PASSWORD ?? 'NetrakAdmin!2026', 'Netrak Administrator'],
    ['officer@netrak.local', 'OFFICER', process.env.SEED_OFFICER_PASSWORD ?? 'NetrakOfficer!2026', 'Netrak Officer'],
    ['citizen@netrak.local', 'CITIZEN', process.env.SEED_CITIZEN_PASSWORD ?? 'NetrakCitizen!2026', 'Netrak Citizen'],
  ] as const;

  for (const [email, role, password, name] of credentials) await upsertUser(email, role, password, name);

  console.log('Netrak seed complete. Development credentials:');
  for (const [email, role, password] of credentials) console.log(`${role}: ${email} / ${password}`);
}

main().finally(() => prisma.$disconnect());
