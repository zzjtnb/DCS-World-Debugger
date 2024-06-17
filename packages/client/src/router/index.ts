import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const modules = import.meta.glob<IModuleType>('./modules/**/*.ts', { eager: true })

const routeModuleList: RouteRecordRaw[] = Object.keys(modules).reduce((list: RouteRecordRaw[], key) => {
  const mod = modules[key].default ?? {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  return [...list, ...modList]
}, [])

function sortRoute(a: RouteRecordRaw, b: RouteRecordRaw) {
  return (a.meta?.sort as number | undefined ?? 0) - (b.meta?.sort as number | undefined ?? 0)
}

routeModuleList.sort(sortRoute)

export const constantRouter: RouteRecordRaw[] = routeModuleList

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRouter,
})

export default router
