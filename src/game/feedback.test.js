import { describe, expect, it } from 'vitest'
import { describeBagProblem } from './feedback.js'

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
