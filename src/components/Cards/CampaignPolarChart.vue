<template>
    <div class="card">
        <v-chart class="chart" :option="option" />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import type { BarSeriesOption } from "echarts/charts";
import { BarChart } from "echarts/charts";
import type { LegendComponentOption, PolarComponentOption, TooltipComponentOption } from "echarts/components";
import { LegendComponent, PolarComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

use([LegendComponent, PolarComponent, TooltipComponent, BarChart, CanvasRenderer]);

type EChartsOption = ComposeOption<LegendComponentOption | PolarComponentOption | TooltipComponentOption | BarSeriesOption>;

const option = computed<EChartsOption>(() => {
    return {
        legend: {
            orient: "horizontal",
            bottom: 20,
            right: "center"
        },
        polar: {
            radius: [30, "70%"]
        },
        angleAxis: {
            startAngle: 90,
            splitLine: {
                show: false
            }
        },
        radiusAxis: {
            type: "category",
            data: []
        },
        tooltip: {
            trigger: "item",
            formatter: function (params) {
                // @ts-expect-error All those properties are not direct properties of params so ts get emotional
                return `${params.marker} ${params.seriesName}: <strong>${params.value}</strong>`;
            }
        },
        series: [
            {
                name: "Data Submitted",
                type: "bar",
                data: [148],
                coordinateSystem: "polar"
            },
            {
                name: "Clicked Link",
                type: "bar",
                data: [183],
                coordinateSystem: "polar"
            },
            {
                name: "Email Opened",
                type: "bar",
                data: [345],
                coordinateSystem: "polar"
            },
            {
                name: "Email Sent",
                type: "bar",
                data: [513],
                coordinateSystem: "polar"
            }
        ]
    };
});
</script>
