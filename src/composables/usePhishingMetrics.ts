import type { ComputedRef } from "vue";
import { computed, ref } from "vue";
import { countElementsInObject, groupRecordsByValue } from "@/utils/dataOps.ts";

import type { PhishingRecord, StatusType } from "@/utils/parser.ts";
import type { MaybePhishingRecords } from "@/types.d.ts";

const csvArray = ref<MaybePhishingRecords[]>([]);

/**
 * Updates the reactive CSV array with a new array of phishing records.
 *
 * @param {MaybePhishingRecords[]} newCSVArray - The new array of phishing records or null values.
 *
 * Notes:
 *  - This function might be removed in the future.
 *  - We allow null values in the array to keep the order of the CSV files (defined by the input component).
 */
export function useUpdateCSV(newCSVArray: MaybePhishingRecords[]): void {
    csvArray.value = newCSVArray;
}

/**
 * Computes a reactive array of phishing records grouped by their status.
 *
 * @returns {ComputedRef<(Record<StatusType, PhishingRecord[]> | null)[]>} A computed reference
 * containing an array where each element is either a record of phishing records
 * grouped by status (e.g. "Email Sent", "Email Received", etc.) or `null` if the corresponding CSV is `null`.
 *
 * Notes:
 * - If a CSV is `null`, the corresponding element in the result will also be `null` (to maintain the order).
 */
const recordsByStatus: ComputedRef<(Record<StatusType, PhishingRecord[]> | null)[]> = computed(() => {
    return csvArray.value.map((csv: MaybePhishingRecords) => {
        if (!csv) return null;
        return groupRecordsByValue(csv, "status");
    });
});

/**
 * Computes a reactive array of counts of phishing records grouped by their status.
 *
 * @returns {ComputedRef<(Record<StatusType, number> | null)[]>} A computed reference
 * containing an array where each element is either a record of counts of phishing records
 * grouped by status or `null` if the corresponding CSV is `null`.
 *
 * Notes:
 * - If a CSV is `null`, the corresponding element in the result will also be `null`. (to maintain the order).
 * - The counts are derived from the `recordsByStatus` computed property.
 */
export const countByStatus = computed(() => {
    return recordsByStatus.value.map((csv: Record<StatusType, PhishingRecord[]> | null) => {
        if (!csv) return null;
        return countElementsInObject(csv);
    });
});

/**
 * Computes a reactive array of phishing records grouped by their position.
 *
 * @returns {ComputedRef<(Record<string, PhishingRecord[]> | null)[]>} A computed reference
 * containing an array where each element is either a record of phishing records grouped by position
 * or `null` if the corresponding CSV is `null`.
 *
 * Notes:
 * - If a CSV is `null`, the corresponding element in the result will also be `null` (to maintain the order).
 */
const recordsByPosition = computed(() => {
    return csvArray.value.map((csv: MaybePhishingRecords) => {
        if (!csv) return null;
        return groupRecordsByValue(csv, "position");
    });
});

/**
 * Computes a reactive array of counts of phishing records grouped by their position.
 *
 * @returns {ComputedRef<(Record<string, number> | null)[]>} A computed reference
 * containing an array where each element is either a record of counts of phishing records
 * grouped by position or `null` if the corresponding CSV is `null`.
 *
 * Notes:
 * - If a CSV is `null`, the corresponding element in the result will also be `null` (to maintain the order).
 * - The counts are derived from the `recordsByPosition` computed property.
 */
export const countByPosition = computed(() => {
    return recordsByPosition.value.map((csv) => {
        if (!csv) return null;
        return countElementsInObject(csv);
    });
});

/**
 * Computes a reactive array of phishing records grouped by their status themselves grouped by position.
 *
 * @returns {ComputedRef<(Record<string, Record<StatusType, PhishingRecord[]> | null>)[]>} A computed reference
 * containing an array where each element is either a record of phishing records grouped by status within each position
 * or `null` if the corresponding CSV is `null`.
 *
 * Notes:
 * - If a CSV is `null`, the corresponding element in the result will also be `null` (to maintain the order).
 * - The grouping is performed first by position and then by status.
 */
const recordsByStatusByPosition = computed(() => {
    return recordsByPosition.value.map((csv) => {
        if (!csv) return null;
        return Object.fromEntries(
            Object.entries(csv).map(([key, val]) => {
                return [key, groupRecordsByValue(val, "status")];
            })
        );
    });
});

/**
 * Computes a reactive array of counts of phishing records grouped by their status within each position.
 *
 * @returns {ComputedRef<(Record<string, Record<StatusType, number>> | null)[]>} A computed reference
 * containing an array where each element is a record of counts for each phishing status
 * within each position (e.g. IT) or `null` if the corresponding CSV is `null`.
 *
 * Notes:
 * - If a CSV is `null`, the corresponding element in the result will also be `null` (to maintain the order).
 * - There is no guarantee that all `PhishingStatus` are present for each position.
 * - The counts are derived from the `recordsByStatusByPosition` computed property.
 */
export const countByStatusByPosition = computed(() => {
    return recordsByStatusByPosition.value.map((csv) => {
        if (!csv) return null;
        return Object.fromEntries(
            Object.entries(csv).map(([key, val]) => {
                return [key, countElementsInObject(val)];
            })
        );
    });
});

/**
 * Computes a reactive array of phishing records grouped by their reported status.
 *
 * @returns {ComputedRef<(Record<string, PhishingRecord[]> | null)[]>} A computed reference
 * containing an array where each element is either a record of phishing records grouped by
 * their reported status (e.g., "true", "false") or `null` if the corresponding CSV is `null`.
 *
 * Notes:
 * - If a CSV is `null`, the corresponding element in the result will also be `null` (to maintain the order).
 */
const recordsByReported = computed(() => {
    return csvArray.value.map((csv: MaybePhishingRecords) => {
        if (!csv) return null;
        return groupRecordsByValue(csv, "reported");
    });
});

/**
 * Computes a reactive array of counts of phishing records grouped by their reported status.
 *
 * @returns {ComputedRef<(Record<string, number> | null)[]>} A computed reference
 * containing an array where each element is either a record of counts of phishing records
 * grouped by their reported status (e.g., "true", "false") or `null` if the corresponding CSV is `null`.
 *
 * Notes:
 * - If a CSV is `null`, the corresponding element in the result will also be `null` (to maintain the order).
 * - The counts are derived from the `recordsByReported` computed property.
 */
export const countByReported = computed(() => {
    return recordsByReported.value.map((csv) => {
        if (!csv) return null;
        return countElementsInObject(csv);
    });
});

/**
 * Computes a reactive array of phishing records grouped by their reported status within each position.
 *
 * @returns {ComputedRef<(Record<string, Record<string, PhishingRecord[]> | null>)[]>} A computed reference
 * containing an array where each element is either a record of phishing records grouped by their reported status
 * within each position or `null` if the corresponding CSV is `null`.
 *
 * Notes:
 * - If a CSV is `null`, the corresponding element in the result will also be `null` (to maintain the order).
 * - The grouping is performed first by position and then by the "reported" field.
 */
const recordsByReportedByPosition = computed(() => {
    return recordsByPosition.value.map((csv) => {
        if (!csv) return null;
        return Object.fromEntries(
            Object.entries(csv).map(([key, val]) => {
                return [key, groupRecordsByValue(val, "reported")];
            })
        );
    });
});

/**
 * Computes a reactive array of counts of phishing records grouped by their reported status within each position.
 *
 * @returns {ComputedRef<(Record<string, Record<string, number>> | null)[]>} A computed reference
 * containing an array where each element is either a record of counts of phishing records grouped by their
 * reported status within each position or `null` if the corresponding CSV is `null`.
 *
 * Notes:
 * - If a CSV is `null`, the corresponding element in the result will also be `null` (to maintain the order).
 * - The counts are derived from the `recordsByReportedByPosition` computed property.
 */
export const countByReportedByPosition = computed(() => {
    return recordsByReportedByPosition.value.map((csv) => {
        if (!csv) return null;
        return Object.fromEntries(
            Object.entries(csv).map(([key, val]) => {
                return [key, countElementsInObject(val)];
            })
        );
    });
});

/**
 * Computes a reactive array of phishing records grouped by email.
 *
 * @returns {ComputedRef<(Record<string, PhishingRecord> | null)[]>} A computed reference
 * containing an array where each element is either a record of phishing records grouped by email
 * (with the email as the key and the record as the value) or `null` if the corresponding CSV is `null`.
 *
 * Notes:
 * - If a CSV is `null`, the corresponding element in the result will also be `null` (to maintain the order).
 * - The grouping is performed differently from the `recordsByStatus` and `recordsByPosition` functions, it expects `email` to be unique.
 */
const recordsByEmail = computed(() => {
    return csvArray.value.map((csv: MaybePhishingRecords) => {
        if (!csv) return null;
        return csv.reduce(
            (acc, record) => {
                acc[record.email] = record;
                return acc;
            },
            {} as Record<string, PhishingRecord>
        );
    });
});

/**
 * Computes a reactive set of phishing records that exist in all CSVs.
 *
 * @returns {ComputedRef<Set<PhishingRecord> | null>} A computed reference containing a set of phishing records
 * that are common across all CSVs. If no common records exist or if all CSVs are `null`, it returns `null`.
 *
 * Notes:
 * - The intersection is determined based on the email field of the phishing records.
 * - If a CSV is `null`, it is skipped during the computation.
 * - The resulting set contains unique phishing records that match the intersected emails.
 */
export const recordsIntersection = computed(() => {
    let matchingEmails: Set<string> | null = null;

    for (const csv of recordsByEmail.value) {
        if (!csv) continue;
        const emails = new Set(Object.keys(csv));
        matchingEmails = matchingEmails
            ? new Set([...matchingEmails].filter((email: string) => emails.has(email)))
            : emails;
    }

    if (!matchingEmails) return null;
    const matchingRecords = new Set<PhishingRecord>();
    for (const csv of recordsByEmail.value) {
        if (!csv) continue;
        for (const email of matchingEmails) {
            if (csv[email]) matchingRecords.add(csv[email]);
        }
    }

    return matchingRecords;
});
