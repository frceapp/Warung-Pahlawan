import { describe, expect, it } from 'vitest'
import { STORAGE_KEY as BEST_STARS_KEY } from '../game/progress.js'
import {
  addHistoryEntry,
  clearHistory,
  compareWithPrevious,
  createGameId,
  createHistoryEntry,
  describeComparison,
  formatPlayedAt,
  HISTORY_KEY,
  HISTORY_LIMIT,
  isValidEntry,
  loadHistory,
  readHistory,
  saveHistory,
  summarizeForHome,
  summarizeHistory,
} from './scoreHistory.js'

function createMemoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial))
  return {
    data,
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  }
}

const blockedStorage = {
  getItem() {
    throw new Error('blocked')
  },
  setItem() {
    throw new Error('blocked')
  },
  removeItem() {
    throw new Error('blocked')
  },
}

// Entri contoh; menit ke-n supaya urutan waktunya jelas.
function entry(n, overrides = {}) {
  return {
    id: `game-${n}`,
    level: 1,
    score: 36,
    maxScore: 40,
    stars: 3,
    mistakes: 2,
    finishedAt: new Date(Date.UTC(2026, 9, 8, 1, n)).toISOString(),
    ...overrides,
  }
}

describe('menambah entri riwayat', () => {
  it('membuat entri dari ringkasan layar hasil', () => {
    const summary = {
      levelId: 2,
      score: 44,
      maxScore: 50,
      stars: 2,
      results: [{ mistakes: 0 }, { mistakes: 2 }, { mistakes: 1 }, { mistakes: 0 }, { mistakes: 0 }],
    }
    const finishedAt = new Date(Date.UTC(2026, 9, 8, 1, 5))
    expect(createHistoryEntry({ id: 'abc', summary, finishedAt })).toEqual({
      id: 'abc',
      level: 2,
      score: 44,
      maxScore: 50,
      stars: 2,
      mistakes: 3,
      finishedAt: '2026-10-08T01:05:00.000Z',
    })
  })

  it('menaruh entri terbaru di depan dan menyimpannya', () => {
    const storage = createMemoryStorage()
    let history = loadHistory(storage)
    expect(history).toEqual([])
    history = addHistoryEntry(history, entry(1))
    history = addHistoryEntry(history, entry(2, { level: 3, score: 54, maxScore: 60 }))
    expect(history.map((item) => item.id)).toEqual(['game-2', 'game-1'])
    expect(saveHistory(storage, history)).toBe(true)
    expect(loadHistory(storage)).toEqual(history)
  })

  it('hanya menyimpan kolom skor (tanpa kolom lain seperti nama)', () => {
    const history = addHistoryEntry([], { ...entry(1), name: 'Budi' })
    expect(history[0]).not.toHaveProperty('name')
    expect(Object.keys(history[0]).sort()).toEqual(
      ['finishedAt', 'id', 'level', 'maxScore', 'mistakes', 'score', 'stars'].sort(),
    )
  })
})

describe('batas 50 entri', () => {
  it('membuang entri paling lama', () => {
    let history = []
    for (let n = 1; n <= HISTORY_LIMIT + 5; n += 1) history = addHistoryEntry(history, entry(n))
    expect(HISTORY_LIMIT).toBe(50)
    expect(history).toHaveLength(50)
    expect(history[0].id).toBe('game-55')
    expect(history.at(-1).id).toBe('game-6')
  })

  it('memotong data tersimpan yang lebih dari 50 saat dibaca', () => {
    const many = Array.from({ length: 60 }, (_, index) => entry(index + 1))
    const storage = createMemoryStorage({ [HISTORY_KEY]: JSON.stringify(many) })
    const history = loadHistory(storage)
    expect(history).toHaveLength(50)
    expect(history[0].id).toBe('game-60')
  })
})

describe('data rusak', () => {
  it('menganggap riwayat kosong kalau JSON rusak atau bukan larik', () => {
    for (const raw of ['{rusak', '"teks"', '{"a":1}', 'null', '42']) {
      const storage = createMemoryStorage({ [HISTORY_KEY]: raw })
      expect(loadHistory(storage)).toEqual([])
    }
  })

  it('mengabaikan entri yang tidak valid dan memakai yang valid', () => {
    const raw = [
      entry(1),
      null,
      'teks',
      [],
      entry(2, { id: '' }),
      entry(3, { level: 9 }),
      entry(4, { score: 41 }),
      entry(5, { score: -1 }),
      entry(6, { stars: 0 }),
      entry(7, { stars: 2.5 }),
      entry(8, { mistakes: -1 }),
      entry(9, { finishedAt: 'kemarin' }),
      entry(10, { maxScore: 0, score: 0 }),
      entry(11, { score: '36' }),
      entry(12),
    ]
    const storage = createMemoryStorage({ [HISTORY_KEY]: JSON.stringify(raw) })
    expect(loadHistory(storage).map((item) => item.id)).toEqual(['game-12', 'game-1'])
  })

  it('isValidEntry menolak bentuk yang salah', () => {
    expect(isValidEntry(entry(1))).toBe(true)
    expect(isValidEntry(undefined)).toBe(false)
    expect(isValidEntry({ ...entry(1), id: 'x'.repeat(65) })).toBe(false)
  })
})

describe('penyimpanan terblokir atau tidak ada', () => {
  it('membaca riwayat kosong tanpa error', () => {
    expect(loadHistory(null)).toEqual([])
    expect(loadHistory(blockedStorage)).toEqual([])
    expect(readHistory(blockedStorage).ok).toBe(false)
    expect(readHistory(null).ok).toBe(false)
    expect(readHistory(createMemoryStorage()).ok).toBe(true)
  })

  it('menulis dan menghapus tanpa error, hanya mengembalikan false', () => {
    expect(saveHistory(null, [entry(1)])).toBe(false)
    expect(saveHistory(blockedStorage, [entry(1)])).toBe(false)
    expect(clearHistory(null)).toBe(false)
    expect(clearHistory(blockedStorage)).toBe(false)
  })
})

describe('tidak ada entri ganda', () => {
  it('permainan yang sama tidak tercatat dua kali', () => {
    const once = addHistoryEntry([], entry(1))
    const twice = addHistoryEntry(once, entry(1))
    expect(twice).toBe(once)
    expect(addHistoryEntry(once, entry(1, { score: 40 }))).toBe(once)
  })

  it('entri ganda di data tersimpan hanya dibaca sekali', () => {
    const storage = createMemoryStorage({ [HISTORY_KEY]: JSON.stringify([entry(1), entry(1), entry(2)]) })
    expect(loadHistory(storage).map((item) => item.id)).toEqual(['game-2', 'game-1'])
  })

  it('id permainan berbeda untuk angka acak berbeda', () => {
    const now = Date.UTC(2026, 9, 8, 1, 5)
    const first = createGameId(now, () => 0.25)
    const second = createGameId(now, () => 0.75)
    expect(first).not.toBe(second)
    expect(first).toMatch(/^[0-9a-z]+-[0-9a-z]{6}$/)
  })
})

describe('menghapus riwayat', () => {
  it('tidak menghapus bintang terbaik', () => {
    const storage = createMemoryStorage({
      [HISTORY_KEY]: JSON.stringify([entry(1)]),
      [BEST_STARS_KEY]: JSON.stringify({ 1: 3 }),
    })
    expect(clearHistory(storage)).toBe(true)
    expect(loadHistory(storage)).toEqual([])
    expect(storage.getItem(BEST_STARS_KEY)).toBe('{"1":3}')
  })
})

describe('perbandingan dengan permainan sebelumnya', () => {
  const previous = [
    entry(3, { level: 1, score: 30 }),
    entry(2, { level: 2, score: 50, maxScore: 50 }),
    entry(1, { level: 1, score: 34 }),
  ]

  it('skor tertinggi baru kalau melewati rekor level itu', () => {
    const comparison = compareWithPrevious(previous, entry(4, { score: 36 }))
    expect(comparison).toEqual({ previousScore: 30, previousBest: 34, difference: 6, isNewRecord: true })
    expect(describeComparison(comparison)).toBe('Naik 6 poin dari terakhir kali.')
  })

  it('bukan rekor baru kalau sama atau di bawah rekor', () => {
    expect(compareWithPrevious(previous, entry(4, { score: 34 })).isNewRecord).toBe(false)
    const lower = compareWithPrevious(previous, entry(4, { score: 30 }))
    expect(lower.isNewRecord).toBe(false)
    expect(describeComparison(lower)).toBe('Sama dengan skor terakhir kali.')
    expect(describeComparison(compareWithPrevious(previous, entry(4, { score: 26 })))).toBe(
      'Terakhir kali skormu 30. Ayo coba lagi!',
    )
  })

  it('permainan pertama di level itu tidak dibandingkan', () => {
    const comparison = compareWithPrevious(previous, entry(4, { level: 3, score: 60, maxScore: 60 }))
    expect(comparison.isNewRecord).toBe(false)
    expect(describeComparison(comparison)).toBeNull()
  })

  it('entri yang sama tidak dibandingkan dengan dirinya sendiri', () => {
    const current = entry(4, { score: 36 })
    expect(compareWithPrevious([current, ...previous], current).previousScore).toBe(30)
  })
})

describe('ringkasan dan tanggal', () => {
  it('menghitung jumlah permainan, skor tertinggi, dan bintang terbaik per level', () => {
    const history = [
      entry(4, { level: 1, score: 32, stars: 2 }),
      entry(3, { level: 1, score: 40, stars: 3 }),
      entry(2, { level: 2, score: 44, maxScore: 50, stars: 2 }),
    ]
    expect(summarizeHistory(history)).toEqual({
      count: 3,
      levels: [
        { levelId: 1, plays: 2, bestScore: 40, maxScore: 40, bestStars: 3 },
        { levelId: 2, plays: 1, bestScore: 44, maxScore: 50, bestStars: 2 },
        { levelId: 3, plays: 0, bestScore: null, maxScore: null, bestStars: null },
      ],
    })
  })

  it('menulis tanggal dengan format Indonesia', () => {
    const now = new Date(2026, 9, 8, 12, 0)
    expect(formatPlayedAt(new Date(2026, 9, 8, 8, 5).toISOString(), now)).toBe('8 Okt, 08.05')
    expect(formatPlayedAt(new Date(2026, 4, 21, 17, 30).toISOString(), now)).toBe('21 Mei, 17.30')
    expect(formatPlayedAt(new Date(2025, 7, 1, 9, 0).toISOString(), now)).toBe('1 Agu 2025, 09.00')
  })
})

describe('ringkasan kartu beranda', () => {
  it('jumlah permainan, skor tertinggi (persen), dan permainan terakhir', () => {
    const history = [
      entry(4, { level: 1, score: 32 }),
      entry(3, { level: 3, score: 54, maxScore: 60 }),
      entry(2, { level: 1, score: 40 }),
      entry(1, { level: 2, score: 50, maxScore: 50 }),
    ]
    const summary = summarizeForHome(history)
    expect(summary.count).toBe(4)
    expect(summary.last.id).toBe('game-4')
    // 40/40 dan 50/50 sama-sama penuh; skor yang lebih besar dipilih.
    expect(summary.best.id).toBe('game-1')
  })

  it('kosong kalau belum ada riwayat', () => {
    expect(summarizeForHome([])).toBeNull()
  })
})
