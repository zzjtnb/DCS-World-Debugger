import Layout from '@/layout/parentLayout.vue'

const routes = [
  {
    path: '/test',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        name: 'test',
        meta: { title: '测试页面' },
        component: () => import('@/views/Test.vue'),
      },
      {
        path: '/color',
        meta: { title: ' 中国色 - 中国传统颜色' },
        component: () => import('@/views/Colors.vue'),
      },
    ],
  },
  // {
  //   path: '/test',
  //   name: 'test',
  //   meta: { title: 'test' },
  //   component: () => import('@/views/Test.vue'),
  // },

]

export default routes
