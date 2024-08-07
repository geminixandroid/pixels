<template>
  <div>Header</div>
  <div class="layout">
    <div class="palette">
      <input type="color" id="html5colorpicker" v-model="currentColor" />
    </div>
    <div class="canvas">
      <div v-for="(row, index1) in pixels">
        <div v-for="(pixel, index2) in row">
          <div
            class="pixel"
            :key="`${index1}-${index2}`"
            @click="click(pixel)"
            :style="`background-color: ${pixel.color}`"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { socket } from '~/components/socket'

interface IPixel {
  x: number
  y: number
  color: string
}

let currentColor = '#000000'

const pixels = ref(generatePixels(100, 100))

function generatePixels(rows: number, columns: number): IPixel[][] {
  const arr: IPixel[][] = []
  for (let y = 0; y < rows; y++) {
    arr[y] = []
    for (let x = 0; x < columns; x++) {
      arr[y][x] = {
        x,
        y,
        color: '#fafafa',
      }
    }
  }

  return arr
}

socket.on('click', onClick)

function click(pixel: IPixel) {
  socket.emit('click', <IPixel>{
    ...pixel,
    color: currentColor,
  })
}

function onClick(pixel: IPixel) {
  const { x, y, color } = pixel
  pixels.value[y][x] && (pixels.value[y][x].color = color)
}
</script>
<style scoped="true">
.pixel {
  width: 16px;
  height: 16px;
  float: left;
  box-sizing: border-box;
  border: 1px solid #d4d4d4;
}

.pixel:hover {
  border: 1px solid #b31515;
}

.layout {
  display: flex;
}

.palette {
  padding: 32px;
}

.canvas {
  display: flex;
}
</style>
