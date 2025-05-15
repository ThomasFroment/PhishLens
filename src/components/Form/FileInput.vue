<script lang="ts" setup>
import { ref } from "vue";
import type { PhishingRecord } from "@/utils/parser.ts";
import { parseStringToCSV, readFileAsText } from "@/utils/parser.ts";

const { id } = defineProps<{
    id: number;
}>();

const csvFileData = ref({
    name: "",
    content: null as PhishingRecord[] | null
});

defineExpose({
    csvFileData
});

async function onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];

    if (!file || file.type !== "text/csv") return;

    const text = await readFileAsText(file);
    const csv = parseStringToCSV(text);
    if (!csv) return;

    csvFileData.value = {
        name: file.name,
        content: csv
    };
}

function onCrossClick() {
    csvFileData.value = {
        name: "",
        content: null
    };

    if (!id) return;
    const el = document.getElementById(`fileinput-${id}`) as HTMLInputElement;
    el.value = "";
}
</script>

<template>
    <div
        v-tooltip="{ theme: 'btn-tooltip', content: `Importer le fichier CSV n°${id}` }"
        :class="['file-upload-wrapper btn', { 'file-upload-wrapper--active': csvFileData.content }]"
    >
        <input :id="`fileinput-${id}`" accept="text/csv" hidden type="file" @change="onFileChange" />
        <label
            :class="['file-upload-label flex-center', { 'file-upload-label--active': csvFileData.content }]"
            :for="`fileinput-${id}`"
        >
            <span v-if="csvFileData.content" class="file-upload-text unselectable">{{ csvFileData.name }}</span>
            <svg v-else viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M728-326q0 103-72.18 174.5-72.17 71.5-175 71.5Q378-80 305.5-151.5T233-326v-380q0-72.5 51.5-123.25T408-880q72 0 123.5 50.75T583-706v360q0 42-30 72t-72.5 30q-42.5 0-72.5-29.67-30-29.68-30-72.33v-370h60v370q0 17 12.5 29.5t30.64 12.5q18.14 0 30-12.5T523-346v-360q0-48-33.5-81t-81.71-33q-48.21 0-81.5 33.06T293-706v380q0 78 54.97 132T481-140q77.92 0 132.46-54Q668-248 668-326v-390h60v390Z"
                />
            </svg>
        </label>
        <button v-if="csvFileData.content" class="file-upload-clear-btn flex-center" @click="onCrossClick">
            <svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
                />
            </svg>
        </button>
    </div>
</template>

<style scoped>
.file-upload-wrapper {
    display: flex;
    align-items: center;
    border-radius: 0.5rem;
    height: 2.75rem;
}

.file-upload-wrapper--active {
    border-bottom: 2px solid var(--color-cyan-500);
}

.file-upload-label {
    transition: all 300ms var(--default-transition-timing-function);
    cursor: pointer;
    width: 2.75rem;
    height: 100%;
}

.file-upload-label--active {
    padding-left: 1rem;
    width: 12.5rem;
}

.file-upload-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.file-upload-label svg {
    width: 1.75rem;
    height: 1.75rem;
    fill: var(--color-slate-700);
}

.file-upload-clear-btn {
    cursor: pointer;
    border: none;
    background: transparent;
    padding: 0.5rem;
    aspect-ratio: 1 / 1;

    height: 100%;
}

.file-upload-clear-btn svg {
    transition: all 150ms var(--default-transition-timing-function);
    width: 1.2rem;
    height: 1.2rem;
    fill: var(--color-cyan-800);
}

.file-upload-clear-btn:hover svg {
    transform: rotate(90deg);
    fill: var(--color-cyan-600);
}
</style>
