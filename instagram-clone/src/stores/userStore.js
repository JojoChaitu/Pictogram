import { defineStore } from "pinia";
import { ref } from "vue";
import supabase from "@/supabase/supabaseClient";

export const useUserStore = defineStore('userStore', () => {

    //STATE
    const user = ref(null);
    const error = ref(null);
    const loading = ref(false);
    const isUserLoaded = ref(false);

    //GETTERS

    //ACTIONS
    async function createAccount(userCredentials){
        loading.value = true;
        error.value = null;

        const { email, password, name, profile_image } = userCredentials;
        if(!email || !password || !name) {
            error.value = 'Please fill in all fields';
            loading.value = false;
            return
        }
        //Check if user with same username already exists
        const { data: existingUser } = await supabase.from('users')
                                                        .select()
                                                        .eq('username', name)
                                                        .single();                                                              
        if(existingUser) {
            error.value = 'User already exists';
            loading.value = false;
            return;
        }
        try {
            //Create user
            const { data, error: signupError } = await supabase.auth.signUp({
                email,
                password
            })
            if(signupError) throw signupError;

            //Upload profile image to storage
            const { data: imageData, error: uploadError } = await supabase.storage.from('instagram-clone')
                                                                                  .upload('profiles/'+data.user.email, profile_image);
            if(uploadError) throw uploadError;
            //Add user to users table in db
            const { error: insertError } = await supabase.from('users').insert({
                email,
                username: name,
                profile_picture: imageData.path
            });
            if(insertError) throw insertError;

            //Get user from db
            const { data: newUser } = await supabase.from('users').select()
                                                        .eq('email', data.user.email)
                                                        .single();
                                                                                
            user.value = {...newUser};
        } catch (err) {
            error.value = err.message;
        }
        finally {
            loading.value = false;
            return;
        }

    }

    async function signIn(userCredentials){
        loading.value = true;
        error.value = null;
        const { email, password } = userCredentials;

        if(!email || !password) {
            error.value = 'Please fill in all fields';
            return
        }
        try {
            //Sign in user
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            if(error) throw error;
            //Get user from db
            const { data: newUser } = await supabase.from('users').select()
                                                        .eq('email', data.user.email)
                                                        .single();
            user.value = {...newUser};
        } catch (err) {
            error.value = err.message;
        }
        finally {
            loading.value = false;
            return;
        }
    }

    async function getUser() {
        loading.value = true;
        console.log("getUser called");
        try {
            //Get user from auth (server)
            const { data : { user: authUser }, error } = await supabase.auth.getUser();
            if(error) throw error;

            //Get user from db
            const { data, error: fetchError } = await supabase.from('users')
                                                                .select()
                                                                .eq('email', authUser.email)
                                                                .single();
            if(fetchError) throw fetchError;
            //Set user in store
            user.value = { ...data };
            console.log("user from getUser ",user.value);
            isUserLoaded.value = true;
        }
        catch (err) {
            console.log(err) 
        }
        finally {
            loading.value = false;
            return;
        }
    }

    async function logout(){
        loading.value = true;
        error.value = null;
        try {
            const { error } = await supabase.auth.signOut();
            if(error) throw error;
            user.value = null;
        } catch (err) {
            error.value = err.message;
        }
        finally {
            loading.value = false;
            return;
        }
    }

    return {
        user,
        error,
        loading,
        isUserLoaded,
        createAccount,
        signIn,
        getUser,
        logout
    }

})