<script lang="ts" setup>
defineProps<{
    id: number;
}>();
</script>

<template>
    <p v-html="`Ce diagramme représente les résultats de la campagne du <b>CSV n°${id + 1}.</b>`" />
    <p>
        Chaque portion du camembert correspond à la dernière étape atteinte par les utilisateurs : par exemple, les
        personnes ayant soumis leurs données ne sont comptées que dans cette catégorie, et non dans les étapes
        précédentes.
    </p>
    <p>
        Ainsi, les données ne sont pas additives — elles permettent d’identifier précisément où les utilisateurs se sont
        arrêtés lors de la campagne.
    </p>
</template>
