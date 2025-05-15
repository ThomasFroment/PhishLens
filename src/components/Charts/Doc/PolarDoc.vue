<script lang="ts" setup>
defineProps<{
    id: number;
}>();
</script>

<template>
    <p v-html="`Ce diagramme représente les résultats de la campagne du <b>CSV n°${id + 1}.</b>`" />
    <p>
        Chaque barre inclut cumulativement les utilisateurs des étapes suivantes : par exemple, les personnes ayant
        cliqué sur le lien incluent aussi celles ayant ensuite soumis leurs données.
    </p>
    <p>Ainsi, chaque étape regroupe tous les utilisateurs ayant atteint ce niveau ou au-delà dans la campagne.</p>
</template>
