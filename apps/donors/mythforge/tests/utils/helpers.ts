export function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export function normalizePath(p: string) {
  return p.replace(/\\\\/g, '/');
}

export function uniqueId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
