<script setup lang="ts">
defineProps({
    title: {
        type: String,
        required: true
    }
})
</script>

<template>
    <div
        class="p-3 bg-white border-3 border-black rounded-md shadow-[inset_0px_-4px] shadow-gray-300 hover:shadow-none cursor-pointer hover:mt-1 hover:pb-2"
    >
        <h2 class="w-full font-verdana text-3xl">{{ title }}</h2>
    </div>
</template>
