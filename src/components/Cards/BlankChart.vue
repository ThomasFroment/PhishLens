<script lang="ts" setup>
defineProps({
    show: {
        type: Boolean,
        required: true
    }
});
</script>

<template>
    <div class="card">
        <VDropdown v-if="show" :theme="'chart-dropdown'" class="dropdown">
            <button class="flex-center">
                <svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                    />
                </svg>
            </button>
            <template #popper>
                <div class="dropdown-content">
                    <slot name="dropdown-content" />
                </div>
            </template>
        </VDropdown>
        <slot name="chart" />
    </div>
</template>

<style scoped>
.dropdown {
    position: absolute;
    width: fit-content;
    z-index: 1;
}

button {
    background-color: var(--color-slate-50);

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
    height: 1.5rem;
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
