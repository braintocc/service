import { blueskyStrategies } from "./";
import { describe, expect, mock, beforeEach, test } from "bun:test";

const textShareMock = mock()
const linkShareMock = mock()
const mediaShareMock = mock()
const isValidCredentialsMock = mock()
const isTextShareMock = mock()
const isLinkShareMock = mock()
const isMediaShareMock = mock()

mock.module("./textShare", () => {
  return {
    textShare: textShareMock,
  };
});

mock.module("./linkShare", () => {
  return {
    linkShare: linkShareMock,
  };
});

mock.module("./mediaShare", () => {
  return {
    mediaShare: mediaShareMock,
  };
});
mock.module("./../../../helpers/credentials", () => {
  return {
    isValidCredentials: isValidCredentialsMock,
  };
});
mock.module("../../../helpers/posts", () => {
  return {
    isTextShare: isTextShareMock,
    isLinkShare: isLinkShareMock,
    isMediaShare: isMediaShareMock,
  };
});

describe("Bluesky Strategies", () => {
  beforeEach(() =>{
    textShareMock.mockReset()
    linkShareMock.mockReset()
    mediaShareMock.mockReset()
    isTextShareMock.mockReset()
    isLinkShareMock.mockReset()
    isMediaShareMock.mockReset()
    isValidCredentialsMock.mockReset()
    isTextShareMock.mockReturnValue(true)
    isLinkShareMock.mockReturnValue(true)
    isMediaShareMock.mockReturnValue(true)
    isValidCredentialsMock.mockReturnValue(true)
  })

  describe("static properties", () => {
    test.each([
      ["Bluesky Text", "bluesky", 0],
      ["Bluesky Link", "bluesky", 1],
      ["Bluesky Media", "bluesky", 2],
    ])("Json should have name %p and site %p for inded %d", (name, site, index) => {
        expect(blueskyStrategies[index].name).toBe(name);
        expect(blueskyStrategies[index].site).toBe(site);
      });
  })

  describe("shouldRun", () => {
    test.each([
      ["Bluesky", 0, isTextShareMock],
      ["Bluesky", 1, isLinkShareMock],
      ["Bluesky", 2, isMediaShareMock],
    ])("should return can run if is target %p (index %d), and has correct credentials and type", (target, index, mockCalled) => {
        const post = {
          targets: [target]
        };
        const destination = {
          any: true
        };
        const result = blueskyStrategies[index].shouldRun(post, destination)
        expect(result).toBeTruthy();
        expect(mockCalled).toBeCalledWith(post)
        expect(isValidCredentialsMock).toBeCalledWith(destination);
    })

    test.each([
      ["Bluesky", 0],
      ["Bluesky", 1],
      ["Bluesky", 2],
    ])("should return cant run if %p (index %d) is text post with invalid credentials", (target, index) => {
      const post = {
        targets: [target]
      };
      const destination = {
        any: true
      };
      isValidCredentialsMock.mockReturnValue(false)
      const result = blueskyStrategies[index].shouldRun(post, destination)
      expect(result).toBeFalsy();
    })

    test.each([
      ["Bluesky", 0, isTextShareMock],
      ["Bluesky", 1, isLinkShareMock],
      ["Bluesky", 2, isMediaShareMock],
    ])("should return cant run if %p (index %d) is not correct type of post", (target, index, mockCalled) => {
      const post = {
        targets: [target]
      };
      const destination = {
        any: true
      };
      mockCalled.mockReturnValue(false)
      const result = blueskyStrategies[index].shouldRun(post, destination)
      expect(result).toBeFalsy();
    })

    test.each([
      [0],
      [1],
      [2],
    ])("should return cant run if (index %d) is not targeted", (index) => {
      const post = {
        targets: ["other"]
      };
      const destination = {
        any: true
      };
      const result = blueskyStrategies[index].shouldRun(post, destination)
      expect(result).toBeFalsy();
    })
  })

  describe("run", () => {
    test.each([
      [0, textShareMock],
      [1, linkShareMock],
      [2, mediaShareMock],
    ])("should call the correct funtion (index %d) is not targeted", (index, mockedFunction) => {
      const post = {
        targets: ["other"]
      };
      const destination = {
        any: true
      };
       blueskyStrategies[index].run(post, destination)
      expect(mockedFunction).toBeCalledWith( post, destination);
    })
  })
  
});
