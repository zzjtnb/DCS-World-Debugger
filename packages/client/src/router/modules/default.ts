import Layout from '@/layout/parentLayout.vue'

const routes = [
  {
    path: '/test',
    component: Layout,
    redirect: '/test',
    children: [
      {
        path: '/test',
        name: 'test',
        meta: { title: 'test' },
        component: () => import('@/views/Test.vue'),
      },
    ],
  },

]

export default routes
