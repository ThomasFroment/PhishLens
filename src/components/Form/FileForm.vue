<script lang="ts" setup>
import { useTemplateRef } from "vue";
import FileInput from "@/components/Form/FileInput.vue";
import { useUpdateCSV } from "@/composables/usePhishingMetrics.ts";
import type { PhishingRecord } from "@/utils/parser.ts";

const csvFilesRef = [useTemplateRef("first-file"), useTemplateRef("second-file")];

async function submitHandler() {
    const csv = csvFilesRef.map((ref) => ref.value?.csvFileData.content as PhishingRecord[] | null);
    useUpdateCSV(csv);
}
</script>

<template>
    <form class="card form-wrapper" @submit.prevent="submitHandler">
        <FileInput :id="1" ref="first-file" />
        <FileInput :id="2" ref="second-file" />
        <button class="submit-button btn" type="submit">Analyser</button>
    </form>
</template>

<style scoped>
.form-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 1rem;
    padding: 0.75rem 1.25rem;
}

.submit-button {
    cursor: pointer;
    margin-left: 0.75rem;
    border: none;
    border-radius: 0.75rem;
    background-color: var(--color-slate-700);
    padding: 0 1.5rem;
    height: 2.75rem;
    color: var(--color-slate-50);
}
</style>
