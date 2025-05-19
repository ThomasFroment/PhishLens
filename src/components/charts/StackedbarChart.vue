<script lang="ts" setup>
import { computed } from "vue";
import { countByPosition, countByStatusByPosition } from "@/composables/usePhishingMetrics.ts";
import { translationHashmap } from "@/utils/translation.ts";

import { use } from "echarts/core";
import { BarChart } from "echarts/charts";
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
import type { ComposeOption } from "echarts/core";
import type { BarSeriesOption } from "echarts/charts";
import type { GridComponentOption } from "echarts/components";
import { roundToNDecimal } from "@/utils/utils.ts";

const { id } = defineProps<{
    id: number;
}>();

use([LegendComponent, TooltipComponent, GridComponent, DataZoomComponent, BarChart, CanvasRenderer]);
type EChartsOption = ComposeOption<
    TooltipComponentOption | LegendComponentOption | DataZoomComponentOption | GridComponentOption | BarSeriesOption
>;

const option = computed<EChartsOption | null>(() => {
    const campaignCountByStatusByPosition = countByStatusByPosition.value[id];
    const campaignCountByPosition = countByPosition.value[id];

    if (!campaignCountByStatusByPosition || !campaignCountByPosition) return null;

    const xAxisData = Object.keys(campaignCountByStatusByPosition);

    return {
        textStyle: {
            fontFamily: "Inter"
        },
        tooltip: {
            trigger: "item",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: function (params: any) {
                return `<strong>CSV n°${id + 1}</strong> <br/>
                        ${params.marker} ${params.name} <br/>
                        ${params.seriesName}: <strong>${roundToNDecimal(params.value * 100)}</strong>%
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
            data: xAxisData.map((val) => {
                return val || "Autres";
            }),
            axisLabel: {
                interval: 0,
                rotate: -30
            }
        },
        yAxis: {
            type: "value"
        },
        barWidth: "50%",
        series: [
            {
                name: translationHashmap["Submitted Data"],
                type: "bar",
                stack: "total",
                data: xAxisData.map((val) => {
                    return (
                        (campaignCountByStatusByPosition[val]["Submitted Data"] ?? 0) /
                        (campaignCountByPosition[val] ?? 1)
                    );
                })
            },
            {
                name: translationHashmap["Clicked Link"],
                type: "bar",
                stack: "total",
                data: xAxisData.map((val) => {
                    return (
                        (campaignCountByStatusByPosition[val]["Clicked Link"] ?? 0) /
                        (campaignCountByPosition[val] ?? 1)
                    );
                })
            },
            {
                name: translationHashmap["Email Opened"],
                type: "bar",
                stack: "total",
                data: xAxisData.map((val) => {
                    return (
                        (campaignCountByStatusByPosition[val]["Email Opened"] ?? 0) /
                        (campaignCountByPosition[val] ?? 1)
                    );
                })
            },
            {
                name: translationHashmap["Email Sent"],
                type: "bar",
                stack: "total",
                data: xAxisData.map((val) => {
                    return (
                        (campaignCountByStatusByPosition[val]["Email Sent"] ?? 0) / (campaignCountByPosition[val] ?? 1)
                    );
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
