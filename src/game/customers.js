import { CHARACTERS } from '../data/characters.js'
import { calculateTotal, createOrder } from './order.js'
import { createPayment } from './payment.js'
import { randomInt, sample, shuffle } from './random.js'

// Menyiapkan semua pembeli untuk satu level: tokoh yang berbeda-beda,
// satu fun fact, pesanan, total, dan uang yang dibayarkan.
// Banyak pembeli yang membayar uang pas = customerCount x exactPaymentRatio,
// dibulatkan (level 2 dan 3: satu pembeli).
export function createCustomers(level, rng, characters = CHARACTERS) {
  const count = level.customerCount
  const chosen = shuffle(characters, rng).slice(0, count)
  const exactCount = Math.round(count * level.exactPaymentRatio)
  const exactIndexes = new Set(
    sample([...Array(count).keys()], exactCount, rng),
  )

  return chosen.map((character, index) => {
    const order = createOrder(level, rng)
    const total = calculateTotal(order)
    return {
      character,
      fact: character.facts[randomInt(rng, 0, character.facts.length - 1)],
      order,
      total,
      payment: createPayment(total, exactIndexes.has(index)),
    }
  })
}
