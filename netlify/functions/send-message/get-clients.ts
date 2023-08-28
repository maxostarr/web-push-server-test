import { client } from './redis'
import { Handler } from '@netlify/functions'

export const handler: Handler = async () => {
  // Get all connected clients
  // All client keys start with 'client:'
  const clientIds = await new Promise((resolve, reject) => {
    client.keys('client:*', (err, keys) => {
      if (err) {
        reject(err)
      }
      resolve(keys)
    })
  })

  return {
    statusCode: 200,
    body: JSON.stringify({
      clientIds
    })
  }
}
