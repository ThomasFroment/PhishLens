import type { PhishingRecord } from "@/utils/parser.ts";
import type { Component } from "vue";

export type MaybePhishingRecords = PhishingRecord[] | null;

export interface ChartOption {
    chart: Component;
    doc: Component;
}