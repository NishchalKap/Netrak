export interface JobOptions {
  attempts?: number;
  backoff?: {
    type: 'fixed' | 'exponential';
    delay: number;
  };
  timeout?: number;
}

export interface QueueProvider<T = any> {
  name: string;
  
  /**
   * Enqueue a job for background processing
   */
  enqueue(jobName: string, data: T, options?: JobOptions): Promise<string>;
  
  /**
   * Process jobs in the queue
   */
  process(jobName: string, handler: (data: T) => Promise<void>): void;
}
