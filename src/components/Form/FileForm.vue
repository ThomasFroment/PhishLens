<template>
    <form class="card form-wrapper" @submit.prevent="submitHandler">
        <FileInput :id="'first-file'" ref="first-file" />
        <FileInput :id="'second-file'" ref="second-file" />
        <button
            class="submit-button"
            type="submit"
        >
            Submit
        </button>
    </form>
</template>

<script lang="ts" setup>
import { useTemplateRef } from "vue";
import FileInput from "@/components/Form/FileInput.vue";
import { useUpdateCSV } from "@/composables/test.ts";
import type { CSVData } from "@/types";

const csvFilesRef = [useTemplateRef("first-file"), useTemplateRef("second-file")];

async function submitHandler() {
    // prettier-ignore
    const csv = csvFilesRef
        .map((ref) => ref.value?.csvFileData.content as CSVData | null);

    useUpdateCSV(csv);
}
</script>

<style scoped>
.card {
    box-shadow: var(--shadow-md);
    border-radius: 1rem;
    background-color: var(--color-slate-50);
}

.form-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 1rem;
    padding: 0.75rem 1.25rem;
}

.submit-button {
    color: var(--color-slate-50);
    background-color: var(--color-slate-700);
    transition: all 150ms var(--default-transition-timing-function);
    margin-left: 0.75rem;
    height: 2.75rem;
    cursor: pointer;
    border-radius: 0.75rem;
    padding: 0 1.5rem;
    box-shadow: var(--shadow);
    border: none;
}

.submit-button:hover {
    transform: translateY(-0.125rem);
    box-shadow: var(--shadow-md);
}
</style>
