import app from './app';
import { env } from './config/env';
import { logger } from './common/logger';

const startServer = async () => {
  try {
    app.listen(env.PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      logger.info(`Swagger docs available at http://localhost:${env.PORT}/api-docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
