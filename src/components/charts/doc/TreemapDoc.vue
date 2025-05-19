<script lang="ts" setup>
defineProps<{
    id: number;
}>();
</script>

<template>
    <p v-html="`Ce diagramme représente les résultats de la campagne du <b>CSV n°${id + 1}.</b>`" />
    <p>
        Chaque zone de l'arborescence correspond à un service de l’organisation, puis est subdivisée selon les résultats
        de la campagne au sein des services.
    </p>
</template>
