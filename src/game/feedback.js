import { getFruit } from '../data/fruits.js'
import { formatRupiah } from './format.js'

// Kalimat umpan balik untuk anak. Pesan salah menjelaskan apa yang kurang
// dan apa yang harus dilakukan, tanpa menyalahkan.

function listFruits(items) {
  const parts = items.map(({ fruitId, count }) => `${count} ${getFruit(fruitId).name.toLowerCase()}`)
  if (parts.length <= 1) return parts.join('')
  if (parts.length === 2) return parts.join(' dan ')
  // Tiga atau lebih: koma sebelum "dan", sesuai ejaan baku (EYD).
  return `${parts.slice(0, -1).join(', ')}, dan ${parts[parts.length - 1]}`
}

export function describeBagProblem({ missing, extra }) {
  const sentences = []
  if (missing.length > 0) sentences.push(`Masih kurang ${listFruits(missing)}.`)
  if (extra.length > 0) sentences.push(`Ada ${listFruits(extra)} yang lebih.`)
  if (missing.length > 0 && extra.length > 0) {
    sentences.push('Tambah yang kurang dan keluarkan yang lebih, lalu bungkus lagi.')
  } else if (missing.length > 0) {
    sentences.push('Ambil lagi dari keranjang, lalu bungkus lagi.')
  } else {
    sentences.push('Keluarkan yang lebih dari kantong, lalu bungkus lagi.')
  }
  return sentences.join(' ')
}

export const EMPTY_BAG_MESSAGE =
  'Kantong belanja masih kosong. Ketuk buah di keranjang untuk memasukkannya.'

export const BAG_MATCH_MESSAGE = 'Pesanan sudah pas dan dibungkus. Sekarang hitung totalnya.'

export function describeTotalCorrect(total) {
  return `Total belanjanya ${formatRupiah(total)}. Sekarang terima uang dari pembeli.`
}

export function describeWrongTotal(amount) {
  return `${formatRupiah(amount)} belum tepat. Hitung lagi: harga satu buah kali jumlahnya, lalu jumlahkan semua baris.`
}

export const EMPTY_CHANGE_MESSAGE =
  'Belum ada uang kembalian. Ketuk uang di laci, atau pilih "Tidak perlu kembalian" kalau uangnya pas.'

// result dari checkChange, payment dari createPayment.
export function describeChange(result, payment) {
  if (result.isCorrect) {
    return payment.change === 0
      ? 'Uangnya pas, jadi tidak perlu kembalian.'
      : `Kembaliannya ${formatRupiah(payment.change)}, pas sekali.`
  }
  if (payment.change === 0) {
    return 'Uang pembeli sama dengan total belanja. Kembalikan uang ke laci, lalu pilih "Tidak perlu kembalian".'
  }
  if (result.givenAmount === 0) {
    return 'Uang pembeli lebih besar dari total belanja, jadi pembeli perlu kembalian. Ambil uang dari laci.'
  }
  if (result.difference < 0) {
    return 'Kembaliannya masih kurang. Tambah uang dari laci, lalu berikan lagi.'
  }
  return 'Kembaliannya terlalu banyak. Kembalikan sebagian uang ke laci, lalu berikan lagi.'
}

export function describeServed(points) {
  return `Terima kasih! Kamu dapat ${points} poin dari pembeli ini.`
}
