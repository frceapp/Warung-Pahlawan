// Kantong belanja disimpan sebagai objek { fruitId: jumlah }.
// Semua fungsi mengembalikan objek baru dan tidak mengubah yang lama.

export function addFruit(bag, fruitId) {
  return { ...bag, [fruitId]: (bag[fruitId] ?? 0) + 1 }
}

export function removeFruit(bag, fruitId) {
  const count = bag[fruitId] ?? 0
  if (count <= 0) return bag
  const next = { ...bag }
  if (count === 1) delete next[fruitId]
  else next[fruitId] = count - 1
  return next
}

// Membandingkan isi kantong dengan pesanan.
// missing: buah yang kurang, extra: buah yang lebih (termasuk yang tidak dipesan).
export function checkBag(order, bag) {
  const missing = []
  const extra = []

  for (const { fruitId, quantity } of order) {
    const count = bag[fruitId] ?? 0
    if (count < quantity) missing.push({ fruitId, count: quantity - count })
    if (count > quantity) extra.push({ fruitId, count: count - quantity })
  }

  const orderedIds = new Set(order.map((item) => item.fruitId))
  for (const [fruitId, count] of Object.entries(bag)) {
    if (!orderedIds.has(fruitId) && count > 0) extra.push({ fruitId, count })
  }

  return { isMatch: missing.length === 0 && extra.length === 0, missing, extra }
}
