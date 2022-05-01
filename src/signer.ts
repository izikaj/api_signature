import { Builder } from './builder';
import { normalizePath, hmac, hexhmac, hexdigest } from './utils';
import { BuilderSettings, SignerOptions } from './types';

export class Signer {
  static readonly NAME = 'API-HMAC-SHA256';

  constructor(
    private readonly apiKey: string,
    private readonly apiSecret: string,
    private readonly options: SignerOptions = {},
  ) {}

  signRequest(request: BuilderSettings): any {
    const builder = new Builder(request);
    const sigHeaders = builder.buildSignHeaders(this.options.applyChecksumHeader);
    const data = this.buildSignature(builder);

    // apply signature
    sigHeaders[this.options.signatureHeader || 'authorization'] = data.header;

    // Returning the signature components.
    return {
      ...data,
      headers: sigHeaders,
    };
  }

  private buildSignature(builder: Builder): any {
    const path = normalizePath(builder.path, this.options.uriEscapePath);

    // compute signature parts
    const creq = builder.canonicalRequest(path);
    const sts = this.stringToSign(builder.datetime, creq);
    const sig = this.signature(builder.date, sts);

    return {
      header: this.buildSignatureHeader(builder, sig),
      content_sha256: builder.contentSha256,
      string_to_sign: sts,
      canonical_request: creq,
      signature: sig,
    };
  }

  private signature(date: string, target: string): string {
    const kDate = hmac(`API${this.apiSecret}`, date);
    const kService = hmac(kDate, this.options.service || 'web');
    const kCredentials = hmac(kService, 'api_request');
    return hexhmac(kCredentials, target);
  }

  private stringToSign(datetime: string, canonicalRequest: string): string {
    return [Signer.NAME, datetime, hexdigest(canonicalRequest)].join(Builder.SPLITTER);
  }

  private credential(date: string): string {
    return `${this.apiKey}/${date}/${this.options.service || 'web'}/api_request`;
  }

  private buildSignatureHeader(builder: Builder, signature: string): string {
    return [
      `${Signer.NAME} Credential=${this.credential(builder.date)}`,
      `SignedHeaders=${builder.signedHeadersNames}`,
      `Signature=${signature}`,
    ].join(', ');
  }
}
