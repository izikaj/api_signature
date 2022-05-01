import { Signer } from '../src/signer';


it('should be buildable', () => {
  expect(() => {
    new Signer('KKK', 'SSS');
  }).not.toThrow();
});
