<script lang="ts" setup>
import { computed } from "vue";
import { countByStatus } from "@/composables/usePhishingMetrics.ts";
import { aggregatePhishingStatus } from "@/utils/dataOps.ts";
import { translationHashmap } from "@/utils/translation.ts";

import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import type { FunnelSeriesOption } from "echarts/charts";
import { FunnelChart } from "echarts/charts";
import {
    LegendComponent,
    type LegendComponentOption,
    TitleComponent,
    type TitleComponentOption,
    TooltipComponent,
    type TooltipComponentOption
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { calcPercentage, sumValues } from "@/utils/utils.ts";

const { id } = defineProps<{
    id: number;
}>();

use([LegendComponent, TitleComponent, FunnelChart, CanvasRenderer, TooltipComponent]);
type EChartsOption = ComposeOption<
    LegendComponentOption | TitleComponentOption | FunnelSeriesOption | TooltipComponentOption
>;

const option = computed<EChartsOption | null>(() => {
    const campaignCountByStatus = countByStatus.value[id];
    if (!campaignCountByStatus) return null;

    const aggregatedCount = aggregatePhishingStatus(campaignCountByStatus);
    const total = sumValues(campaignCountByStatus);

    return {
        title: {
            text: `Graphique entonnoir des actions de la campagne n°${id + 1}`,
            right: "0"
        },
        textStyle: {
            fontFamily: "Inter"
        },
        legend: {
            width: "100%",
            bottom: 10,
            right: "center"
        },
        tooltip: {
            trigger: "item",
            formatter: function (params) {
                // @ts-expect-error All those properties are not direct properties of params so ts get emotional
                return `<strong>CSV n°${id + 1}</strong> <br/> ${params.marker} ${params.name}: <strong>${params.value}</strong> (${calcPercentage(params.value, total)}%)`;
            }
        },
        series: [
            {
                type: "funnel",
                data: Object.entries(aggregatedCount).map(([key, value]) => ({
                    name: translationHashmap[key],
                    value: value
                }))
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
