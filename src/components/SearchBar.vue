<script setup lang="ts">
import { inject, ref, onMounted } from 'vue'

defineEmits(['searchUpdate'])
const writeClipboard = inject('writeClipboard')

const searchQuery = ref('')
const input = ref(null)

const focusInput = () => {
    document.activeElement.blur()
    input.value.focus()
}

onMounted(() => {
    focusInput()
})

</script>

<template>
    <div
        class="flex items-end grow p-2 bg-white border-3 border-black rounded-md shadow-[inset_0px_-4px] shadow-gray-300"
    >
        <div class="grow pt-2">
            <input
                v-model="searchQuery"
                @input="$emit('searchUpdate', searchQuery)"
                @keydown="focusInput"
                @focusout="focusInput"
                @keyup.enter="writeClipboard.articleByIndex(0)"
                ref="input"
                class="w-full font-verdana text-3xl outline-none selection:bg-black selection:text-white"
                maxlength="30"
                placeholder="search"
            />
        </div>
        <figure class="shrink-0 w-7 m-1 mr-2 ml-5">
            <img src="../assets/search-icon.png" />
        </figure>
    </div>
</template>