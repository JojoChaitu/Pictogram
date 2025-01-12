<script setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import Avatar from './Avatar.vue';
import useDownloadImage from '@/composables/useDownloadImage';

const userStore = useUserStore();
const router = useRouter();
const { user } = storeToRefs(userStore);

const { fetchImage, image: profileImage } = useDownloadImage();

const dropdownOpen = ref(false);

function toggleDropdown() {
    dropdownOpen.value = !dropdownOpen.value;
}

onMounted(async () => {
    if(user.value){
        await fetchImage(user.value.profile_picture);
    }
});

async function handleSignOut() {
    await userStore.logout();
    dropdownOpen.value = false;
    if(!user.value)
        router.push('/welcome');
}

</script>

<template>
    <header class="header bg-white">
        <div class="logo">
            <router-link to="/">
                <span class="text-3xl text-slate-900 p-3">Pictogram</span>
            </router-link>
        </div>
        <div class="relative">
            <div tabindex="0" role="button" @click="toggleDropdown" class="focus:outline-none">
                <Avatar :title="user?.username" :src="profileImage" class-list="w-12 rounded-full" />
            </div>
            <ul tabindex="0" v-if="dropdownOpen" class="drop-down absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                <template v-if="user">
                    <li><router-link to="/profile" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</router-link></li>
                    <li  class="block px-4 py-2 text-gray-800 hover:bg-gray-100"><button @click.prevent="handleSignOut">Logout</button></li>
                </template>
                <template v-else>
                    <li><router-link to="/register" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Register</router-link></li>
                    <li><router-link to="/login" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Login</router-link></li>
                </template>
            </ul>
        </div>
    </header>
</template>

<style scoped>
.drop-down{
    transition: all 0.3s;
}
.logo {
  font-family: "Playfair Display", serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
}
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.profile-dropdown {
    position: relative;
}

.profile-dropdown button {
    background: none;
    border: none;
    cursor: pointer;
}
</style>