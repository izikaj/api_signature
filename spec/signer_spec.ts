import { Signer } from '../src/signer';

const Opts = {
  method: 'GET',
  url: 'http://example.com/api/test',
  headers: {
    'content-type': 'application/json',
    'x-api-key': 'KEY'
  }
}

it('should be buildable', () => {
  expect(() => {
    new Signer('KKK', 'SSS');
  }).not.toThrow();
});

describe('instance', () => {
  let signer = new Signer('KKK', 'SSS');

  it('should sign request', () => {
    const signed = signer.signRequest(Opts);
    expect(signed).toBeDefined();
    expect(signed.headers).toBeDefined();
    expect(signed.headers.authorization).toBeDefined();
    expect(signed.headers.host).toBe('example.com');
  });

  it('should sign POST request', () => {
    const signed = signer.signRequest({ ...Opts, method: 'POST' });
    expect(signed?.headers?.authorization).toBeDefined();
    expect(signed.canonical_request).toContain("POST\n/api/test\n\n");
  });

  it('should sign request with query params', () => {
    const signed = signer.signRequest({ ...Opts, url: 'http://example.com/api/test?foo=test' });
    expect(signed?.headers?.authorization).toBeDefined();
    expect(signed.canonical_request).toContain("GET\n/api/test\nfoo=test\n");
  });
});
