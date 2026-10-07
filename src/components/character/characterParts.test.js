import { describe, expect, it } from 'vitest'
import { ARM_JOINTS, COUNTER_Y, FRONT_ARM, SIDE_ARM } from './characterParts.jsx'

// Badan tampak depan selebar x 34 sampai 66 di pundak (TORSO_PATH).
const TORSO_LEFT = 34
const TORSO_RIGHT = 66

describe('lengan tampak depan (pose bertumpu di meja kasir)', () => {
  it('lengan atas menempel di pundak badan', () => {
    const [x, y] = FRONT_ARM.shoulder
    expect(x).toBeGreaterThan(TORSO_LEFT)
    expect(x).toBeLessThan(TORSO_RIGHT)
    expect(y).toBeGreaterThanOrEqual(71)
    expect(y).toBeLessThanOrEqual(80)
  })

  it('siku menekuk ke luar badan, lengan bawah menuju tengah', () => {
    const [shoulderX] = FRONT_ARM.shoulder
    const [elbowX, elbowY] = FRONT_ARM.elbow
    const [handX, handY] = FRONT_ARM.hand
    expect(elbowX).toBeGreaterThan(shoulderX)
    expect(handX).toBeLessThan(elbowX)
    expect(handY).toBeGreaterThan(elbowY)
  })

  it('tangan bertumpu di tepi meja: sebagian di atas, sebagian di depan meja', () => {
    const [, handY] = FRONT_ARM.hand
    // Tangan (sarung tangan) setinggi sekitar 10 satuan di sekitar titik tangan.
    expect(handY - 4.4).toBeLessThan(COUNTER_Y)
    expect(handY + 5.8).toBeGreaterThan(COUNTER_Y)
    expect(handY + 5.8).toBeLessThan(COUNTER_Y + 12)
  })

  it('titik putar animasi sama dengan bentuk yang digambar', () => {
    expect(ARM_JOINTS.shoulder).toEqual(FRONT_ARM.shoulder)
    expect(ARM_JOINTS.elbow).toEqual(FRONT_ARM.elbow)
    expect(ARM_JOINTS.sideShoulder).toEqual(SIDE_ARM.shoulder)
    expect(ARM_JOINTS.sideElbow).toEqual(SIDE_ARM.elbow)
  })
})

describe('bentuk lengan', () => {
  it('lengan atas, lengan bawah, dan manset berupa bentuk tertutup', () => {
    for (const arm of [FRONT_ARM, SIDE_ARM]) {
      for (const d of [arm.upper, arm.lower, arm.cuff]) {
        expect(d).toMatch(/^M[\d. -]+/)
        expect(d.trim().endsWith('Z')).toBe(true)
      }
    }
  })

  it('tampak samping: tangan di depan badan (arah wajah) dan di bawah siku', () => {
    const [shoulderX] = SIDE_ARM.shoulder
    const [, elbowY] = SIDE_ARM.elbow
    const [handX, handY] = SIDE_ARM.hand
    expect(handX).toBeGreaterThan(shoulderX)
    expect(handY).toBeGreaterThan(elbowY)
  })
})
