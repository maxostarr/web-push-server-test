declare let self: ServiceWorkerGlobalScope
declare type ExtendableEvent = any

self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('install')
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('activate')
})

self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) {
    return
  }
  console.log('🚀 ~ file: sw.ts:15 ~ self.addEventListener ~ event.data:', event.data.text())
  const notification = event.data.json()

  self.registration.showNotification(notification.title, notification.options)
})

const registerWebPush = async (options: PushSubscriptionOptionsInit) => {
  const registration = await self.registration.pushManager.getSubscription()

  if (registration) {
    return registration
  }

  const subscription = await self.registration.pushManager.subscribe(options)

  return subscription
}

self.addEventListener('message', async (event) => {
  switch (event.data.type) {
    case 'registerWebPush': {
      const result = await registerWebPush(event.data.options)
      event.source?.postMessage({
        type: 'registerWebPush',
        payload: JSON.stringify(result)
      })
      break
    }
    default:
      break
  }
})

export type PushSubscription = {}
