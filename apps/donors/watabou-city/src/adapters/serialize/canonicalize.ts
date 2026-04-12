// @ts-nocheck
/**
 * Canonicalizes an object by sorting keys and rounding numbers.
 */
export function canonicalize(obj: any): string {
  const seen = new WeakSet();

  const process = (val: any): any => {
    if (val === null || typeof val !== 'object') {
      if (typeof val === 'number') return parseFloat(val.toFixed(6));
      return val;
    }

    if (seen.has(val)) return '[Circular]';
    seen.add(val);

    if (Array.isArray(val)) {
      return val.map(process);
    }

    const keys = Object.keys(val).sort();
    const result: any = {};
    keys.forEach(key => {
      result[key] = process(val[key]);
    });
    return result;
  };

  return JSON.stringify(process(obj));
}

/**
 * Computes a simple hash of a string.
 */
export async function computeHash(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
