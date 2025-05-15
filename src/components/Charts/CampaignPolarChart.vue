<script lang="ts" setup>
import { computed } from "vue";
import { countByStatus } from "@/composables/usePhishingMetrics.ts";
import { calcPercentage, sumValues } from "@/utils/utils.ts";
import { aggregatePhishingStatus } from "@/utils/dataOps.ts";
import { translationHashmap } from "@/utils/translation.ts";

import BlankCard from "@/components/Cards/BlankCard.vue";

import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import type { BarSeriesOption } from "echarts/charts";
import { BarChart } from "echarts/charts";
import type { LegendComponentOption, PolarComponentOption, TooltipComponentOption } from "echarts/components";
import { LegendComponent, PolarComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

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

const option = computed<EChartsOption | null>(() => {
    const campaignCountByStatus = countByStatus.value[props.id];
    if (!campaignCountByStatus) return null;

    let aggregatedCount;
    try {
        aggregatedCount = aggregatePhishingStatus(campaignCountByStatus);
    } catch (e) {
        console.error("Error aggregating phishing status:", e);
        return null;
    }
    const total = sumValues(campaignCountByStatus);

    return {
        textStyle: {
            fontFamily: "Inter"
        },
        legend: {
            width: "100%",
            bottom: 20,
            right: "center"
        },
        polar: {
            radius: ["10%", "80%"]
        },
        angleAxis: {
            startAngle: 90,
            splitLine: {
                show: true
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
                return `<strong>CSV n°${props.id + 1}</strong> <br/> ${params.marker} ${params.seriesName}: <strong>${params.value}</strong> (${calcPercentage(params.value, total)}%)`;
            }
        },
        series: [
            {
                name: translationHashmap["Submitted Data"],
                type: "bar",
                data: [aggregatedCount["Submitted Data"]],
                coordinateSystem: "polar"
            },
            {
                name: translationHashmap["Clicked Link"],
                type: "bar",
                data: [aggregatedCount["Clicked Link"]],
                coordinateSystem: "polar"
            },
            {
                name: translationHashmap["Email Opened"],
                type: "bar",
                data: [aggregatedCount["Email Opened"]],
                coordinateSystem: "polar"
            },
            {
                name: translationHashmap["Email Sent"],
                type: "bar",
                data: [aggregatedCount["Email Sent"]],
                coordinateSystem: "polar"
            }
        ]
    };
});
</script>

<template>
    <BlankCard :show="option !== null">
        <template #dropdown-content>
            <p v-html="`Ce diagramme représente les résultats de la campagne du <b>CSV n°${props.id + 1}.</b>`" />
            <p>
                Chaque barre inclut cumulativement les utilisateurs des étapes suivantes : par exemple, les personnes
                ayant cliqué sur le lien incluent aussi celles ayant ensuite soumis leurs données.
            </p>
            <p>
                Ainsi, chaque étape regroupe tous les utilisateurs ayant atteint ce niveau ou au-delà dans la campagne.
            </p>
        </template>
        <template #chart>
            <v-chart v-if="option !== null" :option="option" />
        </template>
    </BlankCard>
</template>
