<script lang="ts" setup>
import CardTemplate from "@/components/cards/utils/CardTemplate.vue";
import type { ChartDefinition } from "@/types";
import DoughnutChart from "@/components/charts/DoughnutChart.vue";
import DoughnutDoc from "@/components/charts/doc/DoughnutDoc.vue";
import PolarChart from "@/components/charts/PolarChart.vue";
import PolarDoc from "@/components/charts/doc/PolarDoc.vue";

defineProps<{
    id: number;
}>();

const chartDefinitions: ChartDefinition[] = [
    {
        chart: DoughnutChart,
        doc: DoughnutDoc
    },
    {
        chart: PolarChart,
        doc: PolarDoc
    }
];
</script>

<template>
    <CardTemplate :id="id" :chartDefinitions="chartDefinitions" />
</template>
