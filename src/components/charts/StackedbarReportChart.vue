<script lang="ts" setup>
import { computed } from "vue";
import { countByPosition, countByReportedByPosition } from "@/composables/usePhishingMetrics.ts";
import { translationHashmap } from "@/utils/translation.ts";

import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import type { BarSeriesOption } from "echarts/charts";
import { BarChart } from "echarts/charts";
import type { GridComponentOption } from "echarts/components";
import {
    DataZoomComponent,
    type DataZoomComponentOption,
    GridComponent,
    LegendComponent,
    type LegendComponentOption,
    TooltipComponent,
    type TooltipComponentOption
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { roundToNDecimal } from "@/utils/utils.ts";

const { id } = defineProps<{
    id: number;
}>();

use([LegendComponent, TooltipComponent, GridComponent, DataZoomComponent, BarChart, CanvasRenderer]);
type EChartsOption = ComposeOption<
    TooltipComponentOption | LegendComponentOption | DataZoomComponentOption | GridComponentOption | BarSeriesOption
>;

const option = computed<EChartsOption | null>(() => {
    const campaignCountByReportedByPosition = countByReportedByPosition.value[id];
    const campaignCountByPosition = countByPosition.value[id];

    if (!campaignCountByReportedByPosition || !campaignCountByPosition) return null;

    const xAxisData = Object.keys(campaignCountByReportedByPosition);

    return {
        textStyle: {
            fontFamily: "Inter"
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: function (params: any) {
                return `<strong>CSV n°${id + 1}</strong> <br/>
                        ${params[0].name} <br/>
                        ${params[1].marker} ${params[1].seriesName}: <strong>${roundToNDecimal(params[1].value * 100)}</strong>% <br/>
                        ${params[0].marker} ${params[0].seriesName}: <strong>${roundToNDecimal(params[0].value * 100)}</strong>% <br/>
                `;
            }
        },
        dataZoom: [
            {
                type: "slider",
                xAxisIndex: 0,
                zoomLock: true,
                handleSize: 20,
                minValueSpan: 8,
                maxValueSpan: 8,
                top: "2", // Should be equivalent to 1rem
                left: "30%",
                right: "10%",
                brushSelect: false
            }
        ],
        xAxis: {
            type: "category",
            data: xAxisData,
            axisLabel: {
                interval: 0,
                rotate: -30
            }
        },
        yAxis: {
            type: "value"
        },
        barWidth: "60%",
        series: [
            {
                name: translationHashmap["false"],
                type: "bar",
                stack: "total",
                data: xAxisData.map((val) => {
                    return (campaignCountByReportedByPosition[val]["false"] ?? 0) / (campaignCountByPosition[val] ?? 1);
                })
            },
            {
                name: translationHashmap["true"],
                type: "bar",
                stack: "total",
                data: xAxisData.map((val) => {
                    return (campaignCountByReportedByPosition[val]["true"] ?? 0) / (campaignCountByPosition[val] ?? 1);
                })
            }
        ]
    };
});

defineExpose({
    option
});
</script>

<template>
    <v-chart :option="option ?? {}" />
</template>
