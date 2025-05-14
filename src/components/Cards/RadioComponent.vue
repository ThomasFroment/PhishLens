<script lang="ts" setup>
import { computed, getCurrentInstance, ref } from "vue";

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

const sliderStyle = computed(() => {
    return `left: ${(selected.value - 1) * 2.4}rem`;
});
</script>

<template>
    <div id="radios">
        <input
            v-for="i in amount"
            :id="`${uuid}-input-${i}`"
            :key="`input-${i}`"
            v-model="selected"
            :name="`${uuid}-radio`"
            :value="i"
            type="radio"
        />
        <label v-for="i in amount" :key="`label-${i}`" :for="`${uuid}-input-${i}`" class="flex-center">
            {{ i }}
        </label>
        <span :style="sliderStyle" class="slider" />
    </div>
</template>

<style scoped>
#radios {
    display: flex;
    position: relative;
    gap: 0.4rem;
}

input[type="radio"] {
    position: absolute;
    visibility: hidden;
}

label {
    cursor: pointer;
    box-shadow: var(--shadow);
    border-radius: 30%;
    width: 2rem;
    height: 2rem;
}

label:hover {
    box-shadow: var(--shadow-md);
}

.slider {
    position: absolute;

    transition: all 150ms var(--default-transition-timing-function);
    margin-top: 0.2rem;
    margin-left: 0.2rem;
    box-shadow:
        0 -1px 3px 0 rgb(0 0 0 / 0.1),
        0 -1px 2px -1px rgb(0 0 0 / 0.1);

    border-radius: 30%;
    background-color: rgba(0, 0, 0, 0.03);

    width: 1.6rem;
    height: 1.6rem;
}
</style>
