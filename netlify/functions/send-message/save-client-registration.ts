import { client } from './redis'

export const handler = async (event: any) => {
  // Ensure name is in body
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No body provided'
      })
    }
  }

  const parsedBody = JSON.parse(event.body)

  if (!parsedBody.name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No name provided'
      })
    }
  }

  // Ensure registration is in body
  if (!parsedBody.registration) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No registration provided'
      })
    }
  }

  const clientKey = `client:${parsedBody.name}`

  // Save client registration
  await client.set(clientKey, JSON.stringify(parsedBody.registration))

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Saved!`
    })
  }
}
