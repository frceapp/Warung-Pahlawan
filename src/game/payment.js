import { DENOMINATIONS, PAYMENT_NOTES } from '../data/money.js'

// Menyusun `amount` dari pecahan yang tersedia (jumlah tiap pecahan tidak
// terbatas) dengan lembar sesedikit mungkin. Mengembalikan daftar pecahan
// dari yang terbesar, atau null kalau tidak bisa disusun.
export function composeAmount(amount, denominations) {
  if (amount === 0) return []
  if (amount < 0) return null

  const unit = 500
  if (amount % unit !== 0) return null
  const steps = amount / unit
  const values = denominations.filter((value) => value % unit === 0)

  const fewest = new Array(steps + 1).fill(Infinity)
  const lastPick = new Array(steps + 1).fill(0)
  fewest[0] = 0
  for (let i = 1; i <= steps; i += 1) {
    for (const value of values) {
      const prev = i - value / unit
      if (prev >= 0 && fewest[prev] + 1 < fewest[i]) {
        fewest[i] = fewest[prev] + 1
        lastPick[i] = value
      }
    }
  }
  if (fewest[steps] === Infinity) return null

  const result = []
  for (let i = steps; i > 0; i -= lastPick[i] / unit) result.push(lastPick[i])
  return result.sort((a, b) => b - a)
}

export function canComposeAmount(amount, denominations) {
  return composeAmount(amount, denominations) !== null
}

// Uang dari pembeli: satu lembar terkecil yang lebih besar dari total,
// atau uang pas.
export function createPayment(total, isExact) {
  if (isExact) {
    return { amount: total, notes: composeAmount(total, DENOMINATIONS), change: 0 }
  }
  const note = PAYMENT_NOTES.find((value) => value > total)
  if (note === undefined) throw new Error(`No payment note above ${total}`)
  return { amount: note, notes: [note], change: note - total }
}

export function sumMoney(values) {
  return values.reduce((sum, value) => sum + value, 0)
}

// Memeriksa kembalian yang disusun anak. Daftar kosong berarti anak memilih
// "tidak perlu kembalian". difference > 0 berarti kembalian kelebihan.
export function checkChange(givenValues, payment) {
  const givenAmount = sumMoney(givenValues)
  return {
    isCorrect: givenAmount === payment.change,
    givenAmount,
    expectedAmount: payment.change,
    difference: givenAmount - payment.change,
  }
}
