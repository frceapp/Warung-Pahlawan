import { getLevelFruits } from './order.js'

// Semua kombinasi pesanan yang mungkin untuk satu level.
export function allPossibleOrders(level) {
  const fruits = getLevelFruits(level)
  const orders = []

  function pickFruits(start, picked) {
    if (picked.length === level.fruitTypesPerOrder) {
      pickQuantities(picked, [])
      return
    }
    for (let i = start; i < fruits.length; i += 1) {
      pickFruits(i + 1, [...picked, fruits[i]])
    }
  }

  function pickQuantities(picked, order) {
    if (order.length === picked.length) {
      orders.push(order)
      return
    }
    for (let quantity = 1; quantity <= level.maxPerFruit; quantity += 1) {
      pickQuantities(picked, [
        ...order,
        { fruitId: picked[order.length].id, quantity },
      ])
    }
  }

  pickFruits(0, [])
  return orders
}
