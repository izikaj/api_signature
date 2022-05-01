import { normalizePath } from '../src/utils';

describe('#normalizePath', () => {
  it('should return / for blank', () => {
    expect(normalizePath()).toBe('/');
    expect(normalizePath('')).toBe('/');
  });

  it('should return unchanged if no escape flag passed', () => {
    expect(normalizePath('/some')).toBe('/some');
    expect(normalizePath('/a/b/c')).toBe('/a/b/c');
    expect(normalizePath('/ /~!¥')).toBe('/ /~!¥');
  });

  it('should escape path', () => {
    expect(normalizePath('/ ', true)).toBe('/%20');
  });
});
