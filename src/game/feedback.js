import { getFruit } from '../data/fruits.js'

// Kalimat umpan balik untuk anak. Pesan salah menjelaskan apa yang kurang
// dan apa yang harus dilakukan, tanpa menyalahkan.

function listFruits(items) {
  const parts = items.map(({ fruitId, count }) => `${count} ${getFruit(fruitId).name.toLowerCase()}`)
  if (parts.length <= 1) return parts.join('')
  return `${parts.slice(0, -1).join(', ')} dan ${parts[parts.length - 1]}`
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
