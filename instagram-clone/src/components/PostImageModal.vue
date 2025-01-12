<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50">
        <div @click="closeModal" class="fixed inset-0 bg-black opacity-50"></div>
        <div class="bg-white flex flex-col min-w-min w-[80%] lg:max-w-[700px] max-h-min rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <slot name="body" :likes="postLikes"></slot>
            <button @click="closeModal" class="btn absolute top-6 right-6 btn-circle btn-outline">
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
        </div>
    </div>
</template>

<script setup>
import supabase from '@/supabase/supabaseClient';
import { defineProps, defineEmits, onMounted, ref } from 'vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    postData: {
        type: Object,
        required: true
    }
});

const postLikes = ref(0);
const emit = defineEmits(['close']);

const closeModal = () => {
    emit('close');
};

onMounted(async () => {
    console.log("data ", props)
    const { count, error } = await supabase
                                        .from('user_likes')
                                        .select('*', { count: 'exact' })
                                        .eq('post_id', props.postData.id);

    if(!error){
        postLikes.value = count;
    }    
})
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