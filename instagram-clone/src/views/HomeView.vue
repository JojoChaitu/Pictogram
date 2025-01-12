<script setup>
import { RouterView } from 'vue-router';
import HeaderComponent from '../components/HeaderComponent.vue';
import MobileNavigation from '../components/MobileNavigation.vue';
import DesktopAside from '@/components/DesktopAside.vue';
import ScrollTopButton from '@/components/ScrollTopButton.vue';

</script>

<template>
    <div class="bg-base-200 h-full min-w-[350px]">
        <div class="aside fixed hidden lg:block h-screen w-16">
            <DesktopAside />
        </div>
        <div class="main-content lg:ml-16">
            <HeaderComponent />
            <RouterView />
            <MobileNavigation />
            <ScrollTopButton class="hidden lg:block"/>
        </div>
    </div>
</template>

<style scoped>

</style>

