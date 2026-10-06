import { importWithRetry } from '../../lib/importWithRetry.js'

// Pemuat berkas karakter anime (dimuat terpisah dari bundel awal).
// Beranda memanggil loadAnimeCharacter() lebih awal. Setelah selesai,
// getLoadedAnimeCharacter() mengembalikan komponennya sehingga CustomerStage
// bisa langsung merendernya tanpa menunggu Suspense; React.lazy hanya
// dipakai kalau berkasnya belum selesai dimuat.
let loaded = null

export function loadAnimeCharacter() {
  return importWithRetry(() => import('./AnimeCharacter.jsx')).then((module) => {
    loaded = module.default
    return module
  })
}

export function getLoadedAnimeCharacter() {
  return loaded
}
