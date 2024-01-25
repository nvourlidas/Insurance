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
        component: () => import('@/views/Main/Customers/AddCustomer'),
      },
      {
        path: '/AddContract',
        name: 'AddContract',
        component: () => import('@/views/Main/Contracts/AddContract'),
      },
      {
        path: '/Customers',
        name: 'Customers',
        component: () => import('@/views/Main/Customers/Customers'),
      },
      {
        path: '/Contracts',
        name: 'Contracts',
        component: () => import('@/views/Main/Contracts/Contracts'),
      },
      {
        path: '/Omadika',
        name: 'Omadika',
        component: () => import('@/views/Main/Contracts/Omadika'),
      },
      {
        path: '/Expire',
        name: 'Expire',
        component: () => import('@/views/Main/Contracts/Expire'),
      },
      {
        path: '/ToPay',
        name: 'ToPay',
        component: () => import('@/views/Main/Contracts/ToPay'),
      },
      {
        path: '/AnaAsfal',
        name: 'AnaAsfal',
        component: () => import('@/views/Main/Contracts/AnaAsfal'),
      },
      {
        path: '/AnaBranch',
        name: 'AnaBranch',
        component: () => import('@/views/Main/Contracts/AnaBranch'),
      },
      {
        path: '/AddZimia',
        name: 'AddZimia',
        component: () => import('@/views/Main/Zimies/AddZimia'),
      },
      {
        path: '/Zimies',
        name: 'Zimies',
        component: () => import('@/views/Main/Zimies/Zimies'),
      },
      {
        path: '/MZimies',
        name: 'MZimies',
        component: () => import('@/views/Main/Zimies/MZimies'),
      },
      {
        path: '/Asfal',
        name: 'Asfal',
        component: () => import('@/views/Main/Asfal/Asfal'),
      },
      {
        path: '/Branches',
        name: 'Branches',
        component: () => import('@/views/Main/Asfal/Branches'),
      },
      {
        path: '/DelCustomers',
        name: 'DelCustomers',
        component: () => import('@/views/Main/Deleted/DelCustomers'),
      },
      {
        path: '/DelContracts',
        name: 'DelContracts',
        component: () => import('@/views/Main/Deleted/DelContracts'),
      },
      {
        path: '/AddUser',
        name: 'AddUser',
        component: () => import('@/views/Main/Users/AddUser'),
      },
      {
        path: '/Users',
        name: 'Users',
        component: () => import('@/views/Main/Users/Users'),
      },
      {
        path: '/Files',
        name: 'Files',
        component: () => import('@/views/Main/Files/Files'),
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
