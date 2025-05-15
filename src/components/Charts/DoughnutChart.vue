<script lang="ts" setup>
import { computed } from "vue";
import { countByStatus } from "@/composables/usePhishingMetrics.ts";
import { calcPercentage, sumValues } from "@/utils/utils.ts";
import { translationHashmap } from "@/utils/translation.ts";

import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import type { PieSeriesOption } from "echarts/charts";
import { PieChart } from "echarts/charts";
import type { LegendComponentOption, TooltipComponentOption } from "echarts/components";
import { LegendComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import ChartTemplate from "@/components/Charts/ChartTemplate.vue";

const { id } = defineProps<{
    id: number;
}>();

use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);
type EChartsOption = ComposeOption<TooltipComponentOption | LegendComponentOption | PieSeriesOption>;

const option = computed<EChartsOption | null>(() => {
    const campaignCountByStatus = countByStatus.value[id];
    if (!campaignCountByStatus) return null;

    const total = sumValues(campaignCountByStatus);

    return {
        textStyle: {
            fontFamily: "Inter"
        },
        tooltip: {
            trigger: "item",
            formatter: function (params) {
                // @ts-expect-error All those properties are not direct properties of params so ts get emotional
                return `<strong>CSV n°${id + 1}</strong> <br/> ${params.marker} ${params.name}: <strong>${params.value}</strong> (${calcPercentage(params.value, total)}%)`;
            }
        },
        legend: {
            width: "100%",
            bottom: 20,
            right: "center"
        },
        series: [
            {
                type: "pie",
                radius: ["40%", "80%"],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10
                },
                label: {
                    show: false,
                    position: "center"
                },
                data: [
                    { value: campaignCountByStatus["Submitted Data"], name: translationHashmap["Submitted Data"] },
                    { value: campaignCountByStatus["Clicked Link"], name: translationHashmap["Clicked Link"] },
                    { value: campaignCountByStatus["Email Opened"], name: translationHashmap["Email Opened"] },
                    { value: campaignCountByStatus["Email Sent"], name: translationHashmap["Email Sent"] }
                ]
            }
        ]
    };
});
</script>

<template>
    <ChartTemplate :option="option" />
</template>
