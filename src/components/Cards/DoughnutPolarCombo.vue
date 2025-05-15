<script lang="ts" setup>
import CardTemplate from "@/components/Cards/Utils/CardTemplate.vue";
import type { ChartOption } from "@/types";
import DoughnutChart from "@/components/Charts/DoughnutChart.vue";
import DoughnutDoc from "@/components/Charts/Doc/DoughnutDoc.vue";
import PolarChart from "@/components/Charts/PolarChart.vue";
import PolarDoc from "@/components/Charts/Doc/PolarDoc.vue";

defineProps<{
    id: number;
}>();

const option: ChartOption[] = [
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
    <CardTemplate :id="id" :option="option" />
</template>
