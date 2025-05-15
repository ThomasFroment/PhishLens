<script lang="ts" setup>
import { type ComponentPublicInstance, ref } from "vue";
import FileInput from "@/components/Form/FileInput.vue";
import { useUpdateCSV } from "@/composables/usePhishingMetrics.ts";
import type { PhishingRecord } from "@/utils/parser.ts";

const csvFilesRef = ref<ComponentPublicInstance<typeof FileInput>[]>([]);

async function submitHandler() {
    const csv = csvFilesRef.value.map((input) => input.csvFileData.content as PhishingRecord[] | null);
    useUpdateCSV(csv);
}
</script>

<template>
    <form class="card form-wrapper" @submit.prevent="submitHandler">
        <FileInput
            v-for="i in 2"
            :id="i"
            :key="i"
            :ref="(el) => el && (csvFilesRef[i - 1] = el as ComponentPublicInstance<typeof FileInput>)"
        />
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
    border-bottom: 2px solid var(--color-background-offset);
    border-radius: 0.75rem;
    background-color: var(--color-background-offset);
    padding: 0 1.5rem;
    height: 2.75rem;
    font-weight: bold;
}

.submit-button:hover {
    border-bottom: 2px solid var(--color-accent);
}
</style>
