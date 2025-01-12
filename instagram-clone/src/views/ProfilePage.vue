<script setup>
import Avatar from '@/components/Avatar.vue';
import PostImage from '@/components/PostImage.vue';
import { useUserStore } from '@/stores/userStore';
import { usePostStore } from '@/stores/postStore';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref } from 'vue';
import useDownloadImage from '@/composables/useDownloadImage';
import ModalComponent from '@/components/ModalComponent.vue';
import PostImageModal from '@/components/PostImageModal.vue';
import useFetchPosts from '@/composables/useFetchPosts';
import { useRouter } from 'vue-router';
import supabase from '@/supabase/supabaseClient';

const { VITE_IMAGE_URL } = import.meta.env;

const { fetchPosts } = useFetchPosts('posts');
const { fetchImage, image: profileImage } = useDownloadImage();

const userStore = useUserStore();
const postStore = usePostStore();

const router = useRouter();

const { user } = storeToRefs(userStore);
const isOpen = ref(false);
const isPostModalOpen = ref(false);

const currentUserPosts = ref([]);

const postDetails = reactive({
    title: '',
    description: '',
    postImage: null
});
const createPostLoadingState = ref(false);

const followers = ref(0);
const following = ref(0);

const selectedPost = ref(null);

onMounted(async () => {
    try {
        const { count: followingCount } = await supabase.from('user_connections')
                                       .select('*', {count: 'exact'})
                                       .eq('followers', user.value.id);
        const { count: followersCount } = await supabase.from('user_connections')
                                       .select('*', {count: 'exact'})
                                       .eq('following', user.value.id);
        following.value = followingCount;
        followers.value = followersCount;
    } catch (error) {
        console.log(error)
    }
})
onMounted(async () => {
    try {
        const postsData = await fetchPosts(null, 0, 100);
        currentUserPosts.value = postsData.filter(post => post.author_id === user.value.id);
    } catch (error) {
        console.log(error)
    }
});
onMounted(async () => {
    if(user.value){
        await fetchImage(user.value.profile_picture);
    }
});

const triggerModal = () => {
    isOpen.value = !isOpen.value;
}  
const triggerPostModal = (post) => {
    selectedPost.value = post;
    isPostModalOpen.value = !isPostModalOpen.value;
}  
function handleImage($event){
    postDetails.postImage = $event.target.files[0];
}
async function createPost(){
    createPostLoadingState.value = true;
    const latestPost = await postStore.addPost(postDetails);
    postDetails.title = '',
    postDetails.description = '',
    postDetails.postImage = null
    currentUserPosts.value.unshift(latestPost);
    createPostLoadingState.value = false;
    triggerModal();
}
</script>


<template>
    <div class="profile-container w-full min-w-min min-h-fit p-10 flex flex-col items-center">
        <button @click="router.back()" class="back-btn self-start btn btn-outline">back</button @click="">
        <div class="profile-header w-full flex gap-5 flex-col items-center">
            <Avatar :title="user.username" :src="profileImage" class-list="w-36 rounded-full" />
            <div class="user-details flex flex-col items-center">
                <h1 class="text-3xl text-slate-900 royal-font">{{ user.username }}</h1>
                <p class="text-sm text-slate-500">{{ user.email }}</p>
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
                <button @click="triggerModal" class="btn btn-primary text-xl">
                    Add Post
                </button>
                <ModalComponent @close="triggerModal" :isOpen="isOpen">
                    <template #header>
                        Add Post
                    </template>
                    <template #body>
                            <label for="profile">
                                <input @change="handleImage" name="profile" type="file" class="file-input file-input-xs file-input-bordered w-full" />
                            </label>
                            <label class="input input-bordered flex items-center gap-2">
                                <input v-model="postDetails.title"  type="text" class="grow w-full" placeholder="Enter title" />
                            </label>
                            <textarea v-model="postDetails.description" class="textarea textarea-bordered w-full" placeholder="describe the post..."></textarea>
                    </template>
                    <template #actions>
                        <button @click="createPost" type="submit" class="btn btn-wide btn-neutral text-xl font-thin tracking-wide mb-5">
                            Create Post
                            <span v-if="createPostLoadingState" class="loading loading-spinner"></span>
                        </button>
                    </template>
                </ModalComponent>
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
            </section>
        </div>
        <div class="divider"></div>
        <div class="profile-body w-full">
            <div v-if="currentUserPosts.length > 0" class="profile-posts grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-1">
                <template v-for="post in currentUserPosts">
                    <PostImage @click="() => triggerPostModal(post)" :src="`https://bvwhoobsxfxhedbirdoa.supabase.co/storage/v1/object/public/instagram-clone/${post.image_url}`" />
                </template>
            </div>
            <div v-else class="text-4xl text-slate-500 text-center font-mono pb-20">
                No posts yet.
            </div>
        </div>
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