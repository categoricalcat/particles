import {
  Particle as PixiParticle,
  ParticleContainer as PC,
  Texture,
} from 'pixi.js'
import { aspect } from './config'
import assert from './helpers/assert'

const [width, height] = aspect

const canvas = new OffscreenCanvas(
  1,
  1,
) as unknown as HTMLCanvasElement

const ctx = canvas.getContext('2d')
assert(ctx)
ctx.fillStyle = '#FFF'
ctx.fillRect(0, 0, 1, 1)

const WhiteTexture = Texture.from(canvas)

const G = 6.6743015e-11
let mass = 7.34767309e13

const gravity = (c1: [number, number], c2: [number, number]) => {
  const [x1, y1] = c1
  const [x2, y2] = c2

  const dx = x2 - x1
  const dy = y2 - y1

  const d = Math.sqrt(dx ** 2 + dy ** 2)

  const a = (G * mass) / d ** 2

  const ax = (dx / d) * a
  const ay = (dy / d) * a

  mass *= 1 + G * 10

  return { ax, ay, dx, dy }
}

const center = [width / 2, height / 2] as [number, number]

export const update = (p: Particle) => {
  const { ax, ay, dx, dy } = gravity(p.coords, center)

  if (Math.sqrt(dx ** 2 + dy ** 2) <= 50) {
    mass *= 1 + Math.sqrt(G) / 2

    p.vx = 0
    p.vy = 0
    p.position.set(-100000, -100000)
  }

  p.vx += ax
  p.vy += ay
  p.position.set(p.x + p.vx, p.y + p.vy)
}

export class Particle extends PixiParticle {
  vx = -1
  vy = -1

  name: string

  get coords() {
    return [this.x, this.y] as [number, number]
  }

  get position() {
    return {
      set: (x: number, y: number) => {
        this.x = x
        this.y = y
      },
    }
  }

  constructor(x: number, y: number) {
    super(WhiteTexture)

    this.x = x
    this.y = y
    this.name = `${x}${y}`
  }
}

export class ParticleContainer extends PC<Particle> {}
