import { describe, expect, it } from 'vitest'
import { STEP_CARD_TEXT } from '../data/sequence.js'
import { createSeededRng } from './random.js'
import {
  checkSequence,
  CORRECT_ORDER,
  createSequenceState,
  describeSequenceResult,
  sequenceReducer,
  shuffleCards,
} from './sequence.js'

function play(state, ...actions) {
  return actions.reduce(sequenceReducer, state)
}

describe('urutan benar', () => {
  it('mengikuti empat langkah melayani pembeli', () => {
    expect(CORRECT_ORDER).toEqual(['greet', 'pick', 'count', 'change'])
  })

  it('setiap kartu punya keterangan dan petunjuk', () => {
    for (const id of CORRECT_ORDER) {
      expect(STEP_CARD_TEXT[id].description).toBeTruthy()
      expect(STEP_CARD_TEXT[id].hint).toBeTruthy()
    }
  })
})

describe('shuffleCards', () => {
  it('memuat semua kartu dan tidak pernah langsung berurutan benar', () => {
    for (let seed = 1; seed <= 500; seed += 1) {
      const cards = shuffleCards(CORRECT_ORDER, createSeededRng(seed))
      expect([...cards].sort()).toEqual([...CORRECT_ORDER].sort())
      expect(cards).not.toEqual(CORRECT_ORDER)
    }
  })

  it('tetap tidak berurutan benar walau pengacak mengembalikan urutan semula', () => {
    // rng yang selalu 0.999 membuat shuffle mengembalikan urutan semula.
    expect(shuffleCards(CORRECT_ORDER, () => 0.999)).not.toEqual(CORRECT_ORDER)
  })

  it('hasilnya sama untuk seed yang sama', () => {
    expect(shuffleCards(CORRECT_ORDER, createSeededRng(3))).toEqual(
      shuffleCards(CORRECT_ORDER, createSeededRng(3)),
    )
  })
})

describe('checkSequence', () => {
  it('benar kalau semua kotak terisi sesuai urutan', () => {
    expect(checkSequence(CORRECT_ORDER, CORRECT_ORDER)).toEqual({
      isComplete: true,
      isCorrect: true,
      emptySlots: 0,
      wrongPositions: [],
    })
  })

  it('melaporkan kotak yang belum pas', () => {
    expect(checkSequence(['pick', 'greet', 'count', 'change'], CORRECT_ORDER)).toMatchObject({
      isComplete: true,
      isCorrect: false,
      wrongPositions: [0, 1],
    })
  })

  it('belum lengkap kalau masih ada kotak kosong', () => {
    expect(checkSequence(['greet', 'count'], CORRECT_ORDER)).toEqual({
      isComplete: false,
      isCorrect: false,
      emptySlots: 2,
      wrongPositions: [1],
    })
  })
})

describe('sequenceReducer', () => {
  const start = createSequenceState(createSeededRng(7))

  it('mulai dengan semua kartu teracak di tumpukan', () => {
    expect(start.placed).toEqual([])
    expect(start.pool).toHaveLength(4)
    expect(start.pool).not.toEqual(CORRECT_ORDER)
  })

  it('menaruh dan mengeluarkan kartu', () => {
    const placed = play(start, { type: 'place', id: 'pick' }, { type: 'place', id: 'greet' })
    expect(placed.placed).toEqual(['pick', 'greet'])
    expect(placed.pool).not.toContain('pick')
    const removed = sequenceReducer(placed, { type: 'remove', id: 'pick' })
    expect(removed.placed).toEqual(['greet'])
    expect(removed.pool).toContain('pick')
  })

  it('mengabaikan kartu yang tidak ada', () => {
    const placed = sequenceReducer(start, { type: 'place', id: 'greet' })
    expect(sequenceReducer(placed, { type: 'place', id: 'greet' })).toBe(placed)
    expect(sequenceReducer(start, { type: 'remove', id: 'greet' })).toBe(start)
  })

  it('cek benar mengunci susunan', () => {
    const solved = play(
      start,
      ...CORRECT_ORDER.map((id) => ({ type: 'place', id })),
      { type: 'check' },
    )
    expect(solved.result.isCorrect).toBe(true)
    expect(sequenceReducer(solved, { type: 'remove', id: 'greet' })).toBe(solved)
  })

  it('mengubah susunan menghapus hasil cek lama', () => {
    const wrong = play(
      start,
      ...['change', 'greet', 'pick', 'count'].map((id) => ({ type: 'place', id })),
      { type: 'check' },
    )
    expect(wrong.result.isCorrect).toBe(false)
    expect(wrong.checkCount).toBe(1)
    expect(sequenceReducer(wrong, { type: 'remove', id: 'change' }).result).toBeNull()
  })

  it('main lagi mengosongkan urutan', () => {
    const solved = play(start, ...CORRECT_ORDER.map((id) => ({ type: 'place', id })), {
      type: 'check',
    })
    const again = sequenceReducer(solved, { type: 'restart', pool: ['count', 'greet', 'change', 'pick'] })
    expect(again.placed).toEqual([])
    expect(again.pool).toEqual(['count', 'greet', 'change', 'pick'])
    expect(again.result).toBeNull()
  })
})

describe('describeSequenceResult', () => {
  it('benar: menjelaskan konsep urutan (sequence)', () => {
    const message = describeSequenceResult(checkSequence(CORRECT_ORDER, CORRECT_ORDER))
    expect(message.tone).toBe('success')
    expect(message.text).toContain('urutan (sequence)')
    expect(message.text).toContain('Sapa, Ambil buah, Hitung, Kembalian')
  })

  it('salah: menyebut jumlah kartu yang belum pas dan memberi petunjuk', () => {
    const message = describeSequenceResult(
      checkSequence(['pick', 'greet', 'count', 'change'], CORRECT_ORDER),
    )
    expect(message.tone).toBe('error')
    expect(message.text).toContain('Ada 2 kartu yang belum pas')
    expect(message.text).toContain(STEP_CARD_TEXT.greet.hint)
  })

  it('belum lengkap: meminta menaruh semua kartu', () => {
    const message = describeSequenceResult(checkSequence(['greet'], CORRECT_ORDER))
    expect(message.tone).toBe('info')
    expect(message.text).toBe('Taruh semua kartu dulu. Masih 3 kotak kosong.')
  })
})
