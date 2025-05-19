import { describe, expect, it } from "vitest";
import { calcPercentage, getPositiveOrDefault, roundToNDecimal, sumValues } from "../utils.ts";

describe("calcPercentage", () => {
    it("returns correct percentage for valid values", () => {
        expect(calcPercentage(50, 200)).toBe(25);
        expect(calcPercentage(1, 4)).toBe(25);
        expect(calcPercentage(23, 50)).toBe(46);
    });

    it("returns 0 when total is 0 to avoid division by zero", () => {
        expect(calcPercentage(5, 0)).toBe(0);
    });

    it("returns 0 when value is 0", () => {
        expect(calcPercentage(0, 100)).toBe(0);
    });

    it("handles negative values correctly", () => {
        expect(calcPercentage(-50, 200)).toBe(0);
        expect(calcPercentage(50, -200)).toBe(0);
        expect(calcPercentage(-50, -200)).toBe(0);
    });
});

describe("roundToNDecimal", () => {
    it("rounds a positive number to the specified number of decimal places", () => {
        expect(roundToNDecimal(1.234, 0)).toBe(1);
        expect(roundToNDecimal(1.234, 2)).toBe(1.23);
        expect(roundToNDecimal(1.234, 3)).toBe(1.234);
    });

    it("rounds a negative number to the specified number of decimal places", () => {
        expect(roundToNDecimal(-1.234, 0)).toBe(-1);
        expect(roundToNDecimal(-1.234, 2)).toBe(-1.23);
        expect(roundToNDecimal(-1.234, 3)).toBe(-1.234);
    });

    it("returns 0 if the input is invalid", () => {
        expect(roundToNDecimal(12.3, 3.5)).toBe(0);
        expect(roundToNDecimal(12.3, -1)).toBe(0);
        expect(roundToNDecimal(NaN)).toBe(0);
    });

    it("returns the same number if no rounding is needed", () => {
        expect(roundToNDecimal(0, 2)).toBe(0);
        expect(roundToNDecimal(10, 0)).toBe(10);
        expect(roundToNDecimal(3.0, 1)).toBe(3.0);
        expect(roundToNDecimal(5.12, 2)).toBe(5.12);
    });

    it("handles very large numbers correctly", () => {
        expect(roundToNDecimal(123456789.987654321, 2)).toBe(123456789.99);
    });

    it("handles very small numbers correctly", () => {
        expect(roundToNDecimal(0.000123456, 5)).toBe(0.00012);
    });
});

describe("sumValues", () => {
    it("returns 0 for an empty object", () => {
        expect(sumValues({})).toBe(0);
    });

    it("sums positive numbers correctly", () => {
        expect(sumValues({ a: 1, b: 2, c: 3 })).toBe(6);
    });

    it("sums negative numbers correctly", () => {
        expect(sumValues({ x: -1, y: -2, z: -3 })).toBe(-6);
    });

    it("sums a mix of positive and negative numbers", () => {
        expect(sumValues({ a: 10, b: -5, c: 3 })).toBe(8);
    });
});

describe("getPositiveOrDefault", () => {
    it("returns the value associated with the key if it exists and is positive", () => {
        expect(getPositiveOrDefault("a", { a: 10, b: 20 }, 0)).toBe(10);
    });

    it("returns the default value if the key does not exist", () => {
        expect(getPositiveOrDefault("c", { a: 10, b: 20 }, 5)).toBe(5);
    });

    it("throws an error if the default value is negative", () => {
        expect(() => getPositiveOrDefault("a", { a: 10 }, -1)).toThrow("Default value cannot be negative");
    });

    it("throws an error if the value associated with the key is negative", () => {
        expect(() => getPositiveOrDefault("b", { a: 10, b: -5 }, 0)).toThrow("Value cannot be negative");
    });

    it("returns 0 if the key does not exist and default value is not specified", () => {
        expect(getPositiveOrDefault("c", { a: 10, b: 20 })).toBe(0);
    });

    it("handles an empty object and returns the default value", () => {
        expect(getPositiveOrDefault("a", {}, 5)).toBe(5);
    });
});
