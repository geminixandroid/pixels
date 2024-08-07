import { Socket, Server } from 'socket.io'
import type { IPixel } from '~/shared/viewModel/iPixel'

let io: Server | null

function generatePixels(rows: number, columns: number): IPixel[][] {
  const arr: IPixel[][] = []
  for (let y = 0; y < rows; y++) {
    arr[y] = []
    for (let x = 0; x < columns; x++) {
      arr[y][x] = {
        x,
        y,
        color: '#ffffff',
      }
    }
  }

  return arr
}

const pixelsData: IPixel[][] = generatePixels(100, 100)

export default defineEventHandler((event) => {
  if (io) return

  // @ts-expect-error private method
  io = new Server(event.node.res.socket?.server)

  io!.on('connection', (socket: Socket) => {
    io?.emit('init', pixelsData)

    socket.on('click', ({ x, y, color }: IPixel) => {
      const storedPixel = pixelsData[y][x]
      if (!storedPixel) return

      storedPixel.color = color

      io!.emit('click', storedPixel)
    })

    socket.on('disconnect', () => {})
  })
})
