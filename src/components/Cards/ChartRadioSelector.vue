<script lang="ts" setup>
import { getCurrentInstance, ref } from "vue";

defineProps({
    amount: {
        type: Number,
        required: true
    }
});

const instance = getCurrentInstance();
if (!instance) throw new Error("getCurrentInstance() is null");
const uuid = ref(instance.uid);

const selected = ref(1);

defineExpose(selected);
</script>

<template>
    <div>
        <label v-for="i in amount" :key="`label-${i}`" :class="['flex-center', { selected: selected === i }]">
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
