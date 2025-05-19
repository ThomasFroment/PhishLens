<script lang="ts" setup>
import type { ChartDefinition } from "@/types";
import TreemapChart from "@/components/charts/TreemapChart.vue";
import TreemapDoc from "@/components/charts/doc/TreemapDoc.vue";
import CardTemplate from "@/components/cards/utils/CardTemplate.vue";
import StackedbarChart from "@/components/charts/StackedbarChart.vue";
import StackedbarDoc from "@/components/charts/doc/StackedbarDoc.vue";
import HeatmapChart from "@/components/charts/HeatmapChart.vue";

defineProps<{
    id: number;
}>();

const chartDefinitions: ChartDefinition[] = [
    {
        chart: TreemapChart,
        doc: TreemapDoc
    },
    {
        chart: StackedbarChart,
        doc: StackedbarDoc
    },
    {
        chart: HeatmapChart
    }
];
</script>

<template>
    <CardTemplate :id="id" :chartDefinitions="chartDefinitions" />
</template>
