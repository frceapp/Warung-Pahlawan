import { describe, expect, it } from 'vitest'
import { FRONT_ARM } from './characterParts.jsx'
import { WAVE_KEYFRAMES, WAVE_PEAK, WAVE_S, WAVE_TIMES, wavePose } from './wavePose.js'

// Arah dunia tangan: handAngle + putaran lengan atas + lengan bawah + tangan.
const handWorld = (pose) => (((FRONT_ARM.handAngle + pose.upper + pose.fore + pose.hand) % 360) + 360) % 360

describe('pose melambai dari sendi pose istirahat', () => {
  it('siku terangkat ke samping kira-kira setinggi bahu', () => {
    const [ex, ey] = WAVE_PEAK.elbow
    expect(ex).toBeGreaterThan(FRONT_ARM.shoulder[0] + 10)
    expect(Math.abs(ey - FRONT_ARM.shoulder[1])).toBeLessThan(3)
  })

  it('tangan di samping rahang, di luar kotak kepala (x 24 sampai 76) dengan jarak', () => {
    const [hx, hy] = WAVE_PEAK.handAt
    // Setengah ukuran tangan 5,8; jarak minimal 4 dari tepi kepala.
    expect(hx - 5.8).toBeGreaterThanOrEqual(76 + 4)
    expect(hy).toBeGreaterThan(60)
    expect(hy).toBeLessThan(70)
  })

  it('lengan bawah condong ke atas dan ke luar, berayun 15 derajat', () => {
    const out = wavePose(-25)
    const inward = wavePose(-55)
    expect(out.fore - WAVE_PEAK.fore).toBeCloseTo(15, 5)
    expect(WAVE_PEAK.fore - inward.fore).toBeCloseTo(15, 5)
    expect(inward.handAt[1]).toBeLessThan(WAVE_PEAK.handAt[1])
  })

  it('telapak tangan tetap tegak (jari ke atas) di semua bingkai lambaian', () => {
    const frames = WAVE_KEYFRAMES.upper.map((upper, i) => ({ upper, fore: WAVE_KEYFRAMES.fore[i], hand: WAVE_KEYFRAMES.hand[i] }))
    frames.slice(1, -1).forEach((pose) => expect(handWorld(pose)).toBeCloseTo(180, 5))
    // Mulai dan selesai di pose istirahat (bertumpu di meja).
    expect(frames[0]).toEqual({ upper: 0, fore: 0, hand: 0 })
    expect(frames.at(-1)).toEqual({ upper: 0, fore: 0, hand: 0 })
  })

  it('dua kali ayunan dalam sekitar 0,8 detik', () => {
    const swingStart = WAVE_TIMES[1] * WAVE_S
    const swingEnd = WAVE_TIMES[6] * WAVE_S
    expect(swingEnd - swingStart).toBeCloseTo(0.8, 2)
    const fore = WAVE_KEYFRAMES.fore.slice(2, 6)
    expect(fore[0]).toBeGreaterThan(fore[1])
    expect(fore[2]).toBeGreaterThan(fore[3])
  })
})
