<script lang="ts" setup>
defineProps<{
    id: number;
}>();
</script>

<template>
    <p v-html="`Ce diagramme représente les résultats de la campagne du <b>CSV n°${id + 1}.</b>`" />
    <p
        v-html="
            `<b>Données agrégées</b> : Un individu comptabilisé dans une étape est également inclus dans toutes les étapes précédentes.`
        "
    />
</template>
