<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } from "./config"

// let registration: ServiceWorkerRegistration | null = null;
// Vue reactive object to store the registration
let registration = ref<ServiceWorkerRegistration | null>(null);
let status = ref<string>('');
let name = ref<string>('');
let clients = ref<string[]>(['']);
let selectedClient = ref<string>('');

const getNotificationPermission = async () => {

  status.value = 'Checking Notification permission...';

  if (Notification.permission === 'granted') {
    status.value = 'Notification permission granted';
    return;
  }

  if (Notification.permission === 'denied') {
    status.value = 'Notification permission denied';
    return;
  }

  status.value = 'Requesting Notification permission...';

  const permission = await Notification.requestPermission();

  status.value = `Notification permission: ${permission}`;

  if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification');
  }
}

const registerWebPush = async () => {

  await getNotificationPermission();

  status.value = 'Checking for service worker...';
  if (!navigator.serviceWorker.controller) {
    status.value = 'No service worker found';
    return;
  }

  const options: PushSubscriptionOptionsInit = {
    userVisibleOnly: true,
    applicationServerKey: VAPID_PUBLIC_KEY,
  }

  status.value = 'Registering push...';

  navigator.serviceWorker.controller.postMessage({
    type: 'registerWebPush',
    options,
  });
}

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


const sendMessage = () => {
  // Send to 'send-message' netlify function
  fetch('/.netlify/functions/send-message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subscription: registration.value,
      payload,
    }),
  });
}

const getClients = async () => {
  const response =  await fetch('/.netlify/functions/get-clients', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  clients.value = data.clientIds;
}

const sendMessageToClient = async () => {
  const response =  await fetch('/.netlify/functions/send-message-to-client', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clientId: selectedClient.value,
      payload,
    }),
  });

  const data = await response.json();

  console.log(data);
}

navigator.serviceWorker.addEventListener('message', (event) => {
  status.value = 'Message received'
  if (event.data.type === 'registerWebPush') {
    status.value = 'Web Push registered'
    registration.value = JSON.parse(event.data.payload);

    // Send to 'save-client-registration' netlify function
    fetch('/.netlify/functions/save-client-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registration: registration.value,
        name: name.value,
      }),
    });
  }
});

onBeforeUnmount(() => {
  navigator.serviceWorker.removeEventListener('message', () => { });
})

// registerWebPush();

</script>

<template>
  <header>

  </header>

  <main>

    <h1>Web Push Notifications</h1>

    <p>{{ status }}</p>

    <div v-if="registration">
      <h2>Registration:</h2>
      <p>Endpoint: {{ registration.endpoint }}</p>
      <br>
      <p>Auth: {{ registration.keys.auth }}</p>
      <br>
      <p>P256DH: {{ registration.keys.p256dh }}</p>
      <br>
      <p>Expiration Time: {{ registration.expirationTime }}</p>

      <h2>Test Command</h2>
      <pre>
        npx web-push send-notification --endpoint={{ registration.endpoint }} --key={{ registration.keys.p256dh }} --auth={{ registration.keys.auth }} --payload='{{ payload }}' --vapid-subject={{ VAPID_SUBJECT }} --vapid-pubkey={{ VAPID_PUBLIC_KEY }} --vapid-pvtkey={{ VAPID_PRIVATE_KEY }}
      </pre>

      <button @click="sendMessage()">Send Message</button>
    </div>




    <h2>Register Web Push</h2>

    <input
      type="text"
      v-model="name"
      placeholder="Name"
    >

    <button @click="registerWebPush()">Register</button>

    <h1>Admin Zone 👷‍♀️👷‍♂️</h1>

    <h2>Clients</h2>

    <button @click="getClients()">Get Clients</button>

    <ul>
      <li v-for="client in clients" :key="client" 
        @click="selectedClient = client"
        :style="{ 'color': selectedClient === client ? 'red' : 'white' }"
      >
        {{ client }}
      </li>
    </ul>

    <button @click="sendMessageToClient()">Send Message</button>
  </main>
</template>

<style scoped></style>
./config