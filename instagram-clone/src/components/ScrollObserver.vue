<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(['scrollToBottom']);
const sentinel = ref(null);

const observer = ref(null);

function handleScrollToBottom(entries){
    const entry = entries[0];
    if(entry.isIntersecting){
        emit('scrollToBottom');
    }
}

onMounted(() => {
    observer.value = new IntersectionObserver(handleScrollToBottom, {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
    });

    if(sentinel.value){
        observer.value.observe(sentinel.value);
    }
})

onUnmounted(() => {
    if(sentinel.value){
        observer.value.unobserve(sentinel.value);
    }
})

</script>

<template>
    <div class="sentinel" ref="sentinel"></div>
</template>

<style scoped>
    .sentinel {
        height: 1px;
    }
</style>