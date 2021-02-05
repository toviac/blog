import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Index.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '',
    name: 'Home',
    component: Home,
  },
  {
    path: '/',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: '/blog',
        name: 'Blog',
        component: () => import('@/views/blog/Index.vue'),
      },
      {
        path: '/blog/:id',
        name: 'BlogDetail',
        component: () => import('@/views/blog/BlogDetail.vue'),
      },
      {
        path: '/practice',
        name: 'Practice',
        component: () => import('@/views/practice/Index.vue'),
      },
      {
        path: '/practice/:component',
        name: 'PracticeDetail',
        component: () => import('@/views/practice/Detail.vue'),
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/about/Index.vue'),
      },
    ],
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
