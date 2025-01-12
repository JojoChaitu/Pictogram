<script setup>
import Avatar from '../components/Avatar.vue';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const router = useRouter();

const { user, error, loading } = storeToRefs(userStore);

const userCredentials = reactive({
    name: '',
    email: '',
    password: '',
    profile_image: null
});

const imageSrc = ref(null);

async function handleSignUp(){
    console.log("userCredentials ", userCredentials)
    await userStore.createAccount(userCredentials)
    userCredentials.name = '';
    userCredentials.email = '';
    userCredentials.password = '';
    userCredentials.profile_image = null;
    if(user.value){
        router.push('/');
    }
}

async function uploadProfileImage($event){
    const file = $event.target.files[0];
    userCredentials.profile_image = file;
    imageSrc.value = URL.createObjectURL(file);
}
</script>

<template>
    <div class="relative w-full md:min-w-max md:mx-auto bg-slate-100 h-screen mx-auto flex justify-center items-center">
        <h1 class="register-title text-5xl absolute top-10">Register</h1>
        <div class="w-full flex justify-center min-w-[400px] md:w-1/3 md:mx-auto fixed bottom-0 border-2 border-white shadow-xl shadow-black rounded-t-box h-[80%] bg-white">
            <form @submit.prevent="handleSignUp" class="h-50 pt-10 px-8 md:w-[80%] md:mx-auto p-4 flex flex-col gap-4">
                <Avatar :src="imageSrc || '/src/assets/images/placeholder-image.jpg'" class-list="w-24 rounded-full mx-auto" />
                <label for="profile">
                    <input @change="uploadProfileImage" name="profile" type="file" class="file-input file-input-xs file-input-bordered w-full max-w-xs" />
                </label>
                <label class="input input-bordered flex items-center gap-2">
                    Name
                    <input v-model="userCredentials.name" type="text" class="grow" placeholder="Enter name" />
                </label>
                <label class="input input-bordered flex items-center gap-2">
                    Email
                    <input v-model="userCredentials.email" type="email" class="grow" placeholder="Enter email" />
                </label>
                <label class="input input-bordered flex items-center gap-2">
                    Password
                    <input v-model="userCredentials.password" type="password" class="grow" placeholder="*****" />
                </label>
                <button :disabled="loading" type="submit" class="register-btn btn btn-outline text-2xl font-thin tracking-wide">Sign Up</button>
                <p :key="error" class="text-red-500 text-sm" v-if="error">{{ error }}</p>
            </form>
        </div>
    </div>
</template>

<style scoped>
.register-title {
  font-family: "Playfair Display", serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
}
.register-btn {
    font-family: 'Courier New', Courier, monospace;
}

</style>