import { FRUITS, getFruit } from '../data/fruits.js'
import { randomInt, sample } from './random.js'

export function getLevelFruits(level) {
  return FRUITS.filter((fruit) => fruit.minLevel <= level.id)
}

// Pesanan berisi beberapa jenis buah berbeda, masing-masing 1 sampai
// level.maxPerFruit buah. Contoh: [{ fruitId: 'apple', quantity: 2 }]
export function createOrder(level, rng) {
  const fruits = sample(getLevelFruits(level), level.fruitTypesPerOrder, rng)
  return fruits.map((fruit) => ({
    fruitId: fruit.id,
    quantity: randomInt(rng, 1, level.maxPerFruit),
  }))
}

// Satu baris nota: harga satuan, jumlah, dan hasil kalinya.
export function getOrderLines(order) {
  return order.map(({ fruitId, quantity }) => {
    const { price } = getFruit(fruitId)
    return { fruitId, quantity, price, subtotal: price * quantity }
  })
}

export function calculateTotal(order) {
  return getOrderLines(order).reduce((sum, line) => sum + line.subtotal, 0)
}
