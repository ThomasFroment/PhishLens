<template>
    <form class="flex flex-row justify-end gap-4 rounded-2xl bg-slate-50 p-4 shadow-md" @submit.prevent="submitHandler">
        <FileInput id="first-file" ref="first-file" />
        <FileInput id="second-file" ref="second-file" />
        <button
            class="ml-3 h-11 cursor-pointer rounded-xl bg-slate-700 px-6 text-gray-100 shadow shadow-slate-900/40 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
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
        .map((ref) => ref.value?.csvFileData.content as CSVData | null)
        .filter((content): content is CSVData => content !== null);

    useUpdateCSV(csv);
}
</script>
