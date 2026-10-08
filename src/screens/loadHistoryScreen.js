import { loadFonts } from '../lib/fonts.js'
import { importWithRetry } from '../lib/importWithRetry.js'

// Pemuat halaman "Semua riwayat" (dimuat terpisah dari bundel awal). Beranda
// mulai memuatnya saat tombol "Lihat semua" disentuh atau difokus.
export function loadHistoryScreen() {
  return Promise.all([importWithRetry(() => import('./HistoryScreen.jsx')), loadFonts()]).then(
    ([module]) => module,
  )
}
