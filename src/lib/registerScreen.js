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

// Gerak mesin kasir untuk tiap langkah. Mesin hanya bereaksi pada aksi
// anak: setelah pesanan dibungkus (langkah Hitung) tombolnya berkedip dan
// kertas nota keluar dari atas; nota itu lalu ada di meja, jadi kertasnya
// sudah disobek di langkah berikutnya. Di langkah Kembalian lacinya terbuka
// dan menutup lagi setelah kembalian benar.
export function getRegisterMotion(step) {
  return {
    ringing: step === 'count',
    paperOut: step === 'count',
    drawerOpen: step === 'change',
  }
}
