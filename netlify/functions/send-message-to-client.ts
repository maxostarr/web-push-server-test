import webpush from 'web-push'
import { Handler } from '@netlify/functions'
import { client } from './redis'

import { VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY, VAPID_SUBJECT } from './config'

export const handler: Handler = async (event, context) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No body provided'
      })
    }
  }

  const parsedBody = JSON.parse(event.body)

  if (!parsedBody.clientId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No client provided'
      })
    }
  }

  if (!parsedBody.payload) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No payload provided'
      })
    }
  }

  const { clientId, payload } = parsedBody
  const rawSubscription = await client.get(clientId)

  if (!rawSubscription) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No subscription found'
      })
    }
  }

  const subscription = JSON.parse(rawSubscription)

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

  await webpush.sendNotification(subscription, payload).catch(console.error)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Sent!`
    })
  }
}
