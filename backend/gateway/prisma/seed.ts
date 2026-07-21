import crypto from 'crypto';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

if (process.env.NODE_ENV === 'production' && process.env.SEED_ALLOW_PRODUCTION !== 'true') {
  throw new Error('Refusing to seed production. Set SEED_ALLOW_PRODUCTION=true only for an intentional, approved seed operation.');
}

const prisma = new PrismaClient();
const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SCRYPT_OPTIONS: crypto.ScryptOptions = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('base64url');
  const key = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, SCRYPT_OPTIONS, (error, derivedKey) => error ? reject(error) : resolve(derivedKey));
  });
  return `scrypt-v1$${salt}$${key.toString('hex')}`;
}

async function upsertUser(email: string, role: 'ADMIN' | 'OFFICER' | 'CITIZEN', password: string, name: string) {
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
  let supaUser = users.find(u => u.email === email);
  
  if (!supaUser) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role, name }
    });
    if (error) throw error;
    supaUser = data.user;
  } else {
    await supabaseAdmin.auth.admin.updateUserById(supaUser.id, {
      password,
      email_confirm: true,
      user_metadata: { role, name }
    });
  }

  return prisma.user.upsert({
    where: { email },
    update: { id: supaUser!.id, role, name, password: 'supabase-managed' },
    create: { id: supaUser!.id, email, role, name, password: 'supabase-managed' },
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
