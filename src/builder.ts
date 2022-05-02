import { URL } from 'url';
import { OutgoingHttpHeaders } from 'http';
import { normalizeHeaderValue, hexdigest } from './utils';
import { BuilderSettings } from './types';

export class Builder {
  static readonly SPLITTER = '\n';

  public datetime: string;
  public date: string;
  public host: string;
  public search: string;
  public path: string;
  public contentSha256: string;
  public headers: OutgoingHttpHeaders;
  public signHeaders: OutgoingHttpHeaders = {};

  private uri: URL;

  constructor(private readonly settings: BuilderSettings, private readonly unsignedHeaders: string[] = []) {
    this.uri = new URL(settings.url);
    this.host = this.uri.host;
    this.path = this.uri.pathname;
    this.search = this.normalizedSearch();

    this.datetime = this.getDatetime();
    this.date = this.getDate();
    this.headers = this.normalizeHeaders(settings.headers);

    this.contentSha256 = hexdigest(settings.body || '');
  }

  public get signedHeadersNames(): string {
    return Object.keys(this.signedHeaders).sort().join(';');
  }

  public get signedHeaders(): OutgoingHttpHeaders {
    const headers = { ...this.headers, ...this.signHeaders };
    for (const key in headers) {
      if (this.unsignedHeaders.includes(key)) delete headers[key];
    }
    return headers;
  }

  private getDatetime(): string {
    const headers = this.settings.headers || {};
    return headers['x-datetime']?.toString() || new Date().toISOString();
  }

  private getDate(): string {
    return this.datetime.replace(/\D/g, '').slice(0, 8);
  }

  private normalizeHeaders(headers?: OutgoingHttpHeaders): OutgoingHttpHeaders {
    if (!headers) return {};

    const result: OutgoingHttpHeaders = {};

    for (const key in headers) {
      if (!Object.prototype.hasOwnProperty.call(headers, key)) continue;

      result[key.toLowerCase()] = headers[key];
    }

    return result;
  }

  private normalizedSearch(): string {
    this.uri.searchParams.sort();
    return this.uri.searchParams.toString();
  }

  private canonicalHeaders(): string {
    return Object.entries(this.signedHeaders)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([k, v]) => `${k}:${normalizeHeaderValue(v?.toString())}`)
      .join(Builder.SPLITTER);
  }

  canonicalRequest(path?: string): string {
    return [
      this.settings.method,
      path || this.path,
      this.search,
      this.canonicalHeaders() + Builder.SPLITTER,
      this.signedHeadersNames,
      this.contentSha256,
    ].join(Builder.SPLITTER);
  }

  buildSignHeaders(applyChecksumHeader = false): OutgoingHttpHeaders {
    this.signHeaders = {
      host: this.host,
      'x-datetime': this.datetime,
    };

    if (applyChecksumHeader) this.signHeaders['x-content-sha256'] = this.contentSha256;

    return this.signHeaders;
  }
}
