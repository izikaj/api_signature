import { Builder } from '../src/builder';

const Opts = {
  method: 'GET',
  url: 'http://example.com/api/test',
  headers: {
    'content-type': 'application/json'
  }
}

it('should be buildable', () => {
  expect(() => {
    new Builder(Opts)
  }).not.toThrow();
});
