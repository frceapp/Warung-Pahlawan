import { describe, expect, it } from 'vitest'
import { describeBagProblem, describeChange, describeWrongTotal } from './feedback.js'
import { checkChange, createPayment } from './payment.js'

describe('describeBagProblem', () => {
  it('menyebut buah yang kurang', () => {
    expect(
      describeBagProblem({ missing: [{ fruitId: 'apple', count: 2 }], extra: [] }),
    ).toBe('Masih kurang 2 apel. Ambil lagi dari keranjang, lalu bungkus lagi.')
  })

  it('menyebut buah yang lebih', () => {
    expect(
      describeBagProblem({
        missing: [],
        extra: [
          { fruitId: 'banana', count: 1 },
          { fruitId: 'mango', count: 2 },
        ],
      }),
    ).toBe('Ada 1 pisang dan 2 mangga yang lebih. Keluarkan yang lebih dari kantong, lalu bungkus lagi.')
  })

  it('memakai koma sebelum "dan" untuk tiga jenis buah', () => {
    expect(
      describeBagProblem({
        missing: [
          { fruitId: 'watermelon', count: 3 },
          { fruitId: 'orange', count: 3 },
          { fruitId: 'banana', count: 4 },
        ],
        extra: [],
      }),
    ).toBe('Masih kurang 3 semangka, 3 jeruk, dan 4 pisang. Ambil lagi dari keranjang, lalu bungkus lagi.')
  })

  it('menyebut keduanya sekaligus', () => {
    expect(
      describeBagProblem({
        missing: [{ fruitId: 'orange', count: 1 }],
        extra: [{ fruitId: 'rambutan', count: 3 }],
      }),
    ).toBe(
      'Masih kurang 1 jeruk. Ada 3 rambutan yang lebih. Tambah yang kurang dan keluarkan yang lebih, lalu bungkus lagi.',
    )
  })
})

describe('describeChange', () => {
  const payment = createPayment(7000, false)
  const exact = createPayment(7000, true)

  it('benar', () => {
    expect(describeChange(checkChange([2000, 1000], payment), payment)).toBe(
      'Kembaliannya Rp3.000, pas sekali.',
    )
    expect(describeChange(checkChange([], exact), exact)).toBe(
      'Uangnya pas, jadi tidak perlu kembalian.',
    )
  })

  it('menjelaskan yang salah dan apa yang harus dilakukan', () => {
    expect(describeChange(checkChange([1000], payment), payment)).toMatch(/masih kurang. Tambah/)
    expect(describeChange(checkChange([5000], payment), payment)).toMatch(/terlalu banyak. Kembalikan/)
    expect(describeChange(checkChange([], payment), payment)).toMatch(/perlu kembalian/)
    expect(describeChange(checkChange([1000], exact), exact)).toMatch(/Tidak perlu kembalian/)
  })
})

describe('describeWrongTotal', () => {
  it('menyebut angka yang dipilih dan cara menghitung', () => {
    expect(describeWrongTotal(5000)).toBe(
      'Rp5.000 belum tepat. Hitung lagi: harga satu buah kali jumlahnya, lalu jumlahkan semua baris.',
    )
  })
})
