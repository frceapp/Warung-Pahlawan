import { describe, expect, it } from 'vitest'
import { LEVELS } from '../data/levels.js'
import { createCustomers } from './customers.js'
import { calculateTotal } from './order.js'
import { canComposeAmount } from './payment.js'
import { createSeededRng } from './random.js'

describe('createCustomers', () => {
  for (const level of LEVELS) {
    it(`level ${level.id}: jumlah pembeli, tokoh, fun fact, dan pembayaran`, () => {
      const expectedExact = Math.round(level.customerCount * level.exactPaymentRatio)
      for (let seed = 1; seed <= 200; seed += 1) {
        const customers = createCustomers(level, createSeededRng(seed))
        expect(customers).toHaveLength(level.customerCount)
        expect(new Set(customers.map((c) => c.character.id)).size).toBe(
          level.customerCount,
        )

        let exactCount = 0
        for (const customer of customers) {
          expect(customer.character.facts).toContain(customer.fact)
          expect(customer.total).toBe(calculateTotal(customer.order))
          const { payment, total } = customer
          if (payment.change === 0) {
            exactCount += 1
            expect(payment.amount).toBe(total)
          } else {
            expect(payment.amount).toBeGreaterThan(total)
            expect(payment.notes).toHaveLength(1)
          }
          expect(canComposeAmount(payment.change, level.drawer)).toBe(true)
        }
        expect(exactCount).toBe(expectedExact)
      }
    })
  }

  it('level 1 tidak pernah uang pas; level 2 dan 3 tepat satu pembeli', () => {
    expect(LEVELS.map((l) => Math.round(l.customerCount * l.exactPaymentRatio))).toEqual([
      0, 1, 1,
    ])
  })

  it('hasilnya sama untuk seed yang sama', () => {
    expect(createCustomers(LEVELS[1], createSeededRng(11))).toEqual(
      createCustomers(LEVELS[1], createSeededRng(11)),
    )
  })
})
