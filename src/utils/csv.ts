import Papa from "papaparse";
import { z } from "zod";

export function readFileAsText(file: File): Promise<string> {
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

export function parseCSV(text: string) {
    return Papa.parse<Record<string, string>>(text.replace(/["\t]/g, ""), {
        delimiter: ",",
        skipEmptyLines: true,
        header: true
    });
}

export const statusEnum = ["Email Sent", "Email Opened", "Clicked Link", "Submitted Data"] as const;

const phishingRecordSchema = z.object({
    id: z.string(),
    email: z.string(),
    status: z.enum(statusEnum),
    first_name: z.string(),
    last_name: z.string(),
    position: z.string(),
    reported: z.string()
});

export type StatusType = (typeof statusEnum)[number];
export type PhishingRecord = z.infer<typeof phishingRecordSchema>;

export function parseStringToCSV(text: string) {
    const csv = parseCSV(text);

    const result = phishingRecordSchema.array().safeParse(csv.data);
    if (!result.success) return;

    return result.data as PhishingRecord[];
}
