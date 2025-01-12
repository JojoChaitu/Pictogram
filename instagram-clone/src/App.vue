<script setup>
import { RouterView } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const isUserLoaded = ref(false);

onMounted(async () => {
  await userStore.getUser();
  isUserLoaded.value = true;
});
</script>

<template>
  <div class="container mx-auto w-full">
      <div v-if="!isUserLoaded" class="flex justify-center items-center h-screen">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
      <div v-else>
        <RouterView />
      </div>
  </div>
</template>

<style scoped>

</style>
