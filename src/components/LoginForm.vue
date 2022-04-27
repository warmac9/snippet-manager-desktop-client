<script setup lang="ts">
import Button from './Button.vue'
import { inject, ref, onMounted } from 'vue'

defineEmits(['validateLoginCreds'])

defineProps({
    email: {
        type: String,
        default: ''
    }
})

const password = ref()

</script>

<template>
    <div
        class="flex flex-col items-start grow p-6 space-y-5 bg-neutral-100 rounded-2xl"
    >
            <input
                v-model="email"
                class="w-full p-3 font-verdana text-3xl border-3 border-black rounded-md shadow-[inset_0px_-4px] shadow-gray-300 outline-none selection:bg-black selection:text-white"
                maxlength="30"
                placeholder="Email"
            />
            <input
                v-model="password"
                class="w-full p-3 font-verdana text-3xl border-3 border-black rounded-md shadow-[inset_0px_-4px] shadow-gray-300 outline-none selection:bg-black selection:text-white"
                maxlength="30"
                placeholder="Password"
                type="password"
            />
            <Button
                title="Sign in"
                @click="$emit('validateLoginCreds', email, password)"
            ></Button>

    </div>
</template>