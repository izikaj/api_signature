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
