<template>
    <div class="flex items-center">
        <input :id="id" accept="text/csv" hidden type="file" @change="onFileChange" />
        <label
            :class="[
                'flex h-11 cursor-pointer items-center rounded-lg bg-gray-50 shadow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
                inputFile ? 'w-45 border-b-2 border-b-cyan-500 px-3' : 'size-11'
            ]"
            :for="id"
        >
            <span v-if="inputFile" class="overflow-hidden text-ellipsis whitespace-nowrap">{{ inputFile.name }}</span>
            <svg v-else class="m-auto size-7 fill-gray-600" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M728-326q0 103-72.18 174.5-72.17 71.5-175 71.5Q378-80 305.5-151.5T233-326v-380q0-72.5 51.5-123.25T408-880q72 0 123.5 50.75T583-706v360q0 42-30 72t-72.5 30q-42.5 0-72.5-29.67-30-29.68-30-72.33v-370h60v370q0 17 12.5 29.5t30.64 12.5q18.14 0 30-12.5T523-346v-360q0-48-33.5-81t-81.71-33q-48.21 0-81.5 33.06T293-706v380q0 78 54.97 132T481-140q77.92 0 132.46-54Q668-248 668-326v-390h60v390Z"
                />
            </svg>
        </label>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

defineProps({
    id: String
});

const inputFile = ref<File | null>(null);

defineExpose({
    inputFile
});

function onFileChange(event: Event) {
    const target = event.target as HTMLInputElement | null;
    if (!target?.files || !target.id) return;

    const file = target.files[0];
    if (!file) return;
    if (file.type !== "text/csv") return;

    inputFile.value = file || null;
}
</script>
