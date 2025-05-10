<template>
    <div class="card">
        <v-chart class="chart" :option="option" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { countByStatus, recordsByStatus } from "@/composables/chartCsv.ts";

import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import type { PieSeriesOption } from "echarts/charts";
import { PieChart } from "echarts/charts";
import type { LegendComponentOption } from "echarts/components";
import { LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

use([LegendComponent, PieChart, CanvasRenderer]);

type EChartsOption = ComposeOption<LegendComponentOption | PieSeriesOption>;

const option = ref<EChartsOption | null>(null);

watch(recordsByStatus, (newVal) => {
    console.log(countByStatus.value);
    option.value = {
        series: [
            {
                name: "Nightingale Chart",
                type: "pie",
                radius: [50, 200],
                center: ["50%", "50%"],
                roseType: "area",
                itemStyle: {
                    borderRadius: 8
                },
                data: [
                    { value: 513, name: "Email Sent" },
                    { value: 345, name: "Email Opened" },
                    { value: 183, name: "Clicked Link" },
                    { value: 148, name: "Data Submitted" }
                ]
            }
        ]
    };
});
</script>

<style scoped>
.chart {
    width: 100%;
    height: 100%;
}
</style>
