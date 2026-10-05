// Teks panduan di beranda. Lihat AGENTS.md bagian 3, "Alur game" dan
// "Hubungan dengan konsep coding".

export const HOW_TO_PLAY = [
  { title: 'Sapa', text: 'Baca cerita tokoh yang datang ke warungmu.' },
  { title: 'Ambil buah', text: 'Ketuk buah sesuai pesanan, lalu bungkus.' },
  { title: 'Hitung', text: 'Tentukan berapa total belanjanya.' },
  { title: 'Kembalian', text: 'Susun kembalian dari laci uang.' },
]

export const CODING_CONCEPTS = [
  {
    name: 'Urutan',
    term: 'sequence',
    text: 'Kamu melayani pembeli dengan empat langkah yang urutannya selalu sama. Program komputer juga berjalan langkah demi langkah.',
  },
  {
    name: 'Perulangan',
    term: 'loop',
    text: 'Pembeli pesan 3 apel? Kamu mengulang "ambil apel" sebanyak 3 kali.',
  },
  {
    name: 'Percabangan',
    term: 'if/else',
    text: 'Jika uang pembeli pas, tidak perlu kembalian. Jika lebih, kamu menghitung kembaliannya.',
  },
  {
    name: 'Variabel',
    term: 'variable',
    text: 'Total dan kembalian berubah untuk tiap pembeli, seperti kotak yang isinya bisa diganti.',
  },
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
