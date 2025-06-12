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
import {
    DataZoomComponent,
    type DataZoomComponentOption,
    GridComponent,
    type GridComponentOption,
    TitleComponent,
    type TitleComponentOption,
    VisualMapComponent,
    type VisualMapComponentOption
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { calcPercentage } from "@/utils/utils.ts";

const { id } = defineProps<{
    id: number;
}>();

use([DataZoomComponent, GridComponent, TitleComponent, VisualMapComponent, HeatmapChart, CanvasRenderer]);
type EChartsOption = ComposeOption<
    | DataZoomComponentOption
    | GridComponentOption
    | VisualMapComponentOption
    | HeatmapSeriesOption
    | TitleComponentOption
>;

const option = computed<EChartsOption | null>(() => {
    const campaignCountByStatusByPosition = countByStatusByPosition.value[id];
    const campaignCountByPosition = countByPosition.value[id];

    if (!campaignCountByStatusByPosition || !campaignCountByPosition) return null;

    const xAxisData = Object.keys(campaignCountByStatusByPosition);
    const data = xAxisData.reduce(
        (acc, position, index) => {
            const countByStatus = aggregatePhishingStatus(campaignCountByStatusByPosition[position]);
            const total = campaignCountByPosition[position];

            statusEnum.forEach((status) => {
                acc.push([index, translationHashmap[status], calcPercentage(countByStatus[status], total) || "-"]);
            });
            return acc;
        },
        [] as (string | number)[][]
    );

    return {
        title: {
            text: `Matrice des taux d'actions / service\nde la campagne n°${id + 1}`,
            top: "10%",
            right: "0"
        },
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
        tooltip: {
            trigger: "axis",
            // @ts-expect-error All those properties are not direct properties of params so ts get emotional
            formatter: function (params) {
                return `<strong>CSV n°${id + 1}</strong> <br/>
                        ${params[0].name} <br/>
                        ${params[3].marker} ${params[3].value[1]}: <strong>${params[3].value[2]}</strong>% <br/>
                        ${params[2].marker} ${params[2].value[1]}: <strong>${params[2].value[2]}</strong>% <br/>
                        ${params[1].marker} ${params[1].value[1]}: <strong>${params[1].value[2]}</strong>% <br/>
                        ${params[0].marker} ${params[0].value[1]}: <strong>${params[0].value[2]}</strong>% <br/>
                `;
            }
        },
        visualMap: {
            orient: "horizontal",
            calculable: true,
            min: 10,
            max: 100,
            inRange: {
                color: ["#516b91", "#59c4e6", "#a5e7f0"]
            }
        },
        series: [
            {
                type: "heatmap",
                label: {
                    show: true,
                    formatter: (params) => {
                        // @ts-expect-error All those properties are not direct properties of params so ts get emotional
                        return `${params.value[2] ?? 0}%`;
                    }
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
