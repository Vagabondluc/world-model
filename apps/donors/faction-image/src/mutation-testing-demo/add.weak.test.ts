/**
 * WEAK TESTS - These tests will allow mutants to survive.
 * 
 * These tests demonstrate common testing anti-patterns that AI-generated
 * tests often have. They pass but don't actually verify correct behavior.
 */
import { describe, test, expect } from "vitest";
import { add, formatGreeting, isPositive } from "./add";

describe("add - WEAK tests (mutations will survive)", () => {
  test("returns a number", () => {
    // WEAK: Only checks the return type, not the actual value
    // Mutation: `return a - b` would still pass this test!
    expect(typeof add(1, 2)).toBe("number");
  });

  test("returns something", () => {
    // WEAK: Only checks that something is returned
    // Mutation: `return 42` would still pass this test!
    expect(add(1, 2)).toBeDefined();
  });

  test("does not throw", () => {
    // WEAK: Only checks that no error is thrown
    // Mutation: `return 0` would still pass this test!
    expect(() => add(1, 2)).not.toThrow();
  });
});

describe("formatGreeting - WEAK tests", () => {
  test("returns a string", () => {
    // WEAK: Only checks type
    // Mutation: `return "Goodbye"` would still pass!
    expect(typeof formatGreeting("World")).toBe("string");
  });

  test("contains the name", () => {
    // WEAK: Checks that name is somewhere in the string
    // Mutation: `return name` (without "Hello, ") would still pass!
    expect(formatGreeting("World")).toContain("World");
  });

  test("has some length", () => {
    // WEAK: Only checks that string is not empty
    // Mutation: Almost any string mutation would pass!
    expect(formatGreeting("World").length).toBeGreaterThan(0);
  });
});

describe("isPositive - WEAK tests", () => {
  test("returns a boolean", () => {
    // WEAK: Only checks type
    // Mutation: `return true` would still pass!
    expect(typeof isPositive(5)).toBe("boolean");
  });

  test("works for positive numbers", () => {
    // WEAK: Only tests positive case
    // Mutation: `return value >= 0` would still pass!
    expect(isPositive(5)).toBe(true);
  });
});
