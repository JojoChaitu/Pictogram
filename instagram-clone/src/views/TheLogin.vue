<script setup>
import { reactive } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import Avatar from '@/components/Avatar.vue';

const userStore = useUserStore();

const router = useRouter();

const { user, error, loading } = storeToRefs(userStore);

const userCredentials = reactive({
    email: '',
    password: ''
});

async function handleSignIn(){
    await userStore.signIn(userCredentials)
    userCredentials.email = '';
    userCredentials.password = '';
    if(user.value)
        router.push('/');
}
</script>

<template>
    <div class="relative w-full md:min-w-max md:mx-auto bg-slate-100 h-screen mx-auto flex justify-center items-center">
        <h1 class="register-title text-5xl absolute top-10">Login</h1>
        <div class="w-full min-w-[400px] md:w-1/3 flex justify-center md:mx-auto fixed bottom-0 border-2 border-white shadow-xl shadow-black rounded-t-box h-[80%] bg-white">
            <form @submit.prevent="handleSignIn" class="h-50 p-2 md:w-[80%] md:mx-auto flex flex-col justify-center gap-4">
                <Avatar src='/src/assets/images/placeholder-image.jpg' class-list="w-24 rounded-full mx-auto" />
                <label class="input input-bordered flex items-center gap-2">
                    Email
                    <input v-model="userCredentials.email" type="email" class="grow" placeholder="Enter email" />
                </label>
                <label class="input input-bordered flex items-center gap-2">
                    Password
                    <input v-model="userCredentials.password" type="password" class="grow" placeholder="*****" />
                </label>
                <button :disabled="loading" class="register-btn btn btn-outline text-2xl font-thin tracking-wide">Sign In</button>
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