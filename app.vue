<template>
  <div style="text-align: center; padding-bottom: 12px">
    <a href="mailto:geminixandroid@gmail.com">geminixandroid@gmail.com</a>
  </div>
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
import type { IPixel } from './shared/viewModel/iPixel'
import { io, Socket } from 'socket.io-client'
let currentColor = '#000000'

const pixels: Ref<IPixel[][]> = ref([])
let socket: Socket

onMounted(() => {
  socket = io({ transports: ['polling'] })

  socket.on('connect', () => {
    socket.emit('initMe', socket.id)
  })
  socket.on('disconnect', () => {
    pixels.value = []
  })

  socket.on('connect_error', () => {
    socket.io.opts.transports = ['polling', 'websocket']
  })

  socket.on('init', onInit)
  socket.on('click', onClick)
})

function click(pixel: IPixel) {
  socket.emit('click', <IPixel>{
    ...pixel,
    color: currentColor,
  })
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
