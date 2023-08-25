const webpush = require("web-push");

// VAPID keys should be generated only once.
const vapidKeys = {
  publicKey:
    "BAXKP3gfH86cy7TPLfgQFrmurkktvtEVx0Y2DyfoaCc_fsMIcj2G0ZCJJhosu8Ygkx5lg85GGqgb6BH8gmxOu9s",
  privateKey: "PRiZQqBASgnwvTusuK1YktaOMVluMzrRKq0P_3GIQ1g",
};

// webpush.setGCMAPIKey("<Your GCM API Key Here>");
webpush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

const subscription = {
  endpoint:
    "https://updates.push.services.mozilla.com/wpush/v2/gAAAAABkuYS8Zjmrk7SEgifPP0cQ-qb16qQG0QFs4qW8yLB3pin5v77a5z-exW9k4jBqAWzTWhHVbW9qukiFa1zCJ3QQrBnRPgPYhMM54PmZYPIzw9w9JwuWR0deDKb5eRjr1n0mIa4LSYyHc0t9uLUarlcbTUH7iRw6asYNw-J7yscF9xfwy4M",
  expirationTime: null,
  keys: {
    auth: "w0nIFxJP2o2HTSH8NGo8Lg",
    p256dh:
      "BMKLzAscl4Y7O5vNxy7-UdanvC6WTNZ1y7_1h1lWkNkemUFFMeFpdHE0EYfBuP8g6wCq0nJyeWZGPlqQLtutToQ",
  },
};

webpush
  .sendNotification(subscription, "Your Push Payload Text")
  .then((res: any) => {
    console.log(res);
  });
