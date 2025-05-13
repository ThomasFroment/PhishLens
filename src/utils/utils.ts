/**
 * Sums the values of a given object.
 *
 * @param {Record<string, number>} obj - An object with string keys and numeric values.
 * @returns {number} The sum of all numeric values in the object.
 */
export function sum(obj: Record<string, number>): number {
    return Object.values(obj).reduce((acc, val) => acc + val, 0);
}

/**
 * Calculates the percentage of a value relative to a total.
 *
 * @param {number} val - The value to calculate the percentage for.
 * @param {number} total - The total value used as the denominator.
 * @returns {number} The percentage of `val` relative to `total`, rounded to one decimal place.
 *
 */
export function calcPercentage(val: number, total: number): number {
    if (total === 0) return 0;
    const percentage = (val / total) * 100;
    return Math.round(percentage * 10) / 10;
}
