import { start } from './canvas/app'
import { createParticles } from './canvas/particles'

createParticles()

window.onload = () => {
  void start()
}
