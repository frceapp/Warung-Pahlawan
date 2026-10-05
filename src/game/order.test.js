import { describe, expect, it } from 'vitest'
import { getLevel, LEVELS } from '../data/levels.js'
import { calculateTotal, createOrder, getLevelFruits, getOrderLines } from './order.js'
import { createSeededRng } from './random.js'

describe('getLevelFruits', () => {
  it('membuka buah sesuai level', () => {
    const names = (id) => getLevelFruits(getLevel(id)).map((fruit) => fruit.name)
    expect(names(1)).toEqual(['Pisang', 'Apel', 'Mangga'])
    expect(names(2)).toEqual(['Pisang', 'Apel', 'Mangga', 'Semangka'])
    expect(names(3)).toEqual(['Pisang', 'Apel', 'Mangga', 'Semangka', 'Rambutan', 'Jeruk'])
  })
})

describe('createOrder', () => {
  for (const level of LEVELS) {
    it(`mengikuti aturan level ${level.id}`, () => {
      const allowed = getLevelFruits(level).map((fruit) => fruit.id)
      for (let seed = 1; seed <= 300; seed += 1) {
        const order = createOrder(level, createSeededRng(seed))
        expect(order).toHaveLength(level.fruitTypesPerOrder)
        expect(new Set(order.map((item) => item.fruitId)).size).toBe(order.length)
        for (const { fruitId, quantity } of order) {
          expect(allowed).toContain(fruitId)
          expect(quantity).toBeGreaterThanOrEqual(1)
          expect(quantity).toBeLessThanOrEqual(level.maxPerFruit)
        }
      }
    })
  }

  it('hasilnya sama untuk seed yang sama', () => {
    const level = getLevel(3)
    expect(createOrder(level, createSeededRng(9))).toEqual(
      createOrder(level, createSeededRng(9)),
    )
  })
})

describe('calculateTotal', () => {
  it('menjumlahkan harga kali jumlah tiap baris', () => {
    expect(calculateTotal([{ fruitId: 'apple', quantity: 3 }])).toBe(6000)
    expect(
      calculateTotal([
        { fruitId: 'banana', quantity: 2 },
        { fruitId: 'watermelon', quantity: 1 },
      ]),
    ).toBe(7000)
    expect(
      calculateTotal([
        { fruitId: 'rambutan', quantity: 3 },
        { fruitId: 'orange', quantity: 2 },
        { fruitId: 'mango', quantity: 4 },
      ]),
    ).toBe(16500)
  })

  it('getOrderLines memberi hasil kali tiap baris untuk bantuan level 2', () => {
    expect(getOrderLines([{ fruitId: 'mango', quantity: 2 }])).toEqual([
      { fruitId: 'mango', quantity: 2, price: 3000, subtotal: 6000 },
    ])
  })
})
