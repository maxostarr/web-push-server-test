<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import {VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT} from "./config"

// let registration: ServiceWorkerRegistration | null = null;
// Vue reactive object to store the registration
let registration = ref<ServiceWorkerRegistration | null>(null);

const getNotificationPermission = async () => {
  if (Notification.permission === 'granted') {
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification');
  }
}

const registerWebPush = async () => {

  await getNotificationPermission();

  if (!navigator.serviceWorker.controller) {
    return;
  }

  const options: PushSubscriptionOptionsInit = {
    userVisibleOnly: true,
    applicationServerKey: VAPID_PUBLIC_KEY,
  }

  navigator.serviceWorker.controller.postMessage({
    type: 'registerWebPush',
    options,
  });  
}

// const sendPush = async () => {
  const payload = JSON.stringify({
    title: 'Push Notification',
    // body: 'This is a push notification',
    // icon: 'https://vuejs.org/images/logo.png',
    // image: 'https://vuejs.org/images/logo.png',
    // badge: 'https://vuejs.org/images/logo.png',
    // vibrate: [200, 100, 200, 100, 200, 100, 200],
    // tag: 'vibration-sample',
    // actions: [
    //   {
    //     action: 'coffee-action',
    //     title: 'Coffee',
    //     icon: 'https://vuejs.org/images/logo.png',
    //   },
    //   {
    //     action: 'doughnut-action',
    //     title: 'Doughnut',
    //     icon: 'https://vuejs.org/images/logo.png',
    //   },
    //   {
    //     action: 'gramophone-action',
    //     title: 'gramophone',
    //     icon: 'https://vuejs.org/images/logo.png',
    //   },
    //   {
    //     action: 'atom-action',
    //     title: 'Atom',
    //     icon: 'https://vuejs.org/images/logo.png',
    //   },
    // ],
    // data: {
    //   dateOfArrival: Date.now(),
    //   primaryKey: 1,
    // },
  });

//   const options = {
//     TTL: 60,
//   };

//   const subscription = registration.value;

//   if (!subscription) {
//     return;
//   }

//   const result = await webpush.sendNotification(
//     subscription,
//     payload,
//     options
//   );

//   console.log(result);
// }

const sendMessage = () => {
  fetch('http://localhost:3000/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      registration: registration.value,
      payload,
    }),
  });
}

navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data.type === 'registerWebPush') {
    registration.value = JSON.parse(event.data.payload);
  }
});

onBeforeUnmount(() => {
  navigator.serviceWorker.removeEventListener('message', () => {});
})

registerWebPush();

</script>

<template>
  <header>
  
  </header>

  <main>

    <h1>Web Push Notifications</h1>

    <div v-if="registration">
      <h2>Registration:</h2>
      <p>Endpoint: {{registration.endpoint}}</p>
      <br>
      <p>Auth: {{registration.keys.auth}}</p>
      <br>
      <p>P256DH: {{registration.keys.p256dh}}</p>
      <br>
      <p>Expiration Time: {{registration.expirationTime}}</p>

      <h2>Test Command</h2>
      <pre>
        npx web-push send-notification --endpoint={{ registration.endpoint }} --key={{ registration.keys.p256dh }} --auth={{ registration.keys.auth }} --payload='{{ payload }}' --vapid-subject={{ VAPID_SUBJECT }} --vapid-pubkey={{ VAPID_PUBLIC_KEY }} --vapid-pvtkey={{ VAPID_PRIVATE_KEY }}
      </pre>

      <button 
        @click="sendMessage()"
      >Send Message</button>
    </div>



    <button 
      @click="registerWebPush()"
    >Register</button>
  </main>
</template>

<style scoped>

</style>
./config