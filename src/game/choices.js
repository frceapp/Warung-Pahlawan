import { getOrderLines } from './order.js'
import { sample, shuffle } from './random.js'

// Tiga pilihan total belanja: satu benar dan dua pengecoh yang masuk akal.
// Pengecoh meniru salah hitung yang sering terjadi:
// - lupa mengalikan satu baris (dihitung satu buah saja),
// - kelebihan atau kekurangan satu buah di satu baris,
// - salah tambah Rp1.000.
export function createTotalChoices(order, rng) {
  const lines = getOrderLines(order)
  const total = lines.reduce((sum, line) => sum + line.subtotal, 0)

  const candidates = []
  for (const line of lines) {
    if (line.quantity > 1) candidates.push(total - line.subtotal + line.price)
    candidates.push(total + line.price, total - line.price)
  }
  candidates.push(total + 1000, total - 1000)

  let distractors = [...new Set(candidates)].filter(
    (value) => value > 0 && value !== total,
  )
  for (let extra = 2000; distractors.length < 2; extra += 1000) {
    if (!distractors.includes(total + extra)) distractors.push(total + extra)
  }

  return shuffle([total, ...sample(distractors, 2, rng)], rng)
}
