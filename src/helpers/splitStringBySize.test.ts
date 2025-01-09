import { splitStringBySize } from './splitStringBySize';
import { describe, it, expect } from "bun:test";

describe('splitStringBySize', () => {
  it('should split a string into an array of substrings with maximum size', () => {
    const input = 'Hello World!';
    const maxSize = 5;
    const expectedOutput = ['Hello', 'World!'];
    const actualOutput = splitStringBySize(input, maxSize);
    expect(actualOutput).toStrictEqual(expectedOutput);
  });
});
