<script lang="ts" setup>
defineProps<{
    id: number;
}>();
</script>

<template>
    <p v-html="`Ce diagramme représente les résultats de la campagne du <b>CSV n°${id + 1}.</b>`" />
    <p
        v-html="
            `<b>Données exclusives</b> : Chaque individu est comptabilisé uniquement dans la dernière étape atteinte.`
        "
    />
    <p>
        Chaque zone de l'arborescence correspond à un service de l’organisation, lui même subdivisé selon les étapes
        atteintes par les individus de ce service.
    </p>
</template>
