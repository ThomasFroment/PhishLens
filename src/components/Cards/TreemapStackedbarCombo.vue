<script lang="ts" setup>
import type { ChartOption } from "@/types";
import TreemapChart from "@/components/Charts/TreemapChart.vue";
import TreemapDoc from "@/components/Charts/Doc/TreemapDoc.vue";
import CardTemplate from "@/components/Cards/Utils/CardTemplate.vue";

defineProps<{
    id: number;
}>();

const option: ChartOption[] = [
    {
        chart: TreemapChart,
        doc: TreemapDoc
    }
];
</script>

<template>
    <CardTemplate :id="id" :option="option" />
</template>
