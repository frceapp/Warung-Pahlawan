import { describe, expect, it } from 'vitest'
import { loadBestStars, recordStars, saveBestStars, STORAGE_KEY } from './progress.js'

function createMemoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
  }
}

const brokenStorage = {
  getItem() {
    throw new Error('blocked')
  },
  setItem() {
    throw new Error('blocked')
  },
}

describe('bintang terbaik', () => {
  it('menyimpan dan membaca kembali', () => {
    const storage = createMemoryStorage()
    expect(loadBestStars(storage)).toEqual({})
    expect(saveBestStars(storage, { 1: 2, 3: 3 })).toBe(true)
    expect(loadBestStars(storage)).toEqual({ 1: 2, 3: 3 })
  })

  it('hanya menyimpan bintang yang lebih baik', () => {
    const best = { 1: 2 }
    expect(recordStars(best, 1, 1)).toBe(best)
    expect(recordStars(best, 1, 2)).toBe(best)
    expect(recordStars(best, 1, 3)).toEqual({ 1: 3 })
    expect(recordStars(best, 2, 1)).toEqual({ 1: 2, 2: 1 })
  })

  it('tetap jalan tanpa localStorage', () => {
    expect(loadBestStars(null)).toEqual({})
    expect(saveBestStars(null, { 1: 3 })).toBe(false)
  })

  it('tetap jalan kalau localStorage melempar error', () => {
    expect(loadBestStars(brokenStorage)).toEqual({})
    expect(saveBestStars(brokenStorage, { 1: 3 })).toBe(false)
  })

  it('mengabaikan isi yang rusak atau tidak masuk akal', () => {
    expect(loadBestStars(createMemoryStorage({ [STORAGE_KEY]: 'bukan json' }))).toEqual({})
    expect(loadBestStars(createMemoryStorage({ [STORAGE_KEY]: '[3]' }))).toEqual({})
    expect(
      loadBestStars(createMemoryStorage({ [STORAGE_KEY]: '{"1":3,"2":9,"3":"2"}' })),
    ).toEqual({ 1: 3 })
  })
})
