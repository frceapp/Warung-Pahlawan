import { describe, expect, it } from 'vitest'
import {
  applyHistoryFilters,
  DEFAULT_FILTERS,
  describeCount,
  filterHistory,
  FILTERS_KEY,
  formatTime,
  getActiveChips,
  getDateRange,
  groupByDay,
  isDefaultFilters,
  loadFilters,
  normalizeFilters,
  parseDay,
  removeFilter,
  saveFilters,
  sortHistory,
  STAR_OPTIONS,
} from './historyFilter.js'

// Semua tanggal dibuat dengan waktu setempat (zona waktu perangkat), jadi
// tes ini berlaku di zona waktu mana pun.
const NOW = new Date(2026, 9, 8, 14, 30) // 8 Okt 2026, 14.30

let counter = 0
function entry(date, overrides = {}) {
  counter += 1
  return {
    id: `game-${counter}`,
    level: 1,
    score: 36,
    maxScore: 40,
    stars: 3,
    mistakes: 2,
    finishedAt: date.toISOString(),
    ...overrides,
  }
}

const filters = (overrides) => ({ ...DEFAULT_FILTERS, ...overrides })
const ids = (entries) => entries.map((item) => item.id)

const todayMorning = entry(new Date(2026, 9, 8, 8, 5), { id: 'today-am', level: 1, score: 36, stars: 3 })
const todayStart = entry(new Date(2026, 9, 8, 0, 0, 0, 0), { id: 'today-start', level: 2, score: 30, maxScore: 50, stars: 1 })
const yesterdayEnd = entry(new Date(2026, 9, 7, 23, 59, 59, 999), { id: 'yesterday-end', level: 3, score: 54, maxScore: 60, stars: 3 })
const sixDaysAgo = entry(new Date(2026, 9, 2, 0, 0), { id: 'six-days', level: 2, score: 40, maxScore: 50, stars: 2 })
const sevenDaysAgo = entry(new Date(2026, 9, 1, 23, 59, 59, 999), { id: 'seven-days', level: 1, score: 28, stars: 2 })
const twentyNineDaysAgo = entry(new Date(2026, 8, 9, 0, 0), { id: 'twenty-nine', level: 3, score: 48, maxScore: 60, stars: 2 })
const thirtyDaysAgo = entry(new Date(2026, 8, 8, 12, 0), { id: 'thirty', level: 1, score: 40, stars: 3 })

const HISTORY = [todayMorning, todayStart, yesterdayEnd, sixDaysAgo, sevenDaysAgo, twentyNineDaysAgo, thirtyDaysAgo]

describe('tiap filter', () => {
  it('tanpa filter: semua entri', () => {
    expect(filterHistory(HISTORY, DEFAULT_FILTERS, NOW)).toHaveLength(HISTORY.length)
    expect(isDefaultFilters(DEFAULT_FILTERS)).toBe(true)
  })

  it('tingkat kesulitan', () => {
    expect(ids(filterHistory(HISTORY, filters({ level: '1' }), NOW))).toEqual(['today-am', 'seven-days', 'thirty'])
    expect(ids(filterHistory(HISTORY, filters({ level: '2' }), NOW))).toEqual(['today-start', 'six-days'])
    expect(ids(filterHistory(HISTORY, filters({ level: '3' }), NOW))).toEqual(['yesterday-end', 'twenty-nine'])
  })

  it('bintang', () => {
    expect(ids(filterHistory(HISTORY, filters({ stars: '3' }), NOW))).toEqual(['today-am', 'yesterday-end', 'thirty'])
    expect(ids(filterHistory(HISTORY, filters({ stars: '2' }), NOW))).toEqual(['six-days', 'seven-days', 'twenty-nine'])
    expect(ids(filterHistory(HISTORY, filters({ stars: '1' }), NOW))).toEqual(['today-start'])
    expect(STAR_OPTIONS.map((option) => option.value)).toEqual(['all', '3', '2', '1'])
  })

  it('tanggal: hari ini, 7 hari, 30 hari', () => {
    expect(ids(filterHistory(HISTORY, filters({ date: 'today' }), NOW))).toEqual(['today-am', 'today-start'])
    expect(ids(filterHistory(HISTORY, filters({ date: 'week' }), NOW))).toEqual([
      'today-am',
      'today-start',
      'yesterday-end',
      'six-days',
    ])
    expect(ids(filterHistory(HISTORY, filters({ date: 'month' }), NOW))).toEqual([
      'today-am',
      'today-start',
      'yesterday-end',
      'six-days',
      'seven-days',
      'twenty-nine',
    ])
  })
})

describe('batas tanggal (awal dan akhir hari)', () => {
  it('"Hari ini" dimulai pukul 00.00 dan tidak memasukkan 23.59.59,999 kemarin', () => {
    const { start, end } = getDateRange(filters({ date: 'today' }), NOW)
    expect(start).toEqual(new Date(2026, 9, 8, 0, 0, 0, 0))
    expect(end).toEqual(new Date(2026, 9, 9, 0, 0, 0, 0))
    const result = ids(filterHistory(HISTORY, filters({ date: 'today' }), NOW))
    expect(result).toContain('today-start')
    expect(result).not.toContain('yesterday-end')
  })

  it('akhir hari ini (23.59.59,999) masih termasuk, awal besok tidak', () => {
    const lastMs = entry(new Date(2026, 9, 8, 23, 59, 59, 999), { id: 'last-ms' })
    const tomorrow = entry(new Date(2026, 9, 9, 0, 0, 0, 0), { id: 'tomorrow' })
    expect(ids(filterHistory([lastMs, tomorrow], filters({ date: 'today' }), NOW))).toEqual(['last-ms'])
  })

  it('7 hari terakhir dimulai pukul 00.00 enam hari lalu', () => {
    const { start } = getDateRange(filters({ date: 'week' }), NOW)
    expect(start).toEqual(new Date(2026, 9, 2, 0, 0, 0, 0))
  })
})

describe('rentang tanggal sendiri', () => {
  it('dari dan sampai, keduanya termasuk seharian penuh', () => {
    const result = filterHistory(HISTORY, filters({ date: 'custom', from: '2026-10-02', to: '2026-10-07' }), NOW)
    expect(ids(result)).toEqual(['yesterday-end', 'six-days'])
  })

  it('hanya "dari" atau hanya "sampai"', () => {
    expect(ids(filterHistory(HISTORY, filters({ date: 'custom', from: '2026-10-08' }), NOW))).toEqual([
      'today-am',
      'today-start',
    ])
    expect(ids(filterHistory(HISTORY, filters({ date: 'custom', to: '2026-09-09' }), NOW))).toEqual([
      'twenty-nine',
      'thirty',
    ])
  })

  it('"dari" sesudah "sampai" ditukar', () => {
    const swapped = filterHistory(HISTORY, filters({ date: 'custom', from: '2026-10-07', to: '2026-10-02' }), NOW)
    expect(ids(swapped)).toEqual(['yesterday-end', 'six-days'])
  })

  it('rentang kosong atau tanggal tidak sah tidak menyaring', () => {
    expect(filterHistory(HISTORY, filters({ date: 'custom' }), NOW)).toHaveLength(HISTORY.length)
    expect(filterHistory(HISTORY, filters({ date: 'custom', from: '2026-02-31' }), NOW)).toHaveLength(HISTORY.length)
    expect(parseDay('2026-02-31')).toBeNull()
    expect(parseDay('kemarin')).toBeNull()
  })
})

describe('kombinasi filter dan hasil kosong', () => {
  it('level, bintang, dan tanggal sekaligus', () => {
    const result = filterHistory(HISTORY, filters({ level: '3', stars: '3', date: 'week' }), NOW)
    expect(ids(result)).toEqual(['yesterday-end'])
    const month = filterHistory(HISTORY, filters({ level: '1', stars: '2', date: 'month' }), NOW)
    expect(ids(month)).toEqual(['seven-days'])
  })

  it('tidak ada yang cocok', () => {
    expect(filterHistory(HISTORY, filters({ level: '2', stars: '3' }), NOW)).toEqual([])
    expect(filterHistory(HISTORY, filters({ date: 'today', level: '3' }), NOW)).toEqual([])
    expect(applyHistoryFilters([], DEFAULT_FILTERS, NOW)).toEqual([])
    expect(groupByDay([], NOW)).toEqual([])
  })
})

describe('urutan', () => {
  const tieA = entry(new Date(2026, 9, 5, 9, 0), { id: 'tie-older', score: 40 })
  const tieB = entry(new Date(2026, 9, 6, 9, 0), { id: 'tie-newer', score: 40 })
  const low = entry(new Date(2026, 9, 7, 9, 0), { id: 'low', score: 20 })
  const list = [tieA, low, tieB]

  it('terbaru dan terlama', () => {
    expect(ids(sortHistory(list, 'newest'))).toEqual(['low', 'tie-newer', 'tie-older'])
    expect(ids(sortHistory(list, 'oldest'))).toEqual(['tie-older', 'tie-newer', 'low'])
  })

  it('skor tertinggi dan terendah, skor sama: terbaru dulu', () => {
    expect(ids(sortHistory(list, 'highest'))).toEqual(['tie-newer', 'tie-older', 'low'])
    expect(ids(sortHistory(list, 'lowest'))).toEqual(['low', 'tie-newer', 'tie-older'])
  })

  it('tidak mengubah larik asal', () => {
    const copy = [...list]
    sortHistory(list, 'oldest')
    expect(list).toEqual(copy)
  })

  it('menyaring lalu mengurutkan', () => {
    expect(ids(applyHistoryFilters(HISTORY, filters({ level: '1', sort: 'lowest' }), NOW))).toEqual([
      'seven-days',
      'today-am',
      'thirty',
    ])
  })
})

describe('chip filter aktif', () => {
  it('menampilkan filter yang aktif dan bisa dihapus satu per satu', () => {
    const active = filters({ level: '2', date: 'week', stars: '3', sort: 'oldest' })
    expect(getActiveChips(active)).toEqual([
      { key: 'level', label: 'Warung Ramai' },
      { key: 'date', label: '7 hari terakhir' },
      { key: 'stars', label: '3 bintang' },
      { key: 'sort', label: 'Urutan: Terlama' },
    ])
    expect(removeFilter(active, 'level')).toEqual(filters({ date: 'week', stars: '3', sort: 'oldest' }))
    expect(removeFilter(active, 'sort').sort).toBe('newest')
    expect(getActiveChips(DEFAULT_FILTERS)).toEqual([])
  })

  it('rentang sendiri ditulis dengan tanggal, dan menghapusnya mengosongkan rentang', () => {
    const custom = filters({ date: 'custom', from: '2026-10-01', to: '2026-10-06' })
    expect(getActiveChips(custom)).toEqual([{ key: 'date', label: '1 Okt 2026 sampai 6 Okt 2026' }])
    expect(getActiveChips(filters({ date: 'custom', from: '2026-10-01' }))[0].label).toBe('Mulai 1 Okt 2026')
    expect(getActiveChips(filters({ date: 'custom', to: '2026-10-06' }))[0].label).toBe('Sampai 6 Okt 2026')
    expect(removeFilter(custom, 'date')).toEqual(DEFAULT_FILTERS)
  })
})

describe('kelompok per tanggal dan teks', () => {
  it('Hari ini, Kemarin, lalu tanggal lengkap', () => {
    const groups = groupByDay(sortHistory(HISTORY, 'newest'), NOW)
    expect(groups.map((group) => group.label)).toEqual([
      'Hari ini',
      'Kemarin',
      '2 Okt 2026',
      '1 Okt 2026',
      '9 Sep 2026',
      '8 Sep 2026',
    ])
    expect(ids(groups[0].entries)).toEqual(['today-am', 'today-start'])
  })

  it('urutan skor bisa memecah tanggal yang sama', () => {
    const groups = groupByDay(sortHistory([todayMorning, yesterdayEnd, todayStart], 'highest'), NOW)
    expect(groups.map((group) => group.label)).toEqual(['Kemarin', 'Hari ini'])
    expect(new Set(groups.map((group) => group.id)).size).toBe(groups.length)
  })

  it('jam dan jumlah hasil', () => {
    expect(formatTime(new Date(2026, 9, 8, 8, 5).toISOString())).toBe('08.05')
    expect(describeCount(12)).toBe('12 permainan')
  })
})

describe('pilihan filter di sessionStorage', () => {
  function memoryStorage(initial = {}) {
    const data = new Map(Object.entries(initial))
    return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, String(value)) }
  }
  const blocked = {
    getItem() {
      throw new Error('blocked')
    },
    setItem() {
      throw new Error('blocked')
    },
  }

  it('menyimpan dan membaca kembali', () => {
    const storage = memoryStorage()
    const chosen = filters({ level: '3', date: 'custom', from: '2026-10-01', to: '2026-10-06', sort: 'highest' })
    expect(saveFilters(storage, chosen)).toBe(true)
    expect(loadFilters(storage)).toEqual(chosen)
  })

  it('data rusak, nilai asing, atau storage diblokir menjadi filter bawaan', () => {
    expect(loadFilters(memoryStorage({ [FILTERS_KEY]: '{rusak' }))).toEqual(DEFAULT_FILTERS)
    expect(loadFilters(null)).toEqual(DEFAULT_FILTERS)
    expect(loadFilters(blocked)).toEqual(DEFAULT_FILTERS)
    expect(saveFilters(blocked, DEFAULT_FILTERS)).toBe(false)
    expect(normalizeFilters({ level: '9', stars: '0', sort: 'acak', date: 'week', from: '2026-10-01' })).toEqual(
      filters({ date: 'week' }),
    )
  })
})
