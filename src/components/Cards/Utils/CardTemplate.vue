<script lang="ts" setup>
import type { ChartDefinition } from "@/types.d.ts";
import { computed, provide, ref, unref } from "vue";
import CardHeader from "@/components/Cards/Utils/CardHeader.vue";

const { chartDefinitions } = defineProps<{
    id: number;
    chartDefinitions: ChartDefinition[];
}>();

const chartCount = chartDefinitions.length;

const selectedChart = chartCount > 1 ? ref(1) : 1;
const currDefinition = computed(() => {
    if (chartCount < 1) return null;
    const index = (unref(selectedChart) ?? 1) - 1;
    return chartDefinitions[index] ?? chartDefinitions[0];
});

if (chartCount > 1) {
    provide("chartAmount", chartCount);
    provide("selectedChart", selectedChart);
}

const chartComponentRef = ref<{ option?: unknown } | null>(null);
const isVisible = computed<boolean>(() => {
    const optionValue = chartComponentRef.value?.option ?? null;
    return optionValue !== null;
});
</script>

<template>
    <div class="card" v-if="currDefinition">
        <CardHeader v-show="isVisible">
            <template #dropdown-content>
                <component :is="currDefinition.doc" :id="id" />
            </template>
        </CardHeader>
        <component :is="currDefinition.chart" :id="id" ref="chartComponentRef" />
    </div>
</template>
