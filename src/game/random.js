// Semua fungsi acak menerima `rng`: fungsi tanpa argumen yang mengembalikan
// angka 0 <= x < 1, seperti Math.random. Tes memakai rng tetap.

export function randomInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1))
}

export function shuffle(items, rng) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randomInt(rng, 0, i)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function sample(items, count, rng) {
  return shuffle(items, rng).slice(0, count)
}

// Pembangkit angka acak kecil yang hasilnya selalu sama untuk seed yang sama
// (mulberry32). Dipakai tes dan bisa dipakai untuk mengulang permainan.
export function createSeededRng(seed) {
  let state = seed >>> 0
  return function rng() {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
