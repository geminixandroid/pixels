import { Socket, Server } from 'socket.io'
import type { IPixel } from '~/shared/viewModel/iPixel'
import fs from 'fs'

let io: Server | null
const fileName = 'pixels.json'

if (!fs.existsSync(fileName)) {
  fs.writeFileSync(fileName, JSON.stringify(generatePixels(100, 100)))
}

const pixelsData = JSON.parse(
  fs.readFileSync(fileName, { encoding: 'utf8', flag: 'r' }).toString()
) as IPixel[][]

process.on('exit', () => saveData())

function saveData() {
  fs.writeFileSync(fileName, JSON.stringify(pixelsData))
}

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

export default defineEventHandler((event) => {
  if (io) return

  // @ts-expect-error private method
  io = new Server(event.node.res.socket?.server)

  io?.on('connection_error', () => saveData())

  io?.on('connection', (socket: Socket) => {
    socket.on('initMe', (id: string) => {
      io?.to(id).emit('init', pixelsData)
    })

    socket.on('click', ({ x, y, color }: IPixel) => {
      const storedPixel = pixelsData[y][x]
      if (!storedPixel) return

      storedPixel.color = color

      io?.emit('click', storedPixel)
    })

    socket.on('disconnect', () => saveData())
  })
})
