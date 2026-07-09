export function decodeJwt(token: string) {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = typeof atob === 'function' ? atob(padded) : '';

    if (!decoded) return null;
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
