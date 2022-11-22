import IconGgHome from '~icons/gg/home'
import IconGgCode from '~icons/gg/code'
import IconGgDebug from '~icons/gg/debug'
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
        meta: { title: '首页', icon: IconGgHome },
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/dostring_in',
        name: 'dostring_in',
        meta: { title: 'dostring_in', icon: IconGgCode },
        component: () => import('@/views/lua/Debug.vue'),

      },
      {
        path: '/loadstring',
        name: 'loadstring',
        meta: { title: 'loadstring', icon: IconGgDebug },
        component: () => import('@/views/lua/Debug.vue'),
      },
    ],
  },
  {
    path: '/test',
    name: 'test',
    meta: { title: 'test', icon: IconGgHome },
    component: () => import('@/views/Test.vue'),
  },
]

export default routes
