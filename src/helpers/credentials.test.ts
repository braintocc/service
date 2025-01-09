import { isValidCredentials } from './credentials';
import { describe, it, expect } from "bun:test";

describe('isValidCredentials', () => {
  it('should return false if credentials object is null or undefined', () => {
    const result = isValidCredentials(null);
    expect(result).toBeFalsy();
  });

  it('should return false if credentials object is empty', () => {
    const result = isValidCredentials({});
    expect(result).toBeFalsy();
  });

  it('should return true if credentials object has at least one key-value pair', () => {
    const result = isValidCredentials({ foo: 'bar' });
    expect(result).toBeTruthy();
  });
});
