import type { StatusType } from "@/utils/csv.ts";

export function aggregatePhishingStatus(countByStatus: Record<StatusType, number>) {
    const aggregatedCount = {} as Record<StatusType, number>;

    aggregatedCount["Submitted Data"] = countByStatus["Submitted Data"];
    aggregatedCount["Clicked Link"] =
        aggregatedCount["Submitted Data"] + countByStatus["Clicked Link"];
    aggregatedCount["Email Opened"] =
        aggregatedCount["Clicked Link"] + countByStatus["Email Opened"];
    aggregatedCount["Email Sent"] = aggregatedCount["Email Opened"] + countByStatus["Email Sent"];

    return aggregatedCount;
}
