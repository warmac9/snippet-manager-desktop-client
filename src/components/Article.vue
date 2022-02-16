<script setup lang="ts">
import { computed, inject } from 'vue'

const writeClipboard = inject('writeClipboard')

const props = defineProps({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

const preview = computed<string>(() => {
    return props.content
        .split('\n')
        .filter(val => val != '')
        .concat(Array(3))
        .slice(0, 3)
        .join('<br>')
})
</script>

<template>
    <article
        @click="writeClipboard.articleById(id)"
        class="grow p-3 bg-white border-3 border-black rounded-2xl shadow-lg hover:translate-y-1 cursor-pointer"
    >
        <div class="flex justify-between">
            <div class="w-[5px] h-[5px] bg-black rounded-full"></div>
            <div class="w-[5px] h-[5px] bg-black rounded-full"></div>
        </div>
        <section class="p-1">
            <header class="py-2">
                <h3 class="font-verdana text-3xl">{{ title }}</h3>
            </header>
            <section
                class="p-3 bg-gray-100 rounded-xl shadow-[inset_0px_4px] shadow-gray-200 overflow-hidden"
            >
                <p
                    v-html="preview"
                    class="w-1 font-verdana text-lg leading-6 whitespace-nowrap"
                ></p>
            </section>
        </section>
    </article>
</template>