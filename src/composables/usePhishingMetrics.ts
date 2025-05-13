import { computed, ref } from "vue";
import { countElementsInObject, groupRecordsByValue } from "@/utils/dataOps.ts";

import type { PhishingRecord, StatusType } from "@/utils/parser.ts";
import type { MaybePhishingRecords } from "@/types.d.ts";

const csvArray = ref<MaybePhishingRecords[]>([]);

/**
 * Updates the reactive CSV array with a new array of phishing records.
 *
 * @param {MaybePhishingRecords[]} newCSVArray - The new array of phishing records or null values.
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
const recordsByStatus = computed(() => {
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
 * Computes a reactive array of phishing records grouped by their status themselves grouped by position.
 *
 * @returns {ComputedRef<(Record<string, Record<StatusType, PhishingRecord[]> | null>)[]>} A computed reference
 * containing an array where each element is either a record of phishing records grouped by status within each position
 * or `null` if the corresponding CSV is `null`.
 *
 * Notes:
 * - If a CSV is `null`, the corresponding element in the result will also be `null` (to maintain the order).
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
 * containing an array where each element is either a record of counts of phishing records grouped by status
 * within each position or `null` if the corresponding CSV is `null`.
 *
 * Notes:
 * - If a CSV is `null`, the corresponding element in the result will also be `null` (to maintain the order).
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
