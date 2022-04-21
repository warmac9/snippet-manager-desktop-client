<script setup lang="ts">
import Button from './Button.vue'
import { inject, ref, onMounted } from 'vue'

defineEmits(['validateCreds'])

const email = ref('koko123@gmail.com')
const password = ref('Koko123!')

</script>

<template>
    <div
        class="flex items-end grow p-2 bg-white border-3 border-black rounded-md shadow-[inset_0px_-4px] shadow-gray-300"
    >
        <div class="grow pt-2">
            <input
                v-model="email"
                class="w-full font-verdana text-3xl outline-none selection:bg-black selection:text-white"
                maxlength="30"
                placeholder="Email"
            />
            <input
                v-model="password"
                class="w-full font-verdana text-3xl outline-none selection:bg-black selection:text-white"
                maxlength="30"
                placeholder="Password"
                type="password"
            />
            <Button
                @click="$emit('validateCreds', email, password)"
            ></Button>
        </div>
    </div>
</template>