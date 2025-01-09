// isTextShare.test.ts
import { isTextShare, isLinkShare, isMediaShare } from './posts';
import { describe, it, expect } from "bun:test";

describe("post helpers", () => {
    describe('isTextShare', () => {
        it('returns true if post has no media file or an external link', () => {
          const post = {};
          expect(isTextShare(post)).toBe(true);
        });
      
        it('returns false if post has a media file', () => {
          const post = {
            media: {
              file: 'sample_file.jpg'
            }
          };
          expect(isTextShare(post)).toBe(false);
        });
      
        it('returns false if post has an external link', () => {
          const post = {
            media: {
              external: 'https://example.com'
            }
          };
          expect(isTextShare(post)).toBe(false); 
        });
    });

    describe('isLinkShare', () => {
        it('returns true if post has an external link', () => {
            const post = {
            media: {
                external: 'https://example.com'
            }
            };
            expect(isLinkShare(post)).toBe(true);
        });

        it('returns false if post does not have an external link', () => {
            const post = {};
            expect(isLinkShare(post)).toBe(false);
        });
    });

    describe('isMediaShare', () => {
        it('returns true if post has a media file', () => {
            const post = {
            media: {
                file: 'sample_file.jpg'
            }
            };
            expect(isMediaShare(post)).toBe(true);
        });

        it('returns false if post does not have a media file', () => {
            const post = {};
            expect(isMediaShare(post)).toBe(false);
        });
    });
})
