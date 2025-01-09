import { toDataURL } from "./toDataURL";
import { describe, it, expect } from "bun:test";

describe("toDataURL", () => {
  it.skip("should return a data URL when given a valid URL", async () => {
    const url = "https://example.com/image.jpg";
    const result = await toDataURL(url);
    expect(result).toMatch(/^data:image\/jpeg;base64,/);
  });
});
