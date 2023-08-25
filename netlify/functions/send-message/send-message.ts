import webpush from 'web-push'
import { Handler } from '@netlify/functions'
import { VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY, VAPID_SUBJECT } from "./config"


export const handler: Handler = async (event, context) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No body provided',
      }),
    }
  }

  const parsedBody = JSON.parse(event.body)

  if (!parsedBody.subscription) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No subscription provided',
      }),
    }
  }

  const { subscription } = parsedBody
  const { payload=JSON.stringify({title: 'Unset payload'}) } = parsedBody


  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

  await webpush.sendNotification(subscription, payload).catch(console.error)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Sent!`,
    }),
  }
}
