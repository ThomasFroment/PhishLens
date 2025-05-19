/**
 * Sums the values of a given object.
 *
 * @param {Record<string, number>} obj - An object with string keys and numeric values.
 * @returns {number} The sum of all numeric values in the object.
 */
export function sumValues(obj: Record<string, number>): number {
    return Object.values(obj).reduce((sum, val) => sum + val, 0);
}

/**
 * Rounds a number to a specified number of decimal places.
 *
 * @param {number} num - The number to be rounded.
 * @param {number} [nbDecimals=1] - The number of decimal places to round to.
 * @returns {number} The rounded number.
 */
export function roundToNDecimal(num: number, nbDecimals: number = 1): number {
    if (isNaN(num) || nbDecimals < 0 || !Number.isInteger(nbDecimals)) {
        return 0;
    }
    return Math.round((num + Number.EPSILON) * Math.pow(10, nbDecimals)) / Math.pow(10, nbDecimals);
}

/**
 * Calculates the percentage of a value relative to a total.
 *
 * @param {number} val - The value to calculate the percentage for.
 * @param {number} total - The total value used as the denominator.
 * @returns {number} The percentage of `val` relative to `total`, rounded to one decimal place.
 *
 * Notes:
 * - If `total` is 0, the function returns 0 to avoid division by zero.
 * - If `val` or `total` is negative, the function will return zero.
 */
export function calcPercentage(val: number, total: number): number {
    if (total <= 0 || val <= 0) return 0;
    const percentage = (val / total) * 100;
    return roundToNDecimal(percentage);
}

/**
 * Retrieves a positive value from an object by its key or returns a default value.
 *
 * @param {string} key - The key to look up in the object.
 * @param {Record<string, number>} obj - An object with string keys and numeric values.
 * @param {number} [defaultValue=0] - The default value to return if the key is not found. Must be non-negative.
 * @returns {number} The value associated with the key if it exists and is non-negative, or the default value.
 *
 * @throws {Error} If the default value is negative.
 * @throws {Error} If the value associated with the key is negative.
 */
export function getPositiveOrDefault(key: string, obj: Record<string, number>, defaultValue: number = 0): number {
    if (defaultValue < 0) throw new Error("Default value cannot be negative");
    if (key in obj) {
        const value = obj[key];
        if (value < 0) throw new Error("Value cannot be negative");
        return value;
    }
    return defaultValue;
}
