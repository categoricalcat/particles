import { autoDetectRenderer, type Renderer, Ticker } from 'pixi.js'
import { type Particle, update as pUpdate } from '../Particle'
import { PARTICLE_NUMBER, stage } from './particles'

import { aspect } from '../config'

const [width, height] = aspect

export const isInBounds = ({ x, y }: { x: number; y: number }) =>
  x > -1000 || x < width + 1000 || y > -1000 || y < height + 1000

export const update = () => {
  const children = stage.particleChildren
  for (let i = 0; i < PARTICLE_NUMBER; i++)
    pUpdate(children[i] as Particle)
}

Ticker.system.autoStart = false

const view = document.createElement('canvas')
document.body.appendChild(view)

export let renderer: Renderer

export const rendererPromise = autoDetectRenderer({
  width,
  height,
  powerPreference: 'high-performance',
  premultipliedAlpha: false,
  antialias: false,
  canvas: view,
}).then((r) => {
  renderer = r
  return r
})

const loop = () => {
  update()
  renderer.render(stage)
  requestAnimationFrame(loop)
}

export const start = async () => {
  if (!renderer) {
    await rendererPromise
  }
  loop()
}

export const destroy = () => {
  renderer?.destroy()
  stage.destroy({
    children: true,
  })
}
