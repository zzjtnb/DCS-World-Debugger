import type { RouteRecordRaw } from 'vue-router'
import Fa6SolidDesktop from '~icons/fa6-solid/desktop'
import Layout from '@/layout/Index.vue'

const IFrame = () => import('@/views/iframe/Index.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/frame',
    name: 'Frame',
    redirect: '/frame/typescripttolua',
    component: Layout,
    meta: {
      title: 'link',
      sort: 8,
      icon: Fa6SolidDesktop,
    },
    children: [
      {
        path: 'typescripttolua',
        name: 'typescripttolua',
        meta: {
          title: 'TypeScriptToLua',
          frameSrc: 'https://typescripttolua.github.io/play/',
        },
        component: IFrame,
      },
      {
        path: 'naive',
        name: 'frame-naive',
        meta: {
          title: 'NaiveUi',
          frameSrc: 'https://www.naiveui.com',
        },
        component: IFrame,
      },
      {
        path: 'icones',
        name: 'frame-icones',
        meta: {
          title: 'icones',
          frameSrc: 'https://icones.js.org',
        },
        component: IFrame,
      },
    ],
  },
]

export default routes
