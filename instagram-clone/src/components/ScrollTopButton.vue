<script setup>
import { onMounted, ref } from 'vue';

const scrolledThresholdLimit = ref(false);

onMounted(() => {
    document.addEventListener('scroll', function(){
        if(window.scrollY > 200){
            scrolledThresholdLimit.value = true;
        }
        else if(window.scrollY < 200){
            scrolledThresholdLimit.value = false;
        }
    })
})

function scrollToTop(){
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
    <div v-if="scrolledThresholdLimit" class="scroll-top-btn fixed bottom-10 right-10">
        <button @click="scrollToTop" class="btn btn-circle btn-outline">
            <span class="material-symbols-outlined mx-2 text-4xl">arrow_upward</span>
        </button>
    </div>
</template>

<style lang="scss" scoped>

</style>