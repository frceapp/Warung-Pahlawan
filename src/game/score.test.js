import { describe, expect, it } from 'vitest'
import { calculateStars, getMaxScore, scoreCustomer } from './score.js'

describe('scoreCustomer', () => {
  it('10 poin, dikurangi 2 tiap kesalahan, paling sedikit 4', () => {
    expect(scoreCustomer(0)).toBe(10)
    expect(scoreCustomer(1)).toBe(8)
    expect(scoreCustomer(3)).toBe(4)
    expect(scoreCustomer(4)).toBe(4)
    expect(scoreCustomer(10)).toBe(4)
  })
})

describe('calculateStars', () => {
  it('batas bintang level 1 (maksimum 40)', () => {
    const max = getMaxScore(4)
    expect(max).toBe(40)
    expect(calculateStars(40, max)).toBe(3)
    expect(calculateStars(36, max)).toBe(3)
    expect(calculateStars(34, max)).toBe(2)
    expect(calculateStars(24, max)).toBe(2)
    expect(calculateStars(22, max)).toBe(1)
    expect(calculateStars(16, max)).toBe(1)
  })

  it('batas bintang level 2 (maksimum 50)', () => {
    const max = getMaxScore(5)
    expect(calculateStars(45, max)).toBe(3)
    expect(calculateStars(44, max)).toBe(2)
    expect(calculateStars(30, max)).toBe(2)
    expect(calculateStars(28, max)).toBe(1)
  })

  it('batas bintang level 3 (maksimum 60)', () => {
    const max = getMaxScore(6)
    expect(calculateStars(54, max)).toBe(3)
    expect(calculateStars(52, max)).toBe(2)
    expect(calculateStars(36, max)).toBe(2)
    expect(calculateStars(34, max)).toBe(1)
  })
})
