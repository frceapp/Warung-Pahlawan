import { describe, expect, it } from 'vitest'
import { LEVELS } from '../data/levels.js'
import { createTotalChoices } from './choices.js'
import { calculateTotal, createOrder } from './order.js'
import { createSeededRng } from './random.js'
import { allPossibleOrders } from './testUtils.js'

describe('createTotalChoices', () => {
  for (const level of LEVELS) {
    it(`level ${level.id}: tiga pilihan berbeda, satu benar, semua masuk akal`, () => {
      const rng = createSeededRng(level.id)
      for (const order of allPossibleOrders(level)) {
        const total = calculateTotal(order)
        const choices = createTotalChoices(order, rng)
        expect(choices).toHaveLength(3)
        expect(new Set(choices).size).toBe(3)
        expect(choices.filter((value) => value === total)).toHaveLength(1)
        for (const value of choices) {
          expect(value).toBeGreaterThan(0)
          expect(value % 500).toBe(0)
          expect(Math.abs(value - total)).toBeLessThanOrEqual(
            Math.max(5000 * 3, total),
          )
        }
      }
    })
  }

  it('memakai pengecoh "lupa mengalikan" kalau ada', () => {
    const order = [{ fruitId: 'apple', quantity: 3 }] // benar 6.000
    const seen = new Set()
    for (let seed = 1; seed <= 50; seed += 1) {
      for (const value of createTotalChoices(order, createSeededRng(seed))) seen.add(value)
    }
    expect(seen).toContain(2000) // lupa dikali 3
    expect(seen).toContain(8000) // kelebihan satu apel
  })

  it('hasilnya sama untuk seed yang sama', () => {
    const level = LEVELS[2]
    const order = createOrder(level, createSeededRng(3))
    expect(createTotalChoices(order, createSeededRng(5))).toEqual(
      createTotalChoices(order, createSeededRng(5)),
    )
  })
})
