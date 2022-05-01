import { OutgoingHttpHeaders } from 'http';

interface BuilderSettings {
  method: 'GET' | 'HEAD' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | string;
  url: string;
  body?: string;
  headers?: OutgoingHttpHeaders;
}

interface SignerOptions {
  unsignedHeaders?: string[];
  uriEscapePath?: boolean;
  applyChecksumHeader?: boolean;
  signatureHeader?: string;
  service?: string;
}
