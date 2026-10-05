import { describe, expect, it } from 'vitest'
import { addFruit, checkBag, removeFruit } from './bag.js'

const order = [
  { fruitId: 'apple', quantity: 2 },
  { fruitId: 'banana', quantity: 1 },
]

describe('addFruit dan removeFruit', () => {
  it('menambah dan mengurangi tanpa mengubah kantong lama', () => {
    const empty = {}
    const one = addFruit(empty, 'apple')
    const two = addFruit(one, 'apple')
    expect(empty).toEqual({})
    expect(two).toEqual({ apple: 2 })
    expect(removeFruit(two, 'apple')).toEqual({ apple: 1 })
    expect(removeFruit(one, 'apple')).toEqual({})
  })

  it('tidak membuat jumlah buah negatif', () => {
    expect(removeFruit({}, 'apple')).toEqual({})
    expect(removeFruit({ banana: 1 }, 'apple')).toEqual({ banana: 1 })
  })
})

describe('checkBag', () => {
  it('cocok kalau isi kantong sama dengan pesanan', () => {
    expect(checkBag(order, { apple: 2, banana: 1 })).toEqual({
      isMatch: true,
      missing: [],
      extra: [],
    })
  })

  it('melaporkan buah yang kurang', () => {
    expect(checkBag(order, { apple: 1 })).toEqual({
      isMatch: false,
      missing: [
        { fruitId: 'apple', count: 1 },
        { fruitId: 'banana', count: 1 },
      ],
      extra: [],
    })
  })

  it('melaporkan buah yang lebih, termasuk yang tidak dipesan', () => {
    expect(checkBag(order, { apple: 3, banana: 1, mango: 2 })).toEqual({
      isMatch: false,
      missing: [],
      extra: [
        { fruitId: 'apple', count: 1 },
        { fruitId: 'mango', count: 2 },
      ],
    })
  })

  it('bisa kurang dan lebih sekaligus', () => {
    const result = checkBag(order, { apple: 1, banana: 2 })
    expect(result.missing).toEqual([{ fruitId: 'apple', count: 1 }])
    expect(result.extra).toEqual([{ fruitId: 'banana', count: 1 }])
  })

  it('kantong kosong berarti semua kurang', () => {
    expect(checkBag(order, {}).missing).toHaveLength(2)
  })
})
