import type { PhishingRecord, StatusType } from "@/utils/parser.ts";
import { getPositiveOrDefault } from "@/utils/utils.ts";

/**
 * Aggregates phishing status counts by cumulatively summing the counts
 *
 * @param {Partial<Record<StatusType, number>>} countByStatus - An object mapping phishing statuses to their respective counts.
 * @returns {Record<StatusType, number>} An object with aggregated counts for each phishing status.
 */
export function aggregatePhishingStatus(
    countByStatus: Partial<Record<StatusType, number>>
): Record<StatusType, number> {
    const submittedData = getPositiveOrDefault("Submitted Data", countByStatus);
    const clickedLink = submittedData + getPositiveOrDefault("Clicked Link", countByStatus);
    const emailOpened = clickedLink + getPositiveOrDefault("Email Opened", countByStatus);
    const emailSent = emailOpened + getPositiveOrDefault("Email Sent", countByStatus);

    return {
        "Submitted Data": submittedData,
        "Clicked Link": clickedLink,
        "Email Opened": emailOpened,
        "Email Sent": emailSent
    };
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
            if (!acc[value]) acc[value] = [];
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
