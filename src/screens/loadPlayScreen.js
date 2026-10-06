import { loadAnimeCharacter } from '../components/character/loadAnimeCharacter.js'
import { loadDecor } from '../components/scene/loadDecor.js'
import { loadFonts } from '../lib/fonts.js'
import { importWithRetry } from '../lib/importWithRetry.js'
import { loadMotionFeatures } from '../lib/loadMotionFeatures.js'

// Pemuat layar permainan (dimuat terpisah dari bundel awal supaya beranda
// lebih ringan). Setelah selesai, getLoadedPlayScreen() mengembalikan
// komponennya sehingga App bisa langsung merendernya tanpa Suspense.
let loaded = null

export function loadPlayScreen() {
  return importWithRetry(() => import('./PlayScreen.jsx')).then((module) => {
    loaded = module.default
    return module
  })
}

export function getLoadedPlayScreen() {
  return loaded
}

// Semua yang harus siap sebelum pintu warung dibuka: layar permainan (berisi
// meja kasir dan latar), data dekorasi level, berkas karakter pembeli (berisi
// kedelapan tokoh), fitur animasi Motion, dan font. Beranda memanggilnya lebih
// awal (saat senggang dan saat tombol level disentuh atau difokus), jadi saat
// anak memilih level biasanya semuanya sudah ada di cache.
export function preparePlayScreen(levelId) {
  return Promise.all([
    loadPlayScreen(),
    loadDecor(levelId),
    loadAnimeCharacter(),
    loadMotionFeatures(),
    loadFonts(),
  ])
}
