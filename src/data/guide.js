// Teks panduan di beranda. Lihat AGENTS.md bagian 3, "Alur game" dan
// "Yang dilatih".

export const HOW_TO_PLAY = [
  { title: 'Sapa', text: 'Baca cerita tokoh yang datang ke warungmu.' },
  { title: 'Ambil buah', text: 'Ketuk buah sesuai pesanan, lalu bungkus.' },
  { title: 'Hitung', text: 'Tentukan berapa total belanjanya.' },
  { title: 'Kembalian', text: 'Susun kembalian dari laci uang.' },
]

// Bagian "Yang kamu latih" di beranda. `icon` menunjuk gambar di
// components/PracticeIcon.jsx.
export const PRACTICE = [
  { icon: 'count', title: 'Berhitung', text: 'Menjumlah dan mengalikan harga buah.' },
  { icon: 'money', title: 'Uang rupiah', text: 'Menghitung kembalian.' },
  { icon: 'steps', title: 'Teliti dan runtut', text: 'Melayani pembeli langkah demi langkah.' },
  { icon: 'hero', title: 'Kenal pahlawan', text: 'Cerita singkat dari tiap tokoh.' },
]

const TOTAL_HELP = {
  shown: 'Total sudah dihitung di nota',
  guided: 'Pilih total, hasil kali dibantu',
  unguided: 'Pilih total tanpa bantuan',
}

export function describeLevel(level) {
  return [
    `${level.customerCount} pembeli`,
    `${level.fruitTypesPerOrder} jenis buah per pesanan`,
    TOTAL_HELP[level.totalMode],
  ]
}
