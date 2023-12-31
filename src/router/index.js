import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: 'dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import('@/views/Main/Dashboard.vue'),
      },
      {
        path: '/AddCustomer',
        name: 'AddCustomer',
        component: () => import('@/views/Main/AddCustomer'),
      },
      {
        path: '/AddContract',
        name: 'AddContract',
        component: () => import('@/views/Main/AddContract'),
      },
      {
        path: '/Customers',
        name: 'Customers',
        component: () => import('@/views/Main/Customers'),
      },
      {
        path: '/Contracts',
        name: 'Contracts',
        component: () => import('@/views/Main/Contracts'),
      },
      {
        path: '/Expire',
        name: 'Expire',
        component: () => import('@/views/Main/Expire'),
      },
      {
        path: '/AnaAsfal',
        name: 'AnaAsfal',
        component: () => import('@/views/Main/AnaAsfal'),
      },
    ],
  },
  {
    path: '/pages',
    redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
