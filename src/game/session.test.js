import { describe, expect, it } from 'vitest'
import { getLevel } from '../data/levels.js'
import { createSeededRng } from './random.js'
import { createSession, getCurrentCustomer, sessionReducer } from './session.js'

function play(state, ...actions) {
  return actions.reduce(sessionReducer, state)
}

function fillBag(state) {
  const actions = getCurrentCustomer(state).order.flatMap(({ fruitId, quantity }) =>
    Array.from({ length: quantity }, () => ({ type: 'addFruit', fruitId })),
  )
  return play(state, ...actions)
}

describe('sessionReducer: sapa dan ambil buah', () => {
  const start = createSession(getLevel(2), createSeededRng(4))

  it('mulai dari langkah sapa dengan kantong kosong', () => {
    expect(start.step).toBe('greet')
    expect(start.bag).toEqual({})
    expect(start.customers).toHaveLength(5)
  })

  it('tidak bisa mengambil buah sebelum menyapa', () => {
    expect(play(start, { type: 'addFruit', fruitId: 'apple' })).toBe(start)
  })

  it('pesanan yang pas langsung lanjut ke langkah hitung tanpa kesalahan', () => {
    const state = play(fillBag(play(start, { type: 'startServing' })), { type: 'wrapOrder' })
    expect(state.step).toBe('count')
    expect(state.mistakes).toBe(0)
    expect(state.feedback.tone).toBe('success')
  })

  it('kantong kosong diberi petunjuk tanpa dihitung salah', () => {
    const state = play(start, { type: 'startServing' }, { type: 'wrapOrder' })
    expect(state.step).toBe('pick')
    expect(state.mistakes).toBe(0)
    expect(state.feedback.tone).toBe('info')
  })

  it('kantong salah menambah kesalahan dan menjelaskan yang kurang atau lebih', () => {
    const serving = play(start, { type: 'startServing' })
    const [first] = getCurrentCustomer(serving).order
    const state = play(
      fillBag(serving),
      { type: 'removeFruit', fruitId: first.fruitId },
      { type: 'addFruit', fruitId: 'banana' },
      { type: 'addFruit', fruitId: 'banana' },
      { type: 'addFruit', fruitId: 'banana' },
      { type: 'addFruit', fruitId: 'banana' },
      { type: 'wrapOrder' },
    )
    expect(state.step).toBe('pick')
    expect(state.mistakes).toBe(1)
    expect(state.feedback.tone).toBe('error')
    expect(state.feedback.text).toMatch(/kurang|lebih/)
  })

  it('aksi baru menghapus umpan balik lama', () => {
    const state = play(
      start,
      { type: 'startServing' },
      { type: 'wrapOrder' },
      { type: 'addFruit', fruitId: 'apple' },
    )
    expect(state.feedback).toBeNull()
  })
})
