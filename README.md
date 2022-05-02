Simple HMAC-SHA1 authentication via headers, port of https://github.com/psyipm/api_signature

# Why?
Required to sign requests to API with signature validation based on [api_signature](https://rubygems.org/gems/api_signature) Ruby Gem.

# How?

```JS
  const signer = new Signer(process.env.API_KEY, process.env.API_SECRET);
  ...
  // ensure we have headers to sign
  request.setHeader('x-api-key', process.env.API_KEY);
  request.setHeader('content-type', 'application/json');
  // sign request
  const signature = signer.signRequest({
    // method: 'GET'
    method: request.method,
    // url: http://example.com/api/test
    url: process.env.API_ENDPOINT + request.url,
    headers: {
      // only significant headers is signed (depends on endpoint)
      'x-api-key': process.env.API_KEY,
      'content-type': 'application/json',
    },
    body: request.rawBody
  });
  // write provided request headers (host, x-datetime & authorization)
  for (const name in signature.headers) {
    request.setHeader(name, signature.headers[name]);
  }
  // lets perform request...
```

# TODO:
- add more tests
- port validator
