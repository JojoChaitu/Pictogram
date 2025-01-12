<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50">
        <div @click="closeModal" class="fixed inset-0 bg-black opacity-50"></div>
        <div class="bg-white flex flex-col p-6 min-w-min rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <button @click="closeModal" class="btn self-end btn-circle btn-outline">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div class="px-4 py-5 sm:p-6 lg:w-full flex flex-col items-center gap-4">
                    <h3 class="leading-6 font-medium mb-4 text-gray-900 custom-font">
                        <slot name="header"></slot>
                    </h3>
                <div class="flex flex-col gap-4 w-full lg:w-full">
                    <slot name="body"></slot>
                </div>
                <div class="sm:flex sm:flex-row-reverse lg:w-full">
                    <slot name="actions"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['close']);

const closeModal = () => {
    emit('close');
};
</script>

<style scoped>
.custom-font {
    font-family: "Playfair Display", serif;
    font-optical-sizing: auto;
    font-weight: 700;
    font-style: normal;
    font-size: xx-large;
}
</style>