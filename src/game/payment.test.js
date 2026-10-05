import { describe, expect, it } from 'vitest'
import { LEVELS } from '../data/levels.js'
import { calculateTotal } from './order.js'
import {
  canComposeAmount,
  checkChange,
  composeAmount,
  createPayment,
  sumMoney,
} from './payment.js'
import { allPossibleOrders } from './testUtils.js'

describe('composeAmount', () => {
  it('menyusun jumlah dengan lembar sesedikit mungkin', () => {
    expect(composeAmount(8000, [1000, 2000, 5000])).toEqual([5000, 2000, 1000])
    expect(composeAmount(1500, [500, 1000])).toEqual([1000, 500])
    expect(composeAmount(0, [1000])).toEqual([])
  })

  it('mengembalikan null kalau tidak bisa disusun', () => {
    expect(composeAmount(500, [1000, 2000])).toBeNull()
    expect(composeAmount(-1000, [1000])).toBeNull()
  })
})

describe('createPayment', () => {
  it('membayar dengan satu lembar terkecil yang lebih besar dari total', () => {
    expect(createPayment(1000, false)).toEqual({ amount: 2000, notes: [2000], change: 1000 })
    expect(createPayment(2000, false).amount).toBe(5000)
    expect(createPayment(4500, false).amount).toBe(5000)
    expect(createPayment(5000, false).amount).toBe(10000)
    expect(createPayment(19500, false).amount).toBe(20000)
    expect(createPayment(26000, false).amount).toBe(50000)
  })

  it('uang pas: jumlah sama dengan total dan tanpa kembalian', () => {
    const payment = createPayment(7500, true)
    expect(payment.amount).toBe(7500)
    expect(payment.change).toBe(0)
    expect(sumMoney(payment.notes)).toBe(7500)
  })
})

describe('kembalian selalu bisa disusun dari laci level itu', () => {
  for (const level of LEVELS) {
    it(`level ${level.id}: semua kemungkinan pesanan`, () => {
      const orders = allPossibleOrders(level)
      expect(orders.length).toBeGreaterThan(0)
      for (const order of orders) {
        const total = calculateTotal(order)
        const payment = createPayment(total, false)
        expect(payment.change).toBeGreaterThan(0)
        expect(canComposeAmount(payment.change, level.drawer)).toBe(true)
      }
    })
  }
})

describe('checkChange', () => {
  const payment = createPayment(7000, false) // bayar 10.000, kembali 3.000

  it('benar kalau jumlahnya pas', () => {
    expect(checkChange([2000, 1000], payment)).toEqual({
      isCorrect: true,
      givenAmount: 3000,
      expectedAmount: 3000,
      difference: 0,
    })
    expect(checkChange([1000, 1000, 1000], payment).isCorrect).toBe(true)
  })

  it('melaporkan kembalian yang kurang atau lebih', () => {
    expect(checkChange([2000], payment).difference).toBe(-1000)
    expect(checkChange([5000], payment).difference).toBe(2000)
    expect(checkChange([], payment).isCorrect).toBe(false)
  })

  it('uang pas: "tidak perlu kembalian" adalah jawaban benar', () => {
    const exact = createPayment(7000, true)
    expect(checkChange([], exact).isCorrect).toBe(true)
    expect(checkChange([1000], exact).isCorrect).toBe(false)
  })
})
