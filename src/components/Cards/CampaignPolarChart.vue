<template>
    <div class="card">
        <v-chart v-if="option" :option="option" class="chart" />
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { countByStatus } from "@/composables/chartCsv.ts";

import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import type { BarSeriesOption } from "echarts/charts";
import { BarChart } from "echarts/charts";
import type {
    LegendComponentOption,
    PolarComponentOption,
    TooltipComponentOption
} from "echarts/components";
import { LegendComponent, PolarComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { aggregatePhishingStatus } from "@/utils/chart.ts";

const props = defineProps({
    id: {
        type: Number,
        required: true
    }
});

use([LegendComponent, PolarComponent, TooltipComponent, BarChart, CanvasRenderer]);

type EChartsOption = ComposeOption<
    LegendComponentOption | PolarComponentOption | TooltipComponentOption | BarSeriesOption
>;

const option = computed<EChartsOption | undefined>(() => {
    if (!countByStatus.value[props.id]) return;
    const aggregatedCount = aggregatePhishingStatus(countByStatus.value[props.id]);

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
                name: "Submitted Data",
                type: "bar",
                data: [aggregatedCount["Submitted Data"]],
                coordinateSystem: "polar"
            },
            {
                name: "Clicked Link",
                type: "bar",
                data: [aggregatedCount["Clicked Link"]],
                coordinateSystem: "polar"
            },
            {
                name: "Email Opened",
                type: "bar",
                data: [aggregatedCount["Email Opened"]],
                coordinateSystem: "polar"
            },
            {
                name: "Email Sent",
                type: "bar",
                data: [aggregatedCount["Email Sent"]],
                coordinateSystem: "polar"
            }
        ]
    };
});
</script>
