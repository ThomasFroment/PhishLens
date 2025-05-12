import { computed, readonly, ref } from "vue";
import type { PhishingRecord, StatusType } from "@/utils/csv";

const _csvArray = ref<(PhishingRecord[] | null)[]>([]);
export const csvArray = readonly(_csvArray);

export function useUpdateCSV(newCSVArray: (PhishingRecord[] | null)[]) {
    _csvArray.value = newCSVArray;
}

export const recordsByStatus = computed(() => {
    return csvArray.value.map((csv) => {
        if (!csv) return null;
        return csv.reduce(
            (acc, curr) => {
                acc[curr.status] = acc[curr.status] || [];
                acc[curr.status].push(curr);
                return acc;
            },
            {} as Record<StatusType, PhishingRecord[]>
        );
    });
});

// Return the count of record for each status ('link clicked', ...) per campaign
export const countByStatus = computed(() => {
    return recordsByStatus.value.map((c) => {
        if (!c) return null;
        return Object.fromEntries(Object.entries(c).map(([key, val]) => [key, val.length]));
    }) as Record<StatusType, number>[];

    /*    return recordsByStatus.value.map((campaign) => {
            if (!campaign) return null;
            return Object.fromEntries(
                statusEnum.map((status) => {
                    return [status, campaign[status].length];
                })
            ) as Record<StatusType, number>;
        });*/
});
