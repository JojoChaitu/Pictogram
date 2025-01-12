<script setup>

</script>

<template>
    <div class="grid-container grid md:grid-cols-2 min-h-screen">
        <section class="image-col hidden md:block">
            <div class="hero bg-base-200 min-h-screen">
                <div class="hero-content text-center">
                    <div class="max-w-md">
                    <img src="/src/assets/images/social1.png" alt="hero" class="w-full" />
                    </div>
                </div>
            </div>
        </section>
        <section class="data-col bg-base-200 relative min-w-[400px]">
            <div class="auth-container flex flex-col items-center justify-center gap-10 h-full">
                <h1 class="text-6xl text- text-white font-bold logo mb-4 text-shadow">Pictogram</h1>
                <RouterLink to="/register" >
                    <button class="btn btn-primary">Create Account</button>
                </RouterLink>
                <div class="divider w-[60%] mx-auto">or</div>
                <RouterLink to="/login">
                    <button class="btn btn-primary">Sign in</button>
                </RouterLink>
            </div>
        </section>
    </div>
</template>



<style scoped>
.data-col {
    background-image: url('/src/assets/images/bg01.jpg');
    background-size: cover;
    background-position: center;
    /* border-radius: 10px 0 0 5px; */
}
.text-shadow {
    text-shadow: 2px 2px 10px rgba(0, 0, 0, .1);
}
</style>