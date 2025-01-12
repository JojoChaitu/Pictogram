import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateAccount from '@/views/CreateAccount.vue'
import TheLogin from '@/views/TheLogin.vue'
import HomeFeed from '@/components/HomeFeed.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import UserAccount from '@/views/UserAccount.vue'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import SearchPage from '@/components/SearchPage.vue'
import WelcomePage from '@/views/WelcomePage.vue'
import ChatPage from '@/components/chat/ChatPage.vue'
import ChatWindow from '@/components/chat/ChatWindow.vue'
import ChatFront from '@/components/chat/ChatFront.vue'

// Define route guards before routes
function ifLoggedIn(to, from, next) {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  if (user.value) {
    next({ path: '/' });
  } else {
    next();
  }
}

function ifNotLoggedIn(to, from, next) {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  if (!user.value) {
    next({ path: '/welcome' });
  } else {
    next();
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: ifNotLoggedIn,
      children: [
        {
          path: '',
          component: HomeFeed,
        },
        {
          path: 'search',
          component: SearchPage,
        },
        {
          path: 'chat/',
          component: ChatPage,
          beforeEnter: ifNotLoggedIn,
          children: [
            {
              path: '',
              component: ChatFront,
              beforeEnter: ifNotLoggedIn,
            },
            {
              path: ':chatId',
              component: ChatWindow,
              beforeEnter: ifNotLoggedIn,
            },
          ]
        },
      ]
    },
    {
      path: '/welcome',
      name: 'welcome-page',
      component: WelcomePage,
    },
    {
      path: '/register',
      name: 'register',
      component: CreateAccount,
      beforeEnter: ifLoggedIn
    },
    {
      path: '/login',
      name: 'login',
      component: TheLogin,
      beforeEnter: ifLoggedIn
    },
    {
      path: '/profile',
      name: 'profile-page',
      component: ProfilePage,
      beforeEnter: ifNotLoggedIn,
      meta: { requiresAuth: true }
    },
    {
      path: '/users/:userId',
      name: 'user-account',
      component: UserAccount,
      beforeEnter: ifNotLoggedIn,
      meta: { requiresAuth: true }
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  if (!userStore.isUserLoaded) {
    await userStore.getUser();
  }
  next();
});

// router.beforeEach((to, from, next) => {
//   const userStore = useUserStore();
//   const { user } = storeToRefs(userStore);

//   if (to.matched.some(record => record.meta.requiresAuth) && !user.value) {
//     next({ path: '/login' });
//   } else {
//     next();
//   }
// });

export default router
