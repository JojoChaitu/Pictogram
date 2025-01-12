import supabase from '@/supabase/supabaseClient';
import { ref } from 'vue';

const useUploadImage = () => {
    const imagePath = ref(null);
    const error = ref(null);
    const isLoading = ref(true);

    const uploadImage = async (path, file) => {
        try {
            const { data: imageData, error: fetchError } = await supabase.storage.from('instagram-clone')
                                                                                 .upload(path, file);
            if(fetchError) throw fetchError;
            imagePath.value = imageData.path;
        } catch (err) {
            error.value = err;
        }
        finally{
            isLoading.value = false;
        }
        return imagePath;
    }


    return { uploadImage, error, isLoading };
}

export default useUploadImage;