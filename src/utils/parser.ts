import Papa, { type ParseResult } from "papaparse";
import { z } from "zod";

/**
 * Reads the content of a file as a text string.
 *
 * @param {File} file - The file to be read.
 * @returns {Promise<string>} A promise that resolves with the file's content as a string,
 * or rejects with an error if the file cannot be read.
 */
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

/**
 * Parses a CSV string into an array of objects using the PapaParse library.
 *
 * @param {string} text - The CSV string to be parsed.
 * @returns {ParseResult<Record<string, string>>} The result of the parsing operation,
 * containing the parsed data and any metadata or errors.
 *
 * Notes:
 * - The input string is sanitized by removing double quotes and tab characters before parsing.
 * - The parser uses a comma as the delimiter, skips empty lines, and treats the first row as headers.
 */
export function parseCSV(text: string): ParseResult<Record<string, string>> {
    return Papa.parse<Record<string, string>>(text.replace(/["\t]/g, ""), {
        delimiter: ",",
        skipEmptyLines: true,
        header: true
    });
}

export const statusEnum = ["Email Sent", "Email Opened", "Clicked Link", "Submitted Data"] as const;

const phishingRecordSchema = z.object({
    email: z.string().email(),
    status: z.enum(statusEnum),
    position: z.string(),
    reported: z.string()
});

export type StatusType = (typeof statusEnum)[number];
export type PhishingRecord = z.infer<typeof phishingRecordSchema>;

/**
 * Parses a CSV string into an array of phishing records.
 *
 * @param {string} text - The CSV string to be parsed.
 * @returns {PhishingRecord[] | undefined} An array of phishing records if parsing and validation succeed,
 * or `undefined` if validation fails.
 *
 * Notes:
 * - The CSV string is first parsed by the `parseCSV` function.
 * - The parsed data is validated against the `phishingRecordSchema` using Zod.
 * - If validation fails, the function returns `undefined`.
 */
export function parseStringToCSV(text: string): PhishingRecord[] | undefined {
    const csv = parseCSV(text);

    const result = phishingRecordSchema.array().safeParse(csv.data);
    if (!result.success) return;

    return result.data;
}
