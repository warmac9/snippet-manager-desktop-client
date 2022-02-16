<script setup lang="ts">
import Searchbar from './SearchBar.vue'
import Button from './Button.vue'

defineEmits(['searchUpdate'])
</script>

<template>
    <nav class="flex justify-between items-end space-x-4">
        <Searchbar 
            @searchUpdate="(searchQuery) => $emit('searchUpdate', searchQuery)"
        ></Searchbar>
        <Button title="Modify"></Button>
        <Button title="Help"></Button>
    </nav>
</template>
