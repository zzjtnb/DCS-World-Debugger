import IconFaHome from '~icons/fa6-solid/house-chimney'
import IconFaCode from '~icons/fa6-solid/code'
import IconFaDebug from '~icons/fa6-solid/bug'
import IconFaFile from '~icons/fa6-solid/file'
import Layout from '@/layout/Index.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/',
    children: [
      {
        path: '/',
        name: 'home',
        meta: { title: '首页', icon: IconFaHome },
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/dostring_in',
        name: 'dostring_in',
        meta: { title: 'dostring_in', icon: IconFaCode },
        component: () => import('@/views/lua/Debug.vue'),

      },
      {
        path: '/loadstring',
        name: 'loadstring',
        meta: { title: 'loadstring', icon: IconFaDebug },
        component: () => import('@/views/lua/Debug.vue'),
      },
      {
        path: '/mission',
        name: 'mission',
        meta: { title: 'mission', icon: IconFaFile },
        component: () => import('@/views/Mission.vue'),
      },
    ],
  },
  {
    path: '/test',
    name: 'test',
    meta: { title: 'test', icon: IconFaHome },
    component: () => import('@/views/Test.vue'),
  },
]

export default routes
