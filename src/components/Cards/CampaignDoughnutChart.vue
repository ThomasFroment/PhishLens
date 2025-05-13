<script lang="ts" setup>
import { computed } from "vue";
import { countByStatus } from "@/composables/usePhishingMetrics.ts";
import BlankChart from "@/components/Cards/BlankChart.vue";

import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import type { PieSeriesOption } from "echarts/charts";
import { PieChart } from "echarts/charts";
import type { LegendComponentOption, TooltipComponentOption } from "echarts/components";
import { LegendComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { sum } from "@/utils/dataOps.ts";

const props = defineProps({
    id: {
        type: Number,
        required: true
    }
});

use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

type EChartsOption = ComposeOption<TooltipComponentOption | LegendComponentOption | PieSeriesOption>;

const option = computed<EChartsOption | null>(() => {
    const campaignCountByStatus = countByStatus.value[props.id];
    if (!campaignCountByStatus) return null;

    const total = sum(campaignCountByStatus);
    return {
        textStyle: {
            fontFamily: "Inter"
        },
        tooltip: {
            trigger: "item",
            formatter: function (params) {
                // @ts-expect-error All those properties are not direct properties of params so ts get emotional
                const percentage = (params.value / total) * 100;
                // @ts-expect-error All those properties are not direct properties of params so ts get emotional
                return `<strong>CSV n°${props.id + 1}</strong> <br/> ${params.marker} ${params.name}: <strong>${params.value}</strong> (${Math.round(percentage * 10) / 10}%)`;
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
                    { value: campaignCountByStatus["Submitted Data"], name: "Données soumises" },
                    { value: campaignCountByStatus["Clicked Link"], name: "Lien cliqué" },
                    { value: campaignCountByStatus["Email Opened"], name: "Email ouvert" },
                    { value: campaignCountByStatus["Email Sent"], name: "Email reçu" }
                ]
            }
        ]
    };
});
</script>

<template>
    <BlankChart :show="option !== null">
        <template #dropdown-content>
            <p v-html="`Ce diagramme représente les résultats de la campagne du <b>CSV n°${props.id + 1}.</b>`" />
            <p>
                Chaque portion du camembert correspond à la dernière étape atteinte par les utilisateurs : par exemple,
                les personnes ayant soumis leurs données ne sont comptées que dans cette catégorie, et non dans les
                étapes précédentes.
            </p>
            <p>
                Ainsi, les données ne sont pas additives — elles permettent d’identifier précisément où les utilisateurs
                se sont arrêtés dans le parcours de la campagne.
            </p>
        </template>
        <template #chart>
            <v-chart v-if="option !== null" :option="option" />
        </template>
    </BlankChart>
</template>
