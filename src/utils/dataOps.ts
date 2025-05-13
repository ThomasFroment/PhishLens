import type { PhishingRecord, StatusType } from "@/utils/parser.ts";

/**
 * Aggregates phishing status counts by cumulatively summing the counts
 *
 * @param {Record<StatusType, number>} countByStatus - An object mapping phishing statuses to their respective counts.
 * @returns {Record<StatusType, number>} An object with aggregated counts for each phishing status.
 */
export function aggregatePhishingStatus(countByStatus: Record<StatusType, number>): Record<StatusType, number> {
    const aggregatedCount = {} as Record<StatusType, number>;

    aggregatedCount["Submitted Data"] = countByStatus["Submitted Data"];
    aggregatedCount["Clicked Link"] = aggregatedCount["Submitted Data"] + countByStatus["Clicked Link"];
    aggregatedCount["Email Opened"] = aggregatedCount["Clicked Link"] + countByStatus["Email Opened"];
    aggregatedCount["Email Sent"] = aggregatedCount["Email Opened"] + countByStatus["Email Sent"];

    return aggregatedCount;
}

/**
 * Groups an array of phishing records by a specified key.
 *
 * @template K - The key of the `PhishingRecord` by which to group the records.
 * @param {PhishingRecord[]} records - An array of phishing records to be grouped.
 * @param {K} key - The key of the `PhishingRecord` to group by.
 * @returns {Record<PhishingRecord[K], PhishingRecord[]>} An object where each key is a unique value
 * of the specified key in the records, and the corresponding value is an array of records with that key.
 */
export function groupRecordsByValue<K extends keyof PhishingRecord>(
    records: PhishingRecord[],
    key: K
): Record<PhishingRecord[K], PhishingRecord[]> {
    return records.reduce(
        (acc, curr) => {
            const value = curr[key];
            acc[value] = acc[value] || [];
            acc[value].push(curr);
            return acc;
        },
        {} as Record<PhishingRecord[K], PhishingRecord[]>
    );
}

/**
 * Counts the number of elements in each array within an object.
 *
 * @param {Record<string, unknown[]>} object - An object where the keys are strings and the values are arrays.
 * @returns {Record<string, number>} A new object where the keys are the same as the input object,
 * and the values are the lengths of the corresponding arrays.
 */
export function countElementsInObject(object: Record<string, unknown[]>): Record<string, number> {
    return Object.fromEntries(Object.entries(object).map(([key, val]) => [key, val.length]));
}
