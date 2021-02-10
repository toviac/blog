import Home from '@/views/Index.vue';

const routes = [
  {
    path: '',
    name: 'Home',
    component: Home,
  },
  {
    path: '/blog',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: '',
        name: 'Blog',
        component: () => import('@/views/blog/Index.vue'),
      },
      {
        path: '/blog/:id',
        name: 'BlogDetail',
        component: () => import('@/views/blog/BlogDetail.vue'),
      },
    ],
  },
  {
    path: '/practice',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: '',
        name: 'Practice',
        component: () => import('@/views/practice/Index.vue'),
      },
      {
        path: '/practice/:component',
        name: 'PracticeDetail',
        component: () => import('@/views/practice/Detail.vue'),
      },
    ],
  },
  {
    path: '/about',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/about/Index.vue'),
      },
    ],
  },
];

export default routes;
