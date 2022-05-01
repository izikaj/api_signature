import { createHash, createHmac } from 'crypto';

const ALGORITM = 'sha256';

function uriEscapePart(part: string): string {
  return encodeURI(part).replace(/\+/g, '%20').replace(/%7E/g, '~');
}

function uriEscapePath(path: string): string {
  return path.replace(/[^\/]+/g, (part: string) => uriEscapePart(part));
}

// normalize / canonicalize path
export function normalizePath(path?: string, isUriEscapePath = false): string {
  if (!path || path === '') path = '/';

  return isUriEscapePath ? uriEscapePath(path) : path;
}

// normalize / canonicalize header value
export function normalizeHeaderValue(value?: string): string {
  if (!value) return '';
  if (/^".*"$/.test(value)) return value;

  return value.replace(/\s+/g, ' ');
}

// count data hash digest in hex
export function hexdigest(data: Buffer | string): string {
  return createHash(ALGORITM).update(data).digest('hex');
}

// count hmac of key & value
export function hmac(key: Buffer | string, val: Buffer | string): Buffer {
  const item = createHmac(ALGORITM, key);
  item.update(val);
  return item.digest();
}

// count hmac of key & value in hex
export function hexhmac(key: Buffer | string, val: Buffer | string): string {
  const item = createHmac(ALGORITM, key);
  item.update(val);
  return item.digest('hex');
}
