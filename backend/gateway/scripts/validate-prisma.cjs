const { spawnSync } = require('node:child_process');

const prismaCli = require.resolve('prisma/build/index.js');
const validationEnvironment = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://mock:mock@localhost:5432/mockdb',
  DIRECT_URL: process.env.DIRECT_URL || process.env.DATABASE_URL || 'postgresql://mock:mock@localhost:5432/mockdb',
};

const result = spawnSync(process.execPath, [prismaCli, 'validate'], {
  env: validationEnvironment,
  stdio: 'inherit',
});

if (result.error) {
  console.error('Unable to start Prisma validation:', result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
