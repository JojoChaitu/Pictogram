<script setup>
import Avatar from '../Avatar.vue';
import supabase from '@/supabase/supabaseClient';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const { VITE_IMAGE_URL } = import.meta.env;

const { user } = storeToRefs(useUserStore());

const router = useRouter();
const users = ref([]);

const fetchFollowers = async (userId) => {
  const { data, error } = await supabase
    .from('user_connections')
    .select('followers, following')
    .or(`followers.eq.${userId},following.eq.${userId}`);

    const relatedUserIds = data.map((item) => {
        if(item.followers == userId){
            return item.following;
        }else{
            return item.followers;
        }
    })

    const { data: relatedUsers, error: fetchError } = await supabase
        .from('users')
        .select()
        .in('id', relatedUserIds);

  if (!error || !fetchError) {
    return relatedUsers;
  }
};


onMounted(async () => {
    const userData = await fetchFollowers(user.value.id);
    users.value = userData;
})

function openChat(chatId){
    router.push('/chat/' + chatId)
}

</script>

<template>
    <div class="chat-users-container min-w-min overflow-hidden">
        <div class="users-strip w-screen p-4 pr-20 max-h-min flex bg-slate-200 justify-start gap-6 overflow-auto">
                <template v-for="user in users" :key="user.id">
                    <div class="flex flex-col justify-center items-center gap-1">
                        <button @click="openChat(user.id)">
                            <Avatar :src="`${VITE_IMAGE_URL}/${user.profile_picture}`" class-list="ring-primary ring-offset-base-100 w-12 rounded-full ring ring-offset-2"/>
                        </button>
                        <div class="badge badge-secondary text-[10px] font-bold">{{ user.username }}</div>
                    </div>
                </template>
        </div>
    </div>
</template>


<style scoped>

</style>