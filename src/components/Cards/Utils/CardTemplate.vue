<script lang="ts" setup>
import type { ChartOption } from "@/types.d.ts";
import { computed, provide, ref } from "vue";
import CardHeader from "@/components/Cards/Utils/CardHeader.vue";

const { option } = defineProps<{
    id: number;
    option: ChartOption[];
}>();

const currentOption = computed(() => option[selectedChart.value] ?? option[0]);
const selectedChart = ref<number>(1);
const isVisible = ref<boolean>(false);

provide("chartAmount", option.length);
provide("selectedChart", selectedChart);
provide("isVisible", isVisible);
</script>

<template>
    <div class="card">
        <CardHeader v-if="isVisible">
            <template #dropdown-content>
                <component :is="currentOption.doc" :id="id" />
            </template>
        </CardHeader>
        <component :is="currentOption.chart" :id="id" />
    </div>
</template>
