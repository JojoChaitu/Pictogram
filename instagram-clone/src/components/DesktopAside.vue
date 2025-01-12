<script setup>

</script>

<template>
    <div class="border-[1px] border-slate-200 border-t-0 h-full bg-white z-100">
        <ul class="flex flex-col items-center justify-start gap-6 pt-4 h-full">
                <li class="hover:bg-slate-200 hover:rounded-md">
                    <router-link to="/chat">
                        <span class="material-symbols-outlined text-slate-500 mx-2 text-4xl">message</span>
                    </router-link>
                </li>
                <li class="hover:bg-slate-200 hover:rounded-md">
                    <router-link to="/search" class="text-2xl font-bold">
                        <span class="material-symbols-outlined text-slate-500 mx-2 text-4xl">search</span>
                    </router-link>
                </li>
                <li class="hover:bg-slate-200 hover:rounded-md">
                    <router-link to="/profile">
                        <span class="material-symbols-outlined text-slate-500 mx-2 text-4xl">person</span>
                    </router-link>
                </li>
            </ul>
    </div>
</template>


<style lang="scss" scoped>

</style>