import { computed, readonly, ref } from "vue";
import type { PhishingRecord } from "@/utils/csv";

const _csvArray = ref<(PhishingRecord[] | null)[]>([]);
export const csvArray = readonly(_csvArray);

export function useUpdateCSV(newCSVArray: (PhishingRecord[] | null)[]) {
    _csvArray.value = newCSVArray;
}

export const recordsByStatus = computed(() => {
    console.log("useCategorizeByStatus");
    return csvArray.value.map((csv) => {
        if (!csv) return null;
        return csv.reduce(
            (acc, curr) => {
                acc[curr.status] = acc[curr.status] || [];
                acc[curr.status].push(curr);
                return acc;
            },
            {} as Record<string, PhishingRecord[]>
        );
    });
});

export const countByStatus = computed(() => {
    console.log("useCountByStatus");
    return recordsByStatus.value.map((c) => {
        if (!c) return null;
        return Object.fromEntries(Object.entries(c).map(([key, val]) => [key, val.length]));
    });
});
