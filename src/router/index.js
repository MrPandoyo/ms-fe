/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import {createRouter, createWebHistory} from 'vue-router/auto'
import Home from '@/pages/Home.vue'
import Login from "@/pages/Login.vue";
import Layout from "@/layouts/Layout.vue";
import {useAuthenticationStore} from "@/stores/app.js";
import MasterMenu from "@/pages/MasterMenu.vue";
import MasterRole from "@/pages/MasterRole.vue";

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  { path: '/home', redirect: '/dashboard',},
  {
    path: '/',
    redirect: '/dashboard',
    component: Layout,
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Home,
      },
      {
        path: '/master',
        name: 'Data Master',
        children: [
          {
            path: '/master/menu',
            name: 'Master Menu',
            component: MasterMenu,
          },
          {
            path: '/master/role',
            name: 'Master Role',
            component: MasterRole,
          }
        ]
      },
    ]
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach((to, from) => {
  const path = to.path
  const isLoggedIn = useAuthenticationStore().isLoggedIn

  if (path !== '/login' && !isLoggedIn) {
    router.push('/login')
  }

})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
