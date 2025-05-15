<script lang="ts" setup>
import { computed, inject, type Ref, watch } from "vue";
import { countByStatusByPosition } from "@/composables/usePhishingMetrics.ts";
import { calcPercentage, sumValues } from "@/utils/utils.ts";
import { translationHashmap } from "@/utils/translation.ts";

import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import type { TreemapSeriesOption } from "echarts/charts";
import { TreemapChart } from "echarts/charts";
import type { TooltipComponentOption } from "echarts/components";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

const { id } = defineProps<{
    id: number;
}>();

use([TooltipComponent, TreemapChart, CanvasRenderer]);
type EChartsOption = ComposeOption<TooltipComponentOption | TreemapSeriesOption>;

const option = computed<EChartsOption | null>(() => {
    const campaignCountByStatusByPosition = countByStatusByPosition.value[id];
    if (!campaignCountByStatusByPosition) return null;

    const data = Object.entries(campaignCountByStatusByPosition).map(([key, val]) => {
        return {
            name: key || "Others",
            value: sumValues(val),
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: function (params: any) {
                switch (params.treeAncestors.length) {
                    case 2:
                        return `<strong>CSV n°${id + 1}</strong> <br/> ${params.marker} ${params.name} <br/> <strong>${params.value}</strong> Individus`;
                    case 3:
                        return `<strong>CSV n°${id + 1}</strong> <br/>
                                ${params.marker} ${params.treeAncestors[1].name} <br/>
                                ${params.name}: <strong>${params.value}</strong>
                                (${calcPercentage(params.value, params.treeAncestors[1].value)}%)
                                (${calcPercentage(params.value, params.treeAncestors[0].value)}<strong>g</strong>%)
                        `;
                    default:
                        return ``;
                }
            }
        },
        series: [
            {
                name: `CSV ${id + 1}`,
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

const isVisible = inject<Ref<boolean>>("isVisible");
watch(option, () => {
    if (!isVisible) return;
    if (option.value === null) {
        isVisible.value = false;
        return;
    }
    isVisible.value = true;
});
</script>

<template>
    <v-chart v-if="isVisible" :option="option" />
</template>
