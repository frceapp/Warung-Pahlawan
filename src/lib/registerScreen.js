import { formatRupiah } from '../game/format.js'

// Teks di layar mesin kasir untuk tiap langkah. Di level 2 dan 3 anak memilih
// sendiri total belanjanya, jadi total baru tampil setelah jawabannya benar
// (langkah Kembalian). Di level 1 total memang sudah tertulis di nota.
export function getRegisterScreen(step, totalMode, total) {
  if (step === 'finished') return 'Tutup'
  if (step === 'greet' || step === 'pick') return 'Rp ?'
  if (step === 'count' && totalMode !== 'shown') return 'Rp ?'
  return formatRupiah(total)
}
