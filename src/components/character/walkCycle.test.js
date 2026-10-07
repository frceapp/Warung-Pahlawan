import { describe, expect, it } from 'vitest'
import { footstepTimes, WALK_IN_STEPS, WALK_OUT_STEPS, WALK_S, STEP_S, LEAVE_STEPS } from './walkCycle.js'

describe('bunyi langkah kaki selaras dengan ayunan langkah', () => {
  it('memilih titik saat badan turun (kaki menapak)', () => {
    expect(footstepTimes([0, 0.5, 1], [0, 1, 0], 2)).toEqual([1])
  })

  it('berjalan masuk: enam tapak kaki dalam 1,2 detik, berurutan', () => {
    expect(WALK_IN_STEPS).toEqual([0.09, 0.27, 0.456, 0.644, 0.852, 1.086])
    expect(Math.max(...WALK_IN_STEPS)).toBeLessThan(WALK_S)
  })

  it('berjalan keluar: dua tapak tiap langkah, diulang', () => {
    expect(WALK_OUT_STEPS).toEqual([0.1, 0.3, 0.5, 0.7])
    expect(WALK_OUT_STEPS).toHaveLength(2 * LEAVE_STEPS)
    expect(Math.max(...WALK_OUT_STEPS)).toBeLessThan(STEP_S * LEAVE_STEPS)
  })
})
