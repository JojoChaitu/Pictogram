<script setup>
import PostItem from './PostItem.vue';
import ScrollObserver from './ScrollObserver.vue';

import useFetchPosts from '@/composables/useFetchPosts';
import { debounce } from '@/utils';
import { onMounted, ref } from 'vue';

const { posts, isLoading, fetchPosts } = useFetchPosts('posts');

const allPosts = ref([]);
const loadingPosts = ref(false);

const pageSize = 5;
const currentPage = ref(0);

const allPostsFetched = ref(false);

const query = ` 
      *,
      users (
        username,
        email,
        profile_picture,
        id
      )`

onMounted(async () => {
    await fetchPosts(query, 0, pageSize-1);
    allPosts.value = posts.value;
    currentPage.value++;
})

async function fetchPostsOnScroll(){
    // if all posts are fetched or already loading posts, return
    if(allPostsFetched.value || loadingPosts.value) return;
    loadingPosts.value = true;

    console.log('fetching posts on scroll');
    const startIdx = currentPage.value * pageSize;
    const endIdx = startIdx + pageSize - 1;
    const data = await fetchPosts(query, startIdx, endIdx);
    loadingPosts.value = false;
    allPosts.value.push(...data);
    currentPage.value++;

    if(data.length <= 0)
        allPostsFetched.value = true;
}

const debouncedFetchPostsOnScroll = debounce(fetchPostsOnScroll, 200);

</script>

<template>
    <div class="bg-slate-100 md:w-1/3 md:mx-auto flex flex-col justify-center place-items-center">
        <template v-if="!isLoading">
            <template v-for="post in allPosts" :key="post.id">
                <PostItem
                    :title="post.title"
                    :description="post.description"
                    :postImage="post.image_url"
                    :authorId="post.author_id"
                    :user="post.users"
                    :createdAt="post.created_at"
                    :postId="post.id"
                    :isLoading="isLoading"
                />
            </template>
        </template>
        <div v-else class="h-screen flex flex-col justify-center items-center">
            <div class="loading loading-bars loading-lg"></div>
        </div>
        <div v-if="loadingPosts" class="loading loading-spinner loading-lg"></div>
        <ScrollObserver v-if="allPosts" @scrollToBottom="debouncedFetchPostsOnScroll"/>
    </div>
</template>

<style scoped>

</style>