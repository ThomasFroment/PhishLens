<script lang="ts" setup>
import { computed } from "vue";
import { countByStatus } from "@/composables/chartCsv.ts";

import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import type { BarSeriesOption } from "echarts/charts";
import { BarChart } from "echarts/charts";
import type { LegendComponentOption, PolarComponentOption, TooltipComponentOption } from "echarts/components";
import { LegendComponent, PolarComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { aggregatePhishingStatus, sum } from "@/utils/chart.ts";

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
    const campaignCountByStatus = countByStatus.value[props.id];
    if (!campaignCountByStatus) return;

    const aggregatedCount = aggregatePhishingStatus(campaignCountByStatus);
    const total = sum(campaignCountByStatus);

    return {
        legend: {
            orient: "horizontal",
            width: "100%",
            bottom: 20,
            right: "center"
        },
        polar: {
            radius: [30, "80%"]
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
                const percentage = (params.value / total) * 100;
                // @ts-expect-error All those properties are not direct properties of params so ts get emotional
                return `${params.marker} ${params.seriesName}: <strong>${params.value}</strong> (${Math.round(percentage * 10) / 10}%)`;
            }
        },
        series: [
            {
                name: "Données soumises",
                type: "bar",
                data: [aggregatedCount["Submitted Data"]],
                coordinateSystem: "polar"
            },
            {
                name: "Lien cliqué",
                type: "bar",
                data: [aggregatedCount["Clicked Link"]],
                coordinateSystem: "polar"
            },
            {
                name: "Email ouvert",
                type: "bar",
                data: [aggregatedCount["Email Opened"]],
                coordinateSystem: "polar"
            },
            {
                name: "Email envoyé",
                type: "bar",
                data: [aggregatedCount["Email Sent"]],
                coordinateSystem: "polar"
            }
        ]
    };
});
</script>

<template>
    <div class="card">
        <VDropdown v-if="option" :theme="'chart-dropdown'" class="dropdown">
            <button class="flex-center">
                <svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                    />
                </svg>
            </button>
            <template #popper>
                <div class="dropdown-content">
                    <p
                        v-html="`Ce diagramme représente les résultats de la campagne du <b>CSV n°${props.id + 1}.</b>`"
                    />
                    <p>
                        Chaque barre inclut cumulativement les utilisateurs des étapes suivantes : par exemple, les
                        personnes ayant cliqué sur le lien incluent aussi celles ayant ensuite soumis leurs données.
                    </p>
                    <p>
                        Ainsi, chaque étape regroupe tous les utilisateurs ayant atteint ce niveau ou au-delà dans la
                        campagne.
                    </p>
                </div>
            </template>
        </VDropdown>
        <v-chart v-if="option" :option="option" class="chart" />
    </div>
</template>

<style scoped>
.dropdown {
    position: absolute;
    transform: translate(0.8rem, 0.8rem);
    width: fit-content;
    z-index: 1;
}

button {
    background-color: transparent;

    transition: all 150ms var(--default-transition-timing-function);
    border-radius: 100%;
    padding: 0.3rem;
    box-shadow: var(--shadow);
    border: var(--color-slate-200) solid 1px;
    cursor: pointer;
}

button svg {
    transition: all 150ms var(--default-transition-timing-function);
    fill: var(--color-slate-400);
    height: 1.7rem;
}

button:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-0.1rem);
}

button:hover svg {
    fill: var(--color-slate-500);
}

.dropdown-content {
    text-align: justify;
    width: 20rem;
}
</style>
