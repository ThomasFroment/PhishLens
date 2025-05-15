<script lang="ts" setup>
import { inject, type Ref, watch } from "vue";

const { option } = defineProps<{
    option: unknown;
}>();

const isVisible = inject<Ref<boolean>>("isVisible");
watch(
    () => option,
    () => {
        if (!isVisible) return;
        isVisible.value = option != null;
    }
);
</script>

<template>
    <v-chart v-if="isVisible" :option="option" />
</template>
