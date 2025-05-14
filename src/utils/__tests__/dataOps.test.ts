import { describe, expect, it } from "vitest";
import { aggregatePhishingStatus, countElementsInObject, groupRecordsByValue } from "../dataOps";
import type { PhishingRecord, StatusType } from "@/utils/parser.ts";

describe("aggregatePhishingStatus", () => {
    it("returns correct aggregated counts for valid input", () => {
        const input: Record<StatusType, number> = {
            "Submitted Data": 5,
            "Clicked Link": 3,
            "Email Opened": 2,
            "Email Sent": 1
        };
        const expected = {
            "Submitted Data": 5,
            "Clicked Link": 8,
            "Email Opened": 10,
            "Email Sent": 11
        };
        expect(aggregatePhishingStatus(input)).toEqual(expected);
    });

    it("handles input with all counts set to zero", () => {
        const input: Record<StatusType, number> = {
            "Submitted Data": 0,
            "Clicked Link": 0,
            "Email Opened": 0,
            "Email Sent": 0
        };
        const expected = {
            "Submitted Data": 0,
            "Clicked Link": 0,
            "Email Opened": 0,
            "Email Sent": 0
        };
        expect(aggregatePhishingStatus(input)).toEqual(expected);
    });

    it("handles input with missing statuses", () => {
        const input: Partial<Record<StatusType, number>> = {
            "Submitted Data": 5,
            "Clicked Link": 3
        };
        const expected = {
            "Submitted Data": 5,
            "Clicked Link": 8,
            "Email Opened": 8,
            "Email Sent": 8
        };
        expect(aggregatePhishingStatus(input)).toEqual(expected);
    });

    it("handles input with skipped statuses", () => {
        const input: Partial<Record<StatusType, number>> = {
            "Submitted Data": 5,
            "Email Opened": 2,
            "Email Sent": 1
        };

        const expected = {
            "Submitted Data": 5,
            "Clicked Link": 5,
            "Email Opened": 7,
            "Email Sent": 8
        };
        expect(aggregatePhishingStatus(input)).toEqual(expected);
    });

    it("throws an error for negative values", () => {
        const input: Record<StatusType, number> = {
            "Submitted Data": -5,
            "Clicked Link": -3,
            "Email Opened": -2,
            "Email Sent": -1
        };
        expect(() => aggregatePhishingStatus(input)).toThrow();
    });

    it("throws an error for invalid input types", () => {
        expect(() => aggregatePhishingStatus(null as any)).toThrow();
        expect(() => aggregatePhishingStatus(undefined as any)).toThrow();
    });
});

describe("groupRecordsByValue", () => {
    it("groups records by a specified key with unique values", () => {
        const records: PhishingRecord[] = [
            {
                email: "email1@test.fr",
                status: "Email Sent" as StatusType,
                position: "DIR TEST",
                reported: "false"
            },
            {
                email: "email2@test.fr",
                status: "Email Opened" as StatusType,
                position: "DIR TEST",
                reported: "false"
            },
            {
                email: "email3@test.fr",
                status: "Email Sent" as StatusType,
                position: "DIR TEST",
                reported: "false"
            }
        ];
        const expected = {
            "Email Sent": [
                {
                    email: "email1@test.fr",
                    status: "Email Sent",
                    position: "DIR TEST",
                    reported: "false"
                },
                {
                    email: "email3@test.fr",
                    status: "Email Sent",
                    position: "DIR TEST",
                    reported: "false"
                }
            ],
            "Email Opened": [
                {
                    email: "email2@test.fr",
                    status: "Email Opened",
                    position: "DIR TEST",
                    reported: "false"
                }
            ]
        };

        expect(groupRecordsByValue(records, "status")).toEqual(expected);
    });

    it("returns an empty object when given an empty array", () => {
        const records: PhishingRecord[] = [];
        const expected = {};
        expect(groupRecordsByValue(records, "status")).toEqual(expected);
    });
});

describe("countElementsInObject", () => {
    it("returns correct counts for non-empty arrays", () => {
        const input = {
            groupA: [1, 2, 3],
            groupB: ["a", "b"],
            groupC: [true, false, true, false]
        };
        const expected = {
            groupA: 3,
            groupB: 2,
            groupC: 4
        };
        expect(countElementsInObject(input)).toEqual(expected);
    });

    it("returns zero for empty arrays", () => {
        const input = {
            groupA: [],
            groupB: [],
            groupC: []
        };
        const expected = {
            groupA: 0,
            groupB: 0,
            groupC: 0
        };
        expect(countElementsInObject(input)).toEqual(expected);
    });

    it("handles mixed empty and non-empty arrays", () => {
        const input = {
            groupA: [1, 2],
            groupB: [],
            groupC: ["x", "y", "z"]
        };
        const expected = {
            groupA: 2,
            groupB: 0,
            groupC: 3
        };
        expect(countElementsInObject(input)).toEqual(expected);
    });

    it("returns an empty object when input is an empty object", () => {
        expect(countElementsInObject({})).toEqual({});
    });

    it("throws an error when input values are not arrays", () => {
        const input = {
            groupA: 123,
            groupB: "string",
            groupC: null
        } as any;
        expect(() => countElementsInObject(input)).toThrow();
    });
});
