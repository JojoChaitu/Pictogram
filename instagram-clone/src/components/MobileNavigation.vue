<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const hideNavigation = ref(false);

watch(() => route.path, () => {
    console.log(route.path);
    if(route.path.includes("/chat")){
        hideNavigation.value = true;
    }
    else{
        hideNavigation.value = false;
    }
}, {
    immediate: true,
})

</script>

<template>
    <div :hidden="hideNavigation" class="fixed bottom-4 left-0 right-0 lg:hidden">
        <nav class="flex justify-center align-center">
            <ul class="menu menu-horizontal bg-base-200 rounded-badge shadow-md">
                <li>
                    <router-link to="/chat">
                        <span class="material-symbols-outlined text-slate-500 mx-2 text-4xl">message</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/search" class="text-2xl font-bold">
                        <span class="material-symbols-outlined text-slate-500 mx-2 text-4xl">search</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/profile">
                        <span class="material-symbols-outlined text-slate-500 mx-2 text-4xl">person</span>
                    </router-link>
                </li>
            </ul>
        </nav>
    </div>
</template>

<style scoped>

</style>