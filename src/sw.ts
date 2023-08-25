declare let self: ServiceWorkerGlobalScope
declare type ExtendableEvent = any

self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('install')
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('activate')
})

export const registerWebPush = (subscribeOptions: PushSubscriptionOptionsInit) => {
  console.log('registerWebPush')
  self.registration.pushManager.subscribe(subscribeOptions)
}

export type PushSubscription = {}
