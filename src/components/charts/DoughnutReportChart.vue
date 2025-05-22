<script lang="ts" setup>
import { computed } from "vue";
import { countByReported } from "@/composables/usePhishingMetrics.ts";
import { calcPercentage, sumValues } from "@/utils/utils.ts";
import { translationHashmap } from "@/utils/translation.ts";

import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import type { PieSeriesOption } from "echarts/charts";
import { PieChart } from "echarts/charts";
import type { LegendComponentOption, TooltipComponentOption } from "echarts/components";
import { LegendComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { LabelLayout } from "echarts/features";

const { id } = defineProps<{
    id: number;
}>();

use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout]);
type EChartsOption = ComposeOption<TooltipComponentOption | LegendComponentOption | PieSeriesOption>;

const option = computed<EChartsOption | null>(() => {
    const campaignCountByReported = countByReported.value[id];
    if (!campaignCountByReported) return null;

    const total = sumValues(campaignCountByReported);

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
            bottom: 10,
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
                    show: true
                },
                data: [
                    { value: campaignCountByReported["false"], name: translationHashmap["false"] },
                    { value: campaignCountByReported["true"], name: translationHashmap["true"] }
                ]
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
