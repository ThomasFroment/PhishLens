<script lang="ts" setup>
import { computed } from "vue";
import { countByPosition, countByStatusByPosition } from "@/composables/usePhishingMetrics.ts";
import { translationHashmap } from "@/utils/translation.ts";
import { aggregatePhishingStatus } from "@/utils/dataOps.ts";
import { statusEnum } from "@/utils/parser.ts";

import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import type { HeatmapSeriesOption } from "echarts/charts";
import { HeatmapChart } from "echarts/charts";
import type { DataZoomComponentOption, GridComponentOption, VisualMapComponentOption } from "echarts/components";
import { DataZoomComponent, GridComponent, VisualMapComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

const { id } = defineProps<{
    id: number;
}>();

use([DataZoomComponent, GridComponent, VisualMapComponent, HeatmapChart, CanvasRenderer]);
type EChartsOption = ComposeOption<
    DataZoomComponentOption | GridComponentOption | VisualMapComponentOption | HeatmapSeriesOption
>;

const option = computed<EChartsOption | null>(() => {
    const campaignCountByStatusByPosition = countByStatusByPosition.value[id];
    const campaignCountByPosition = countByPosition.value[id];

    if (!campaignCountByStatusByPosition || !campaignCountByPosition) return null;

    const xAxisData = Object.keys(campaignCountByStatusByPosition);
    const data = xAxisData.reduce(
        (acc, val, index) => {
            const status = aggregatePhishingStatus(campaignCountByStatusByPosition[val]);
            statusEnum.forEach((key) => {
                acc.push([index, translationHashmap[key], status[key] || "-"]);
            });
            return acc;
        },
        [] as (string | number)[][]
    );

    return {
        textStyle: {
            fontFamily: "Inter"
        },
        grid: {
            height: "40%",
            top: "25%"
        },
        dataZoom: [
            {
                type: "slider",
                start: 0,
                end: 40,
                xAxisIndex: 0,
                handleSize: 20,
                top: "2", // Should be equivalent to 1rem
                left: "30%",
                right: "10%",
                brushSelect: false
            }
        ],
        xAxis: {
            type: "category",
            data: xAxisData.map((val) => {
                return val || "AUTRES";
            }),
            axisLabel: {
                interval: 0,
                rotate: -30
            }
        },
        yAxis: {
            type: "category",
            data: [
                translationHashmap["Email Sent"],
                translationHashmap["Email Opened"],
                translationHashmap["Clicked Link"],
                translationHashmap["Submitted Data"]
            ]
        },
        visualMap: {
            orient: "horizontal",
            calculable: true,
            min: 0,
            max: 60,
            inRange: {
                color: ["#516b91", "#59c4e6", "#a5e7f0"]
            }
        },
        series: [
            {
                type: "heatmap",
                label: {
                    show: true
                },
                data: data
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
