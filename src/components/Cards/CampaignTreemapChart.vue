<script lang="ts" setup>
import { computed } from "vue";
import BlankChart from "@/components/Cards/BlankChart.vue";
import { countByStatusByPosition } from "@/composables/usePhishingMetrics.ts";
import { calcPercentage, sum } from "@/utils/utils.ts";
import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import type { TreemapSeriesOption } from "echarts/charts";
import { TreemapChart } from "echarts/charts";
import type { TooltipComponentOption } from "echarts/components";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

const props = defineProps({
    id: {
        type: Number,
        required: true
    }
});

use([TooltipComponent, TreemapChart, CanvasRenderer]);

type EChartsOption = ComposeOption<TooltipComponentOption | TreemapSeriesOption>;

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
            formatter: function (params: {
                treeAncestors: { name: string; value: number }[];
                marker: string;
                name: string;
                value: number;
            }) {
                switch (params.treeAncestors.length) {
                    case 2:
                        return `<strong>CSV n°${props.id + 1}</strong> <br/> ${params.marker} ${params.name} <br/> <strong>${params.value}</strong> Individus`;
                    case 3:
                        return `<strong>CSV n°${props.id + 1}</strong> <br/>
                                ${params.marker} ${params.treeAncestors[1].name} <br/>
                                ${params.name}: <strong>${params.value}</strong>
                                (${calcPercentage(params.value, params.treeAncestors[1].value)}%)
                                (${calcPercentage(params.value, params.treeAncestors[0].value)}<strong>g</strong>%)
                        `;
                }
            }
        },
        series: [
            {
                name: `CSV ${props.id + 1}`,
                colorMappingBy: "value",
                visibleMin: 300,
                roam: false,
                width: "100%",
                height: "80%",
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
                Chaque zone du treemap correspond à un service de l’organisation, puis est subdivisée selon les
                résultats de la campagne au sein du service.
            </p>
        </template>
        <template #chart>
            <v-chart v-if="option !== null" :option="option" />
        </template>
    </BlankChart>
</template>
