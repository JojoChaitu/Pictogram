<script setup>
import Avatar from '@/components/Avatar.vue';
import PostImage from '@/components/PostImage.vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import useDownloadImage from '@/composables/useDownloadImage';
import { useRouter, useRoute } from 'vue-router';
import supabase from '@/supabase/supabaseClient';
import PostImageModal from '@/components/PostImageModal.vue';

const { VITE_IMAGE_URL } = import.meta.env

const { fetchImage, image: profileImage } = useDownloadImage();

const userStore = useUserStore();
const { user: loggedInUser } = storeToRefs(userStore);

const router = useRouter();
const route = useRoute();

const isFollowing = ref({
    status: false,
    loading: false
});


const currentUser = ref(null);
const currentUserPosts = ref([]);

const followers = ref(0);
const following = ref(0);

onMounted(async () => {
    try {
        const { count: followingCount } = await supabase.from('user_connections')
                                       .select('*', {count: 'exact'})
                                       .eq('followers', route.params.userId)
        const { count: followersCount } = await supabase.from('user_connections')
                                       .select('*', {count: 'exact'})
                                       .eq('following', route.params.userId)
        following.value = followingCount;
        followers.value = followersCount;
    } catch (error) {
        console.log(error)
    }
})

onMounted(async () => {
    try {
        //fetch current user whose profile is being used
        const { data: user, error: userError } = await supabase
                                                        .from('users')
                                                        .select()
                                                        .eq('id', route.params.userId)
                                                        .single();
        if(userError) throw userError;
        //fetch his profile picture
        await fetchImage(user.profile_picture);
        currentUser.value = {...user};
        //fetch his follow-following status
        const { data, error } = await supabase.from('user_connections')
                                              .select()
                                              .eq('followers', loggedInUser.value.id)
                                              .eq('following', currentUser.value.id)
                                              .single();
        if(error) throw error;
        // console.log("follwes data ",data);
        if(data){
            isFollowing.value.status = true;
        }
    } catch (err) {
        console.log(err);
    }
})
onMounted(async () => {
    try {
        const { data, error } = await supabase.from('posts').select().eq('author_id', route.params.userId);
        if(error) throw error;
        currentUserPosts.value = data;
        // console.log("user Posts from acccount ", currentUserPosts.value)
    } catch (err) {
        console.log(err);
    }
})

async function followAccount(){
    isFollowing.value.loading = true;
    try {
        if(!isFollowing.value.status){
                const { error } = await supabase.from('user_connections').upsert({
                followers: loggedInUser.value.id,
                following: currentUser.value.id
            });
            if(error) throw error;
            followers.value++;
        }
        else {
            const { error } = await supabase.from('user_connections')
                                            .delete()
                                            .eq('followers', loggedInUser.value.id)
                                            .eq('following', currentUser.value.id);
             
            if(error) throw error;
            followers.value--;
        }
    } catch (err) {
        console.log(err)
    }
    finally{
        isFollowing.value.status = !isFollowing.value.status;
        isFollowing.value.loading = false;
    }
}

const isPostModalOpen = ref(false);
const selectedPost = ref(null);

const triggerPostModal = (post) => {
    selectedPost.value = post;
    isPostModalOpen.value = !isPostModalOpen.value;
}  

</script>


<template>
    <div v-if="currentUser" class="profile-container w-full min-w-min min-h-fit p-10 flex flex-col items-center">
        <button @click="router.back()" class="back-btn self-start btn btn-outline">back</button @click="">
        <div class="profile-header w-full flex gap-5 flex-col items-center">
            <Avatar :title="currentUser.username" :src="profileImage" class-list="w-36 rounded-full" />
            <div class="user-details flex flex-col items-center">
                <h1 class="text-3xl text-slate-900 royal-font">{{ currentUser.username }}</h1>
                <p class="text-sm text-slate-500">{{ currentUser.email }}</p>
            </div>
            <section class="follower-data flex flex-col gap-3 justify-between">
                <div class="stats shadow">
                    <div class="stat text-center">
                        <div class="stat-title">posts</div>
                        <div class="stat-value font-medium">{{ currentUserPosts.length }}</div>
                    </div>
                    <div class="stat text-center">
                        <div class="stat-title">followers</div>
                        <div class="stat-value font-medium">{{ followers }}</div>
                    </div>
                    <div class="stat text-center">
                        <div class="stat-title">following</div>
                        <div class="stat-value font-medium">{{ following }}</div>
                    </div>
                </div>
                <button @click="followAccount" class="btn btn-primary text-xl">
                    {{ isFollowing.status ? 'Following' : 'Follow' }}
                    <span v-if="isFollowing.loading" class="loading loading-spinner"></span>
                </button>
            </section>
        </div>
        <div class="divider"></div>
        <div class="profile-body w-full">
            <div class="profile-posts grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-1">
                <template v-for="post in currentUserPosts">
                    <PostImage @click="triggerPostModal(post)" :src="`https://bvwhoobsxfxhedbirdoa.supabase.co/storage/v1/object/public/instagram-clone/${post.image_url}`" />
                </template>
            </div>
            <div>

            </div>
            <PostImageModal v-if="selectedPost" @close="triggerPostModal" :isOpen="isPostModalOpen" :postData="selectedPost">
                    <template #body="{ likes }">
                        <div class="post-modal flex flex-col md:flex-row w-full h-full">
                            <section class="image-col lg:w-2/3 h-[300px] lg:h-[500px] ">
                                <img class="w-full h-full object-cover" :src="`${VITE_IMAGE_URL}/${selectedPost.image_url}`" alt="Post Image" />
                            </section>
                            <section class="data-col lg:pt-20 p-6 lg:w-1/3">
                                <h2 class="text-3xl font-mono font-semibold mb-4">{{ selectedPost.title }}</h2>
                                <p class="text-gray-900">{{ selectedPost.description }}</p>
                                <p>❤️ {{ likes }}</p>
                            </section>
                        </div>
                    </template>
            </PostImageModal>
        </div>
    </div>
    <div class="h-screen flex justify-center items-center" v-else>
        <span class="loading loading-bars loading-lg"></span>
    </div>
</template>

<style scoped>
.royal-font{
  font-family: "Playfair Display", serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
}

</style>