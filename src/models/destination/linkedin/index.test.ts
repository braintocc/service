import { linkedInStrategies } from "./";
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

describe("LinkedIn Strategies", () => {
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
      ["LinkedIn Text", "linkedin", 0],
      ["LinkedIn Link", "linkedin", 1],
      ["LinkedIn Media", "linkedin", 2],
    ])("Json should have name %p and site %p for inded %d", (name, site, index) => {
        expect(linkedInStrategies[index].name).toBe(name);
        expect(linkedInStrategies[index].site).toBe(site);
      });
  })

  describe("shouldRun", () => {
    test.each([
      ["LinkedIn", 0, isTextShareMock],
      ["LinkedIn", 1, isLinkShareMock],
      ["LinkedIn", 2, isMediaShareMock],
    ])("should return can run if is target %p (index %d), and has correct credentials and type", (target, index, mockCalled) => {
        const post = {
          targets: [target]
        };
        const destination = {
          any: true
        };
        const result = linkedInStrategies[index].shouldRun(post, destination)
        expect(result).toBeTruthy();
        expect(mockCalled).toBeCalledWith(post)
        expect(isValidCredentialsMock).toBeCalledWith(destination);
    })

    test.each([
      ["LinkedIn", 0],
      ["LinkedIn", 1],
      ["LinkedIn", 2],
    ])("should return cant run if %p (index %d) is text post with invalid credentials", (target, index) => {
      const post = {
        targets: [target]
      };
      const destination = {
        any: true
      };
      isValidCredentialsMock.mockReturnValue(false)
      const result = linkedInStrategies[index].shouldRun(post, destination)
      expect(result).toBeFalsy();
    })

    test.each([
      ["LinkedIn", 0, isTextShareMock],
      ["LinkedIn", 1, isLinkShareMock],
      ["LinkedIn", 2, isMediaShareMock],
    ])("should return cant run if %p (index %d) is not correct type of post", (target, index, mockCalled) => {
      const post = {
        targets: [target]
      };
      const destination = {
        any: true
      };
      mockCalled.mockReturnValue(false)
      const result = linkedInStrategies[index].shouldRun(post, destination)
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
      const result = linkedInStrategies[index].shouldRun(post, destination)
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
       linkedInStrategies[index].run(post, destination)
      expect(mockedFunction).toBeCalledWith( post, destination);
    })
  })
  
});
