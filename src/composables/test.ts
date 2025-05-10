import { ref } from "vue";
import type { CSVData } from "@/types";

const csvArray = ref<(CSVData | null)[]>([]);

export function useUpdateCSV(newCSVArray: (CSVData | null)[]) {
    csvArray.value = newCSVArray;
}
