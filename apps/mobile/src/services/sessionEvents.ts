let onExpired: (() => void) | null = null;

export function setSessionExpiredHandler(handler: () => void) {
  onExpired = handler;
  return () => {
    if (onExpired === handler) onExpired = null;
  };
}

export function notifySessionExpired() {
  onExpired?.();
}
