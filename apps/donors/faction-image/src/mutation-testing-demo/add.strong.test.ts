/**
 * STRONG TESTS - These tests will kill mutants.
 * 
 * These tests demonstrate proper assertion patterns that will detect
 * when the implementation has been mutated incorrectly.
 */
import { describe, test, expect } from "vitest";
import { add, formatGreeting, isPositive } from "./add";

describe("add - STRONG tests (mutations will be killed)", () => {
  test("correctly adds two positive numbers", () => {
    // STRONG: Checks exact expected value
    // Mutation `return a - b` would FAIL this test!
    expect(add(2, 3)).toBe(5);
  });

  test("correctly adds negative numbers", () => {
    // STRONG: Tests edge case with negatives
    expect(add(-1, -2)).toBe(-3);
  });

  test("correctly adds zero", () => {
    // STRONG: Tests identity element
    expect(add(5, 0)).toBe(5);
    expect(add(0, 5)).toBe(5);
  });

  test("handles decimal numbers", () => {
    // STRONG: Tests floating point behavior
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  });

  test("is commutative", () => {
    // STRONG: Tests mathematical property
    expect(add(3, 7)).toBe(add(7, 3));
  });
});

describe("formatGreeting - STRONG tests", () => {
  test("formats greeting with exact expected output", () => {
    // STRONG: Checks exact string format
    // Mutation `return "Goodbye, ${name}!"` would FAIL!
    expect(formatGreeting("World")).toBe("Hello, World!");
  });

  test("includes proper punctuation", () => {
    // STRONG: Verifies punctuation is correct
    expect(formatGreeting("Alice")).toMatch(/Hello, Alice!$/);
  });

  test("works with different names", () => {
    // STRONG: Tests with multiple inputs
    expect(formatGreeting("Bob")).toBe("Hello, Bob!");
    expect(formatGreeting("")).toBe("Hello, !");
  });
});

describe("isPositive - STRONG tests", () => {
  test("returns true for positive numbers", () => {
    // STRONG: Exact assertion for positive case
    expect(isPositive(1)).toBe(true);
    expect(isPositive(100)).toBe(true);
    expect(isPositive(0.5)).toBe(true);
  });

  test("returns false for zero", () => {
    // STRONG: Tests boundary condition
    // Mutation `return value >= 0` would FAIL this test!
    expect(isPositive(0)).toBe(false);
  });

  test("returns false for negative numbers", () => {
    // STRONG: Tests negative case
    expect(isPositive(-1)).toBe(false);
    expect(isPositive(-100)).toBe(false);
    expect(isPositive(-0.5)).toBe(false);
  });

  test("boundary between positive and negative", () => {
    // STRONG: Tests the exact boundary
    expect(isPositive(0.0001)).toBe(true);
    expect(isPositive(-0.0001)).toBe(false);
  });
});
