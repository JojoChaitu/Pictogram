<script setup>
//Fetch all the user profiles that matches the input 
// given by user and display them in the a list format.
import Avatar from './Avatar.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import supabase from '@/supabase/supabaseClient';

const { user: loggedInUser } = storeToRefs(useUserStore());

const fetchedUsers = ref([]);
const router = useRouter();

const searchQuery = ref('');
const loading = ref(false);

async function fetchMatchingUsers(){
    if(!searchQuery.value) return;
    loading.value = true;
    try {
        const { data: userList, error } = await supabase
                                        .from('users')
                                        .select('id, username, email, profile_picture')
                                        .ilike('username', `%${searchQuery.value}%`)
                                        .ilike('email', `%${searchQuery.value}%`);
        console.log("userList ", userList)
        fetchedUsers.value = [...userList];
    } catch (err) {
        console.log("error ", err)
    }
    finally{
        loading.value = false;
        searchQuery.value = '';
    }
}

function navigateToUserProfile(userId){
    if(loggedInUser.value.id === userId){
        router.push('/profile');
    }
    else
        router.push('/users/' + userId);
}

</script>

<template>
    <div class="search-container w-full mx-auto min-h-screen bg-white flex flex-col items-center justify-start pt-6">
        <section class="search-bar flex justify-center align-center w-full px-4">
            <form @submit.prevent="fetchMatchingUsers" class="join">
                <input v-model="searchQuery" class="input input-bordered join-item" placeholder="Search" />
                <button class="btn btn-primary join-item">Search</button>
            </form>
        </section>
        <div class="divider w-[90%] mx-auto"></div>
        <section v-if="!loading" class="list-of-users self-start px-12 w-full">
            <div v-for="user in fetchedUsers" class="user-card flex lg:flex-row items-center gap-4 bg-slate-100 p-2 rounded mb-2">
                <Avatar @click="navigateToUserProfile(user.id)" class-list="w-16 rounded cursor-pointer" :src="`https://bvwhoobsxfxhedbirdoa.supabase.co/storage/v1/object/public/instagram-clone/${user.profile_picture}`" />
                <div class="user-card-info">
                    <h3 class="user-card-name text-xl">{{ user.username }}</h3>
                    <p class="user-card-email text-sm text-slate-700">{{ user.email }}</p>
                </div>
            </div>
            <div class="text-[4rem] text-center text-slate-200" v-if="fetchedUsers.length <= 0">No results found!</div>
        </section>
        <div v-else class="loader mt-20">
            <span class="loading loading-bars loading-lg"></span>
        </div>
    </div>
</template>