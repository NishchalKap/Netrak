export type RealtimeStatus = 'unconfigured' | 'connecting' | 'connected' | 'disconnected';

export interface RealtimeEvent<T = unknown> {
  channel: 'cases' | 'threats' | 'notifications' | 'incidents';
  payload: T;
  timestamp: string;
}

export interface RealtimeTransport {
  status: RealtimeStatus;
  connect(): Promise<void>;
  disconnect(): void;
  subscribe<T>(channel: RealtimeEvent<T>['channel'], listener: (event: RealtimeEvent<T>) => void): () => void;
}

class UnconfiguredRealtimeTransport implements RealtimeTransport {
  status: RealtimeStatus = 'unconfigured';
  async connect() { return Promise.resolve(); }
  disconnect() { this.status = 'unconfigured'; }
  subscribe<T>(channel: RealtimeEvent<T>['channel'], listener: (event: RealtimeEvent<T>) => void) { void channel; void listener; return () => undefined; }
}

export const realtimeTransport: RealtimeTransport = new UnconfiguredRealtimeTransport();
