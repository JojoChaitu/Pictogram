<script setup>
import { onMounted, ref, watchEffect, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import useFetchUser from '@/composables/useFetchUser';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import Avatar from '@/components/Avatar.vue';
import supabase from '@/supabase/supabaseClient';
import { } from '@/utils'
import { formatDistance } from 'date-fns';

const { VITE_IMAGE_URL } = import.meta.env;

const chatWindow = ref();

const route = useRoute();

const formattedTimeOfPostAdded = (time) => {
    return formatDistance(time, Date.now(), { addSuffix: true });
}

const { fetchUser } = useFetchUser('users');

const friend = ref(null);
const { user: loggedInUser } = storeToRefs(useUserStore());

const newMessage = ref('');
const messages = ref([]);
const messagesLoading = ref(false);

const isUserSentMessage = (currentMessage) => {
    if(currentMessage.sender_id === loggedInUser.value.id)
        return true;
    else return false;
}

const fetchMessages = async () => {
    messagesLoading.value = true;
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${loggedInUser.value.id},receiver_id.eq.${friend.value.id}),and(sender_id.eq.${friend.value.id},receiver_id.eq.${loggedInUser.value.id})`)
        .order('created_at', { ascending: true });
    
      if (!error) {
        messages.value = data;
        messagesLoading.value = false;
      }
};

const subscribeToRealtimeMessages = () => {
    supabase
        .channel('messages')
        .on('postgres_changes', { event:'INSERT', schema: 'public', table: 'messages'}, (payload) => {
            if(payload.new.sender_id === friend.value.id && 
            payload.new.receiver_id === loggedInUser.value.id){
                messages.value.push(payload.new);
                scrollToBottom();
            }
        })
        .subscribe();
}

const scrollToBottom = async () => {
    await nextTick();
    if (chatWindow.value) {
        chatWindow.value.scrollTo({ top: chatWindow.value.scrollHeight, behavior: 'smooth'});
    }
};

onMounted(async () => {
    const userData = await fetchUser(route.params.chatId);
    friend.value = userData;
    await fetchMessages();
    subscribeToRealtimeMessages();
    await scrollToBottom();
})

watchEffect(async () => {
    const userData = await fetchUser(route.params.chatId);
    friend.value = userData;
    await fetchMessages();
    await scrollToBottom();
});

onUnmounted(async () => {
    await supabase.removeChannel('messages');
})

const sendMessage = async () => {
      if (!newMessage.value) return;
      const { data, error } = await supabase
        .from('messages')
        .insert(
          { 
            sender_id: loggedInUser.value.id, 
            receiver_id: friend.value.id, 
            content: newMessage.value, 
        })
        .select().single();

      if (!error) {
        messages.value.push(data);
        newMessage.value = '';
        await scrollToBottom();
      }
    };
</script>

<template>
    <div v-if="friend" class="chat-window-container w-full h-[500px] md:h-[440px] bg-white flex flex-col justify-center">
        <section class="chat-window__header w-full">
            <div class="flex gap-2 justify-start items-center p-2 border-b-[1px] border-slate-300">
                <Avatar :src="`${VITE_IMAGE_URL}/${friend.profile_picture}`" class-list="w-12 rounded-full" />
                <div class="h-12 flex flex-col justify-start items-start">
                    <span class="open-sans text-lg text-slate-700 font-semibold">{{ friend.username }}</span>
                    <p class="text-[.8rem] text-slate-400">active</p>
                </div>
            </div>
        </section>
        <section ref="chatWindow" v-if="messages" class="chat-window__body p-2 md:p-4 w-full h-full overflow-auto">
            <div v-if="messages.length > 0" class="messages-container w-full h-full">
                <div class="chat chat-start" :class="{ 'chat-end': isUserSentMessage(message) }" v-for="message in messages" :key="message.id">
                    <div class="chat-image">
                        <Avatar :src="`${VITE_IMAGE_URL}/${isUserSentMessage(message) ? loggedInUser.profile_picture : friend.profile_picture}`" class-list="w-10 md:w-12 rounded-full" />
                    </div>
                    <div class="chat-header">
                        <time class="text-[12px] opacity-50">{{ formattedTimeOfPostAdded(message.created_at) }}</time>
                    </div>   
                    <div class="chat-bubble">{{ message.content }}</div>
                </div>
            </div>
            <div v-else class="flex justify-center items-end h-full">
                <span class="text-2xl font-medium text-gray-500 mb-2">Try saying Hello <span class="text-3xl">👋</span></span>
            </div>
        </section>
        <section v-if="messagesLoading" class="w-full h-full flex justify-center items-center">
            <div class="loading loading-spinner text-primary loading-lg mb-4"></div>
        </section>
        <section class="chat-window__footer w-full">
            <form @submit.prevent="sendMessage" class="flex gap-2 bg-white justify-between items-center p-2 border-t-[1px] border-slate-300">
                <textarea v-model="newMessage" type="text" class="textarea w-full h-6" placeholder="Type a message..." />
                <button class="btn btn-circle flex justify-center items-center shadow-sm">
                    <span class="material-symbols-outlined text-slate-500 text-2xl">send</span>
                </button>
            </form>
        </section>
    </div>
</template>


<style scoped>
.chat-window-container {
    height: calc(100vh - 183px)
}
</style>