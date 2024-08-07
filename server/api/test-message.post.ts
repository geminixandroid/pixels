export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Make sure to do this in a safe way
  event.context?.appSocket.emit('click', body.value)
  return body.value
})
