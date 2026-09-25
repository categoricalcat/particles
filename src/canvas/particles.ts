import { randomInt } from '../helpers/random'
import { Particle, ParticleContainer, update } from '../Particle'
import { aspect } from '../config'

const [width, height] = aspect
export const PARTICLE_NUMBER = 250_000
console.info('Rendering', PARTICLE_NUMBER, 'particles')

export const stage = new ParticleContainer({
  dynamicProperties: {
    position: true,
  },
})

const r = (d: number) => randomInt(1, d)

export const createParticles = () => {
  for (let i = 0; i < PARTICLE_NUMBER; i++) {
    const p = new Particle(r(width), r(height))

    update(p)

    stage.addParticle(p)
  }
}
