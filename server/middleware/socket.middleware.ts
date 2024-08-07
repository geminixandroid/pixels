import { Socket, Server } from 'socket.io'

let io: Server | null

export default defineEventHandler((event) => {
  if (io) return

  // @ts-expect-error private method
  io = new Server(event.node.res.socket?.server)

  io!.on('connection', (socket: Socket) => {
    socket.on('click', (data) => {
      io!.emit('click', data)
    })

    socket.on('disconnect', () => {
      // Put optional disconnect logic here
    })
  })
})
