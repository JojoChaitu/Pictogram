<template>
    <div v-if="src" class="avatar">
        <div :class="[classList]">
            <img :src="src"/>
        </div>
    </div>
    <div v-else class="avatar placeholder">
        <div class="bg-neutral text-neutral-content" :class="[classList]">
            <span class="text-3xl">{{ title[0].toUpperCase() }}</span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    classList: {
        type: String,
        default: ''
    },
    src: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: 'x'
    }
})
</script>

<style lang="scss" scoped>

</style>