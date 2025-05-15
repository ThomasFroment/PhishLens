<script lang="ts" setup>
import { getCurrentInstance, inject, ref } from "vue";

const instance = getCurrentInstance();
if (!instance) throw new Error("instance is null");
const uuid = ref(instance.uid);

const chartAmount = inject<number>("chartAmount");
const selected = inject<number>("selectedChart");
</script>

<template>
    <div v-if="chartAmount && chartAmount > 1">
        <label
            v-for="i in chartAmount"
            :key="`label-${i}`"
            :class="['flex-center unselectable', { selected: selected === i }]"
        >
            <input :id="`${uuid}-input-${i}`" v-model="selected" :name="`${uuid}-radio`" :value="i" type="radio" />
            {{ i }}
        </label>
    </div>
</template>

<style scoped>
div {
    display: flex;
    gap: 0.5rem;
}

label {
    transition: all 150ms var(--default-transition-timing-function);
    cursor: pointer;
    box-shadow: var(--shadow);
    border-radius: 30%;
    background-color: var(--color-slate-50);
    width: 2rem;
    height: 2rem;
    color: var(--color-slate-700);
    font-weight: bold;
}

label input[type="radio"] {
    position: absolute;
    visibility: hidden;
}

label:hover:not(.selected) {
    transform: translateY(-0.1rem);
    box-shadow: var(--shadow-md);
}

label:hover.selected {
    cursor: default;
}

.selected {
    box-shadow:
        inset 0 1px 3px 0 rgb(0 0 0 / 0.1),
        inset 0 1px 2px -1px rgb(0 0 0 / 0.1);
    background-color: var(--color-slate-100);
}
</style>
