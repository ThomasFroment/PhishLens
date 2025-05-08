import { ref } from "vue";
import type { CSVData } from "@/types";

const csvArray = ref<CSVData[]>([]);

export function useUpdateCSV(newCSVArray: CSVData[]) {
    console.log(newCSVArray);
    csvArray.value = newCSVArray;
}
