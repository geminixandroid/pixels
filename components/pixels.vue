<template>
  <div class="picker">
    <input type="color" id="html5colorpicker" v-model="currentColor" />
  </div>
  <table class="table">
    <tr v-for="(row, y) in pixels">
      <td v-for="(pixel, x) in row">
        <div
          class="pixel"
          :key="`${x}-${y}`"
          :id="`${x}-${y}`"
          @click="click(pixel)"
          :style="`background-color: ${pixel.color}`"
        ></div>
      </td>
    </tr>
  </table>
</template>
<script setup lang="ts">
import { io } from 'socket.io-client'
import type { IPixel } from '~/shared/viewModel/iPixel'
const socket = io({ transports: ['polling'] })
const pixels: Ref<IPixel[][]> = ref([])
let currentColor = '#000000'

socket.on('connect', () => {
  socket.emit('initMe', socket.id)
})
socket.on('disconnect', () => {
  pixels.value = []
})

socket.on('connect_error', () => {
  socket.io.opts.transports = ['websocket, polling']
})

socket.on('init', onInit)

socket.on('click', onClick)

function click(pixel: IPixel) {
  const newPixel: IPixel = {
    ...pixel,
    color: pixel.color === currentColor ? '#ffffff' : currentColor,
  }

  socket.emit('click', newPixel)
}

function onInit(initData: IPixel[][]) {
  pixels.value.push(...initData)
}

function onClick(pixel: IPixel) {
  const { x, y, color } = pixel
  pixels.value[y][x] && (pixels.value[y][x].color = color)
}
</script>
<style scoped="true">
.picker {
  text-align: center;
  padding: 16px;
}

.pixel {
  width: 16px;
  height: 16px;
  box-sizing: border-box;
}

.pixel:hover {
  border: 1px solid #b31515;
}

.table {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  border-collapse: collapse;
}

td {
  padding: 0;
  border: 1px solid #d0d0d0;
}

.table td:nth-child(10n) {
  border-right-color: #b0b0b0;
}

.table tr:nth-child(10n) td {
  border-bottom-color: #b0b0b0;
}
</style>
