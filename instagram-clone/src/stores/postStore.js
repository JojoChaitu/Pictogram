import { defineStore } from "pinia";
import supabase from "@/supabase/supabaseClient";
import { ref } from "vue";
import { useUserStore } from "./userStore";
import useUploadImage from "@/composables/useUploadImage";
import { generateRandomUniqueId } from "@/utils";


export const usePostStore = defineStore('posts', () => {

    const { error: uploadError, uploadImage } = useUploadImage();
    const userStore = useUserStore();

    //STATE
    const posts = ref([]);
    const loading = ref(false);
    const error = ref(null);

    //GETTERS
    
    //ACTIONS
    async function getPosts(){
        loading.value = true;

        try {
            const { data, error: fetchError } = await supabase.from('posts').select();
            if(fetchError) throw fetchError;
            posts.value = data;
        }
        catch(err){
            error.value = err;
        }
        finally{
            loading.value = false;
        }
    }
    async function addPost(post){
        error.value = null;
        loading.value = true;
        try {
            const uniqueId = generateRandomUniqueId();
            const imagePath = `posts/${uniqueId}-${post.title}`;
            //first upload image to storage
            const imageLocation = await uploadImage(imagePath, post.postImage);
            if(uploadError.value) {
                throw new Error('Image upload failed');
            }

            const normalizedPost = {
                title: post.title,
                description: post.description,
                image_url: imageLocation.value,
                author_id: userStore.user.id,
            }
            //then add post to posts table along with image url
            const { error } = await supabase.from('posts').insert(normalizedPost);
            if (error) {
                throw new Error(error);
            }
            posts.value.push(normalizedPost);
            console.log("posts.value ", posts.value);
        } catch (err) {
            error.value = err;
            console.log(error.value);
        }
        finally{
            loading.value = false;
            return posts.value.pop();
        }
    }
    
    return {
        posts,
        addPost,
        getPosts,
    }
})