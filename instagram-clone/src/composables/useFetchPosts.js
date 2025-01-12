import supabase from '@/supabase/supabaseClient';
import { ref } from 'vue';

const useFetchPosts = (tableName) => {
    const posts = ref(null);
    const error = ref(null);
    const isLoading = ref(true);

    const fetchPosts = async (query, startIdx, endIdx) => {
        try {
            const { data, error } = await supabase.from(tableName)
                                    .select(query && query)
                                    .range(startIdx, endIdx)
                                    .order('created_at', { ascending: false });
            if(error) throw error;
            posts.value = data;
        } catch (err) {
            error.value = err;
        }
        finally{
            isLoading.value = false;
            return posts.value;
        }
    }

    return { fetchPosts, posts, error, isLoading };
}

export default useFetchPosts;