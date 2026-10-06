import { importWithRetry } from '../../lib/importWithRetry.js'

// Data dekorasi latar dimuat terpisah per level, jadi hanya level yang sedang
// dimainkan yang diunduh. Promise disimpan supaya `use()` di WarungScene
// selalu menerima promise yang sama. Setelah selesai, promise ditandai
// `status` dan `value` (cara yang dikenali React), jadi `use()` langsung
// memakai datanya tanpa menunda satu frame pun. Layar loading menunggu promise
// ini sebelum pintu warung dibuka. Kalau gagal dimuat, promise dibuang dari
// simpanan supaya "Coba lagi" memuat ulang.
const LOADERS = {
  1: () => import('./decor/level1.js'),
  2: () => import('./decor/level2.js'),
  3: () => import('./decor/level3.js'),
}
const PLAIN = { wall: 'plain', items: [] }
const cache = new Map()

function markFulfilled(promise, value) {
  promise.status = 'fulfilled'
  promise.value = value
  return value
}

export function loadDecor(levelId) {
  if (!cache.has(levelId)) {
    const load = LOADERS[levelId]
    const promise = load
      ? importWithRetry(load).then(
          (module) => markFulfilled(promise, module.default),
          (error) => {
            cache.delete(levelId)
            throw error
          },
        )
      : Promise.resolve(PLAIN).then((value) => markFulfilled(promise, value))
    cache.set(levelId, promise)
  }
  return cache.get(levelId)
}
