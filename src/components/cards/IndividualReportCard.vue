<script lang="ts" setup>
import CardTemplate from "@/components/cards/utils/CardTemplate.vue";
import type { ChartDefinition } from "@/types";
import DoughnutReportChart from "@/components/charts/DoughnutReportChart.vue";
import StackedbarReportChart from "@/components/charts/StackedbarReportChart.vue";

defineProps<{
    id: number;
}>();

const chartDefinitions: ChartDefinition[] = [
    {
        chart: DoughnutReportChart
    },
    {
        chart: StackedbarReportChart
    }
];
</script>

<template>
    <CardTemplate :id="id" :chartDefinitions="chartDefinitions" />
</template>
