import Layout from '@/layout/test/Index.vue'

const routes = [
  {
    path: '/test',
    component: Layout,
    redirect: 'test',
    children: [
      {
        path: '',
        name: 'index',
        meta: { title: '测试首页' },
        component: () => import('@/views/test/Index.vue'),
      },
      {
        path: 'icon',
        name: 'icon',
        meta: { title: '图标' },
        component: () => import('@/views/test/Icon.vue'),
      },
      {
        path: 'unocss',
        name: 'unocss',
        meta: { title: 'unocss' },
        component: () => import('@/views/test/Unocss.vue'),
      },
      // {
      //   path: 'color',
      //   meta: { title: '中国传统颜色' },
      //   component: () => import('@/views/test/Colors.vue'),
      // },
      {
        path: 'form',
        meta: { title: '表单' },
        component: () => import('@/views/test/Form.vue'),
      },
    ],
  },
  {
    path: '/color',
    name: 'color',
    meta: { title: '中国传统颜色' },
    component: () => import('@/views/test/Color.vue'),
  },

]

export default routes
