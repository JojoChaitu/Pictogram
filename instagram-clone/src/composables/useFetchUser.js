import supabase from '@/supabase/supabaseClient';
import { ref } from 'vue';

const useFetchUser = (tableName = 'users') => {
    const user = ref(null);
    const error = ref(null);
    const isLoading = ref(true);

    const fetchUser = async (userId) => {
        try {
            const { data, error } = await supabase.from(tableName)
                                    .select()
                                    .eq('id', userId)
                                    .single();
            if(error) throw error;
            user.value = data;
        } catch (err) {
            error.value = err;
        }
        finally{
            isLoading.value = false;
            return user.value;
        }
    }


    return { fetchUser, user, error, isLoading };
}

export default useFetchUser;