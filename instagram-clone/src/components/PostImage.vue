<script setup>

const { src } = defineProps({
    src: String,
    classList: String
});

</script>

<template>
    <div class="rounded-md car card-compact bg-base-100 h-40 sm:h-60 cursor-pointer">
        <img class="img-post-item rounded-md w-full h-full overflow-clip"
            :src="src"
            alt="Shoes" />    
    </div>
</template>


<style scoped>
.img-post-item {
    object-fit: cover;
    object-position: center;
}
</style>