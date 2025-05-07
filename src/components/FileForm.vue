<template>
    <form class="m-4 flex flex-row justify-end gap-4 rounded-2xl p-4 shadow-md" @submit.prevent="submitHandler">
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
import { onMounted, useTemplateRef } from "vue";
import FileInput from "@/components/FileInput.vue";
import { readFilesAsText, stringToCSV } from "@/utils/csv.ts";

const firstFileInput = useTemplateRef("first-file");
const secondFileInput = useTemplateRef("second-file");

async function submitHandler() {
    if (!firstFileInput.value?.inputFile) return;
    if (!secondFileInput.value?.inputFile) return;

    const firstFile = firstFileInput.value.inputFile;
    const secondFile = secondFileInput.value.inputFile;

    if (firstFile.type !== "text/csv" || secondFile.type !== "text/csv") return;

    const filesAsText = await readFilesAsText([firstFile, secondFile]);

    for (const text of filesAsText) {
        const record = stringToCSV(text);
        console.log(record);
    }
}

onMounted(() => {});
</script>
