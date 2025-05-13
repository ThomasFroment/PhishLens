<script lang="ts" setup>
import { computed } from "vue";
import BlankChart from "@/components/Cards/BlankChart.vue";
import { countByStatusByPosition } from "@/composables/usePhishingMetrics.ts";
import { calcPercentage, sum } from "@/utils/utils.ts";
import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import type { TreemapSeriesOption } from "echarts/charts";
import { TreemapChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

const props = defineProps({
    id: {
        type: Number,
        required: true
    }
});

use([TreemapChart, CanvasRenderer]);

type EChartsOption = ComposeOption<TreemapSeriesOption>;

const translationHashmap = {
    "Email Sent": "Email reçu",
    "Email Opened": "Email ouvert",
    "Clicked Link": "Lien cliqué",
    "Submitted Data": "Données soumises"
} as Record<string, string>;

const option = computed<EChartsOption | null>(() => {
    const campaignCountByStatusByPosition = countByStatusByPosition.value[props.id];
    if (!campaignCountByStatusByPosition) return null;

    const data = Object.entries(campaignCountByStatusByPosition).map(([key, val]) => {
        return {
            name: key || "Others",
            value: sum(val),
            children: Object.entries(val).map(([key, val]) => {
                return {
                    name: translationHashmap[key] || key,
                    value: val
                };
            })
        };
    });

    return {
        textStyle: {
            fontFamily: "Inter"
        },
        tooltip: {
            show: true,
            formatter: function (params) {
                return `${params.name}: ${params.value}`;
            }
        },
        series: [
            {
                name: `CSV ${props.id + 1}`,
                colorMappingBy: "value",
                visibleMin: 300,
                colorSaturation: [0.4, 0.5],
                upperLabel: {
                    show: true,
                    height: 20
                },
                type: "treemap",
                levels: [
                    {
                        upperLabel: {
                            show: false
                        },
                        itemStyle: {
                            borderWidth: 0,
                            gapWidth: 3
                        }
                    },
                    {
                        itemStyle: {
                            borderColor: "#f8fafc"
                        }
                    }
                ],
                data
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
    </BlankChart>
</template>
