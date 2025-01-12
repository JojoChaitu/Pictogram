<script setup>
import { ref, computed, onMounted } from 'vue';
import Avatar from './Avatar.vue';
import supabase from '@/supabase/supabaseClient';
import { formatDistance } from "date-fns";
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const { VITE_IMAGE_URL } = import.meta.env;

const { title, description, postId, postImage, user, createdAt, isLoading } = defineProps({
    title: String,
    description: String,
    postImage: String,
    authorId: Number,
    createdAt: String,
    postId: Number,
    user: Object,
    isLoading: Boolean
})

const formattedTimeOfPostAdded = computed(() => {
    return formatDistance(createdAt, Date.now(), { addSuffix: true });
})

const router = useRouter();

const userStore = useUserStore();

const { user: loggedInUser } = storeToRefs(userStore);

const likedCurrentPost = ref(false);

const noOfLikes = ref(0);

onMounted(async () => {
    try {
        const { count, error } = await supabase
                                        .from('user_likes')
                                        .select('*', { count: 'exact' })
                                        .eq('post_id', postId);

        if(error) throw error;
        noOfLikes.value = count;
        const { data: currentUserLikes } = await supabase
                                        .from('user_likes')
                                        .select('post_id')
                                        .eq('user_id', loggedInUser.value.id);
        
        likedCurrentPost.value = currentUserLikes.some(post => post.post_id === postId);
    } catch (error) {
        console.log(error)
    }
})

async function toggleLike(){
    try {
        if(!likedCurrentPost.value){
            likedCurrentPost.value = !likedCurrentPost.value;
            noOfLikes.value++;
            const { error } = await supabase
                                        .from('user_likes')
                                        .upsert({
                                            post_id: postId,
                                            user_id: loggedInUser.value.id
                                         });
            if(error) throw error;
        }
        else {
            likedCurrentPost.value = !likedCurrentPost.value;
            noOfLikes.value--;
            const { error } = await supabase
                                        .from('user_likes')
                                        .delete()
                                        .eq('user_id', loggedInUser.value.id)
                                        .eq('post_id', postId);
            if(error) throw error;
        }
    } catch (err) {
        console.log(err);
    }
}
function navigateToUserProfile(){
    if(loggedInUser.value.id === user.id){
        router.push('/profile');
    }
    else
        router.push('/users/' + user.id);
}

</script>

<template>
    <div class="card-normal bg-base-100 w-full shadow-sm border-b-[1px] border-slate-300">
        <div class="flex gap-2 justify-start items-center p-2 border-b-[1px] border-slate-300">
            <Avatar @click="navigateToUserProfile" :src="`${VITE_IMAGE_URL}/${user.profile_picture}`" class-list="w-12 rounded-full cursor-pointer" />
            <div class="h-12 flex flex-col justify-start items-start">
                <span @click="navigateToUserProfile" class="open-sans text-lg text-slate-700 cursor-pointer">{{ user.username }}</span>
                <p class="text-[.7rem] text-slate-400">{{ formattedTimeOfPostAdded }}</p>
            </div>
        </div>
        <section class="w-full min-w-min">
            <img class="object-cover w-full h-full"
            :src="`${VITE_IMAGE_URL}/${postImage}`"
            alt="Picture" />
        </section>
        <div class="card-body flex flex-row justify-between items-center">
            <section>
                <h2 class="card-title">{{ title }}</h2>
                <p>{{ description }}</p>
            </section> 
            <section class="relative flex justify-center align-middle mr-3">
                <button @click="toggleLike" class="material-symbols-outlined text-4xl" :class="{'text-red-600': likedCurrentPost}">favorite</button>
                <span v-if="noOfLikes > 0" class="absolute left-6 badge badge-primary font-bold">{{ noOfLikes }}</span>
            </section>
        </div>
    </div>
</template>



<style scoped>
.like-btn{
    color: red;
}
.open-sans {
  font-family: "Open Sans", serif;
  font-optical-sizing: auto;
  font-weight:400;
  font-style: normal;
  font-variation-settings:
    "wdth" 100;
}
</style>