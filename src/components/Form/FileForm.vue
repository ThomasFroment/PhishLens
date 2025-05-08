<template>
    <form class="flex flex-row justify-end gap-4 rounded-2xl bg-slate-50 p-4 shadow-md" @submit.prevent="submitHandler">
        <FileInput id="first-file" ref="first-file" />
        <FileInput id="second-file" ref="second-file" />
        <button
            class="ml-4 h-11 cursor-pointer rounded-xl bg-slate-700 px-6 text-gray-100 shadow shadow-slate-900/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            type="submit"
        >
            Submit
        </button>
    </form>
</template>

<script lang="ts" setup>
import { useTemplateRef } from "vue";
import FileInput from "@/components/Form/FileInput.vue";
import { readFilesAsText, stringsToCSV } from "@/utils/csv.ts";
import { useUpdateCSV } from "@/composables/test.ts";

const filesInput = [useTemplateRef("first-file"), useTemplateRef("second-file")];

async function submitHandler() {
    const inputtedFiles = filesInput.reduce((acc, file) => {
        if (file.value?.inputFile?.type !== "text/csv") return acc;
        acc.push(file.value.inputFile);
        return acc;
    }, [] as File[]);
    if (inputtedFiles.length === 0) return;

    const filesAsText = await readFilesAsText(inputtedFiles);
    useUpdateCSV(stringsToCSV(filesAsText));
}
</script>
