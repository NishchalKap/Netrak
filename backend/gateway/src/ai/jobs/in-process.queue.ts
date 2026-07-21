import crypto from 'crypto';
import { QueueProvider, JobOptions } from './queue.interface';
import { logger } from '../../common/logger';

export class InProcessQueue<T = any> implements QueueProvider<T> {
  public name = 'in-process';
  private handlers = new Map<string, (data: T) => Promise<void>>();
  
  async enqueue(jobName: string, data: T, options?: JobOptions): Promise<string> {
    const jobId = crypto.randomUUID();
    
    // Process asynchronously (in-process mock of a background job queue)
    setImmediate(async () => {
      const handler = this.handlers.get(jobName);
      if (handler) {
        try {
          await handler(data);
          logger.info(`Job ${jobId} (${jobName}) completed successfully`);
        } catch (error) {
          logger.error(`Job ${jobId} (${jobName}) failed`, { error });
          // In a real queue we would handle options.attempts and backoff here
        }
      } else {
        logger.warn(`No handler registered for job ${jobName}`);
      }
    });

    return jobId;
  }

  process(jobName: string, handler: (data: T) => Promise<void>): void {
    if (this.handlers.has(jobName)) {
      logger.warn(`Handler for ${jobName} is being overwritten`);
    }
    this.handlers.set(jobName, handler);
  }
}

export const aiQueue = new InProcessQueue();
