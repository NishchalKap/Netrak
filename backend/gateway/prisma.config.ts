import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  earlyAccess: true,
  studio: {
    port: 5555,
  },
  migrations: {
    schemaPath: './prisma/schema.prisma',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://mock:mock@localhost:5432/mockdb',
  }
});
