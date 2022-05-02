import { Builder } from '../src/builder';

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
    new Builder(Opts)
  }).not.toThrow();
});

describe('instance', () => {
  let builder: Builder;

  beforeEach(() => {
    builder = new Builder(Opts);
  });

  it('#signedHeadersNames should contain names of headers to sign', () => {
    expect(builder.signedHeadersNames).toContain('x-api-key');
    expect(builder.signedHeadersNames).toContain('content-type');
  });

  describe('#canonicalRequest', () => {
    it('should build proper string', () => {
      const result = builder.canonicalRequest('/api/test');
      expect(result).toBe(
        'GET' + "\n" + '/api/test' + "\n" + "\n" +
        'content-type:application/json' + "\n" +
        'x-api-key:KEY' + "\n" + "\n" +
        'content-type;x-api-key' + "\n" +
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      );
    });

    it('should build with search params', () => {
      builder = new Builder({ ...Opts, url: 'http://example.com/api/test?foo=bar&apple=1&potato=2'});
      const result = builder.canonicalRequest('/api/test');
      expect(result).toContain("GET\n/api/test\napple=1&foo=bar&potato=2\n");
    });

    it('should override path', () => {
      const result = builder.canonicalRequest('/api/test%20~');
      expect(result).toContain("\n/api/test%20~\n\n");
    });

    it('path is optional', () => {
      const result = builder.canonicalRequest();
      expect(result).toContain("\n/api/test\n\n");
    });
  });
});
