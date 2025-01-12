import supabase from '@/supabase/supabaseClient';
import { ref } from 'vue';

const useDownloadImage = () => {
    const image = ref(null);
    const error = ref(null);
    const isLoading = ref(true);

    const fetchImage = async (path) => {
        try {
            const { data, error } = await supabase.storage.from('instagram-clone').download(path);
            if(error) throw error;
            image.value = URL.createObjectURL(data);
        } catch (err) {
            error.value = err.message;
        }
        finally{
            isLoading.value = false;
        }
        return image.value;
    }


    return { fetchImage, image, error, isLoading };
}

export default useDownloadImage;