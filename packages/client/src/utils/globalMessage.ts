import { useAppStore } from '@/stores'

export function setupNaiveDiscreteApi() {
  const appStore = useAppStore()

  const { message, notification, dialog, loadingBar } = createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar', 'modal'],
    {
      configProviderProps: {
        theme: appStore.getTheme,
      },
      notificationProviderProps: {
        max: appStore.provider.notification.max,
      },
    },
  )
  window.loadingBar = loadingBar
  window.notification = notification
  window.message = message
  window.dialog = dialog
}
