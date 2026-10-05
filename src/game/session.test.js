import { describe, expect, it } from 'vitest'
import { getLevel, LEVELS } from '../data/levels.js'
import { composeAmount } from './payment.js'
import { createSeededRng } from './random.js'
import {
  createSession,
  getCurrentCustomer,
  getSessionScore,
  sessionReducer,
  summarizeSession,
} from './session.js'

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


function countStep(state) {
  const { total } = getCurrentCustomer(state)
  return state.level.totalMode === 'shown'
    ? sessionReducer(state, { type: 'confirmTotal' })
    : sessionReducer(state, { type: 'chooseTotal', amount: total })
}

function changeStep(state) {
  const { payment } = getCurrentCustomer(state)
  if (payment.change === 0) return sessionReducer(state, { type: 'noChange' })
  const values = composeAmount(payment.change, state.level.drawer)
  return play(state, ...values.map((value) => ({ type: 'addMoney', value })), {
    type: 'giveChange',
  })
}

function serveCorrectly(state) {
  const picked = play(fillBag(play(state, { type: 'startServing' })), { type: 'wrapOrder' })
  return changeStep(countStep(picked))
}

describe('sessionReducer: hitung, kembalian, dan skor', () => {
  for (const level of LEVELS) {
    it(`level ${level.id} bisa dimainkan sampai habis dengan skor penuh`, () => {
      for (let seed = 1; seed <= 30; seed += 1) {
        let state = createSession(level, createSeededRng(seed))
        for (let i = 0; i < level.customerCount; i += 1) {
          state = serveCorrectly(state)
          expect(state.step).toBe('served')
          state = sessionReducer(state, { type: 'nextCustomer' })
        }
        expect(state.step).toBe('finished')
        expect(summarizeSession(state)).toMatchObject({
          levelId: level.id,
          score: level.customerCount * 10,
          maxScore: level.customerCount * 10,
          stars: 3,
        })
        expect(state.results).toHaveLength(level.customerCount)
      }
    })
  }

  it('tiap pembeli punya tiga pilihan total dengan satu yang benar', () => {
    const state = createSession(getLevel(3), createSeededRng(8))
    for (const customer of state.customers) {
      expect(customer.totalChoices).toHaveLength(3)
      expect(customer.totalChoices).toContain(customer.total)
    }
  })

  it('total salah dihitung sekali per pilihan dan pilihannya dicatat', () => {
    let state = play(
      fillBag(play(createSession(getLevel(2), createSeededRng(1)), { type: 'startServing' })),
      { type: 'wrapOrder' },
    )
    const customer = getCurrentCustomer(state)
    const wrong = customer.totalChoices.find((value) => value !== customer.total)
    state = play(state, { type: 'chooseTotal', amount: wrong }, { type: 'chooseTotal', amount: wrong })
    expect(state.mistakes).toBe(1)
    expect(state.wrongTotals).toEqual([wrong])
    expect(state.feedback.tone).toBe('error')
    expect(state.step).toBe('count')
  })

  it('level 1 tidak menerima pilihan total karena total langsung ditampilkan', () => {
    const state = play(
      fillBag(play(createSession(getLevel(1), createSeededRng(2)), { type: 'startServing' })),
      { type: 'wrapOrder' },
      { type: 'confirmTotal' },
    )
    expect(state.step).toBe('change')
    expect(state.mistakes).toBe(0)
  })

  it('kesalahan mengurangi skor, paling sedikit 4', () => {
    let state = createSession(getLevel(1), createSeededRng(3))
    state = play(state, { type: 'startServing' }, { type: 'addFruit', fruitId: 'watermelon' })
    // Satu kesalahan bungkus.
    state = play(state, { type: 'wrapOrder' }, { type: 'removeFruit', fruitId: 'watermelon' })
    state = countStep(play(fillBag(state), { type: 'wrapOrder' }))
    // Dua kesalahan kembalian: "tidak perlu kembalian" padahal perlu, lalu kelebihan.
    state = play(
      state,
      { type: 'noChange' },
      { type: 'addMoney', value: 5000 },
      { type: 'addMoney', value: 5000 },
      { type: 'giveChange' },
      { type: 'clearMoney' },
    )
    expect(state.mistakes).toBe(3)
    state = changeStep(state)
    expect(state.step).toBe('served')
    expect(state.results[0].score).toBe(4)
    expect(getSessionScore(state)).toBe(4)
  })

  it('uang pas: "tidak perlu kembalian" benar, memberi uang dihitung salah', () => {
    let state = createSession(getLevel(2), createSeededRng(5))
    while (getCurrentCustomer(state).payment.change !== 0) {
      state = sessionReducer(serveCorrectly(state), { type: 'nextCustomer' })
    }
    state = countStep(play(fillBag(play(state, { type: 'startServing' })), { type: 'wrapOrder' }))
    const wrong = play(state, { type: 'addMoney', value: 1000 }, { type: 'giveChange' })
    expect(wrong.mistakes).toBe(1)
    expect(wrong.feedback.text).toContain('Tidak perlu kembalian')
    const right = sessionReducer(state, { type: 'noChange' })
    expect(right.step).toBe('served')
    expect(right.results.at(-1).score).toBe(10)
  })

  it('kembalian kosong diberi petunjuk tanpa dihitung salah', () => {
    let state = createSession(getLevel(1), createSeededRng(6))
    state = countStep(play(fillBag(play(state, { type: 'startServing' })), { type: 'wrapOrder' }))
    state = sessionReducer(state, { type: 'giveChange' })
    expect(state.mistakes).toBe(0)
    expect(state.feedback.tone).toBe('info')
  })

  it('uang yang tidak ada di laci level itu diabaikan', () => {
    let state = createSession(getLevel(1), createSeededRng(6))
    state = countStep(play(fillBag(play(state, { type: 'startServing' })), { type: 'wrapOrder' }))
    expect(sessionReducer(state, { type: 'addMoney', value: 20000 })).toBe(state)
  })

  it('removeMoney mengeluarkan satu uang dari kembalian', () => {
    let state = createSession(getLevel(2), createSeededRng(6))
    state = countStep(play(fillBag(play(state, { type: 'startServing' })), { type: 'wrapOrder' }))
    state = play(
      state,
      { type: 'addMoney', value: 1000 },
      { type: 'addMoney', value: 5000 },
      { type: 'removeMoney', index: 0 },
    )
    expect(state.givenChange).toEqual([5000])
  })
})
