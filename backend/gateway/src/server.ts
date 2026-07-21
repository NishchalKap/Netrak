import app from './app';
import { env } from './config/env';
import { logger } from './common/logger';
import { prisma } from './database/prisma';

const server = app.listen(env.PORT, '0.0.0.0', () => {
  logger.info('Gateway started', { environment: env.NODE_ENV, port: env.PORT, host: '0.0.0.0', apiDocs: env.API_DOCS_ENABLED });
});
server.requestTimeout = 30_000;
server.headersTimeout = 15_000;
server.keepAliveTimeout = 5_000;
server.maxRequestsPerSocket = 1_000;

let shuttingDown = false;
async function shutdown(signal: string, exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info('Gateway shutdown requested', { signal });

  const forcedExit = setTimeout(() => {
    logger.error('Gateway shutdown timed out');
    process.exit(1);
  }, 10000);
  forcedExit.unref();

  server.close(async (error) => {
    if (error) logger.error('HTTP server shutdown failed', { message: error.message });
    await prisma.$disconnect().catch((disconnectError: unknown) => {
      logger.error('Database disconnect failed', { message: disconnectError instanceof Error ? disconnectError.message : 'Unknown error' });
    });
    clearTimeout(forcedExit);
    process.exit(error ? 1 : exitCode);
  });
}

server.on('error', (error) => {
  logger.error('Gateway failed to listen', { message: error.message });
  void shutdown('server-error', 1);
});
process.on('SIGTERM', () => { void shutdown('SIGTERM'); });
process.on('SIGINT', () => { void shutdown('SIGINT'); });
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { message: error.message, stack: error.stack });
  void shutdown('uncaughtException', 1);
});
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason: reason instanceof Error ? reason.message : String(reason) });
  void shutdown('unhandledRejection', 1);
});
