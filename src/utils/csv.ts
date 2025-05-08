import Papa from "papaparse";
import type { CSVData } from "@/types";

function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result !== "string") {
                reject(new Error("Could not read file"));
                return;
            }
            resolve(result);
        };

        reader.onerror = () => reject(new Error("Could not read file"));
        reader.readAsText(file);
    });
}

export function readFilesAsText(files: File[]) {
    return Promise.all(files.map(readFileAsText));
}

export const REQUIRED_CSV_FIELDS = ["id", "status", "email", "first_name", "last_name", "position", "reported", "send_date", "modified_date"];

export function parseCSV(text: string) {
    return Papa.parse<Record<string, string>>(text.replace(/["\t]/g, ""), {
        delimiter: ",",
        skipEmptyLines: true,
        header: true
    });
}

export function validateCSV(fields: string[] | undefined): boolean {
    return Array.isArray(fields) && REQUIRED_CSV_FIELDS.every((val) => fields.includes(val));
}

export function stringToCSV(text: string) {
    const parsed = parseCSV(text);
    if (!validateCSV(parsed.meta.fields)) return;
    return parsed;
}

export function stringsToCSV(texts: string[]) {
    return texts.reduce((acc, text) => {
        const parsed = parseCSV(text);
        if (!validateCSV(parsed.meta.fields)) return acc;
        acc.push(parsed.data);
        return acc;
    }, [] as CSVData[]);
}
