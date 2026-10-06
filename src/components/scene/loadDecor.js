// Data dekorasi latar dimuat terpisah per level, jadi hanya level yang sedang
// dimainkan yang diunduh. Promise disimpan supaya `use()` di WarungScene
// selalu menerima promise yang sama. Kalau gagal dimuat, latar tetap polos.
const LOADERS = {
  1: () => import('./decor/level1.js'),
  2: () => import('./decor/level2.js'),
  3: () => import('./decor/level3.js'),
}
const PLAIN = { wall: 'plain', floor: 'tiles', items: [] }
const cache = new Map()

export function loadDecor(levelId) {
  if (!cache.has(levelId)) {
    const load = LOADERS[levelId]
    cache.set(
      levelId,
      load ? load().then((module) => module.default, () => PLAIN) : Promise.resolve(PLAIN),
    )
  }
  return cache.get(levelId)
}
