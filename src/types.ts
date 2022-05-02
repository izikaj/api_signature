import { OutgoingHttpHeaders } from 'http';

export interface BuilderSettings {
  method: 'GET' | 'HEAD' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | string;
  url: string;
  body?: string;
  headers?: OutgoingHttpHeaders;
}

export interface SignerOptions {
  unsignedHeaders?: string[];
  uriEscapePath?: boolean;
  applyChecksumHeader?: boolean;
  signatureHeader?: string;
  service?: string;
}

export interface Signature {
  header?: string,
  content_sha256?: string,
  string_to_sign?: string,
  canonical_request?: string,
  signature?: string,
  headers: OutgoingHttpHeaders
}
