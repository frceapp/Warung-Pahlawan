import { describe, expect, it } from 'vitest'
import { createSeededRng, randomInt, sample, shuffle } from './random.js'

describe('random', () => {
  it('seed yang sama memberi hasil yang sama', () => {
    const a = createSeededRng(42)
    const b = createSeededRng(42)
    const valuesA = Array.from({ length: 5 }, a)
    expect(Array.from({ length: 5 }, b)).toEqual(valuesA)
    for (const value of valuesA) {
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })

  it('randomInt memakai batas bawah dan atas', () => {
    expect(randomInt(() => 0, 1, 3)).toBe(1)
    expect(randomInt(() => 0.9999, 1, 3)).toBe(3)
  })

  it('shuffle dan sample tidak mengubah daftar asli', () => {
    const items = [1, 2, 3, 4, 5]
    const rng = createSeededRng(7)
    expect([...shuffle(items, rng)].sort()).toEqual(items)
    const picked = sample(items, 3, rng)
    expect(picked).toHaveLength(3)
    expect(new Set(picked).size).toBe(3)
    expect(items).toEqual([1, 2, 3, 4, 5])
  })
})
