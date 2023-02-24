import Fa6SolidHouseChimney from '~icons/fa6-solid/house-chimney?width=36px&height=32px'
import Fa6SolidBug from '~icons/fa6-solid/bug?width=32px&height=32px'
import Fa6SolidCode from '~icons/fa6-solid/code?width=40px&height=32px'
import Fa6SolidLaptopCode from '~icons/fa6-solid/laptop-code?width=40px&height=32px'
import Fa6SolidFile from '~icons/fa6-solid/file?width=24px&height=32px'
import Fa6SolidFolderOpen from '~icons/fa6-solid/folder-open?width=36px&height=32px'
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
        meta: { title: 'home', icon: Fa6SolidHouseChimney },
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/debug',
        name: 'debug',
        meta: { title: 'debug', icon: Fa6SolidBug },
        component: () => import('@/views/debug/Index.vue'),
        children: [
          {
            path: 'dostring_in',
            name: 'dostring_in',
            meta: { title: 'dostring_in', icon: Fa6SolidCode },
            component: () => import('@/views/debug/DoString.vue'),
          },
          {
            path: 'loadstring',
            name: 'loadstring',
            meta: { title: 'loadstring', icon: Fa6SolidLaptopCode },
            component: () => import('@/views/debug/LoadString.vue'),
          },
        ],
      },
      {
        path: '/mission',
        name: 'mission',
        meta: { title: 'mission', icon: Fa6SolidFile },
        component: () => import('@/views/Mission.vue'),
      },
    ],
  },
  {
    path: '/test',
    name: 'test',
    meta: { title: 'test', icon: Fa6SolidFolderOpen },
    component: () => import('@/views/Test.vue'),
  },
]

export default routes
