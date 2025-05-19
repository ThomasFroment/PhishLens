<script lang="ts" setup>
import type { ChartDefinition } from "@/types";
import TreemapChart from "@/components/charts/TreemapChart.vue";
import TreemapDoc from "@/components/charts/doc/TreemapDoc.vue";
import CardTemplate from "@/components/cards/utils/CardTemplate.vue";

defineProps<{
    id: number;
}>();

const chartDefinitions: ChartDefinition[] = [
    {
        chart: TreemapChart,
        doc: TreemapDoc
    }
];
</script>

<template>
    <CardTemplate :id="id" :chartDefinitions="chartDefinitions" />
</template>
