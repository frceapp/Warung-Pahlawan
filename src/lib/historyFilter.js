// Penyaringan, pengurutan, dan pengelompokan riwayat skor untuk halaman
// riwayat. Semua fungsi murni: waktu "sekarang" selalu lewat parameter, dan
// tanggal memakai zona waktu perangkat (awal hari = pukul 00.00 setempat).
// Pilihan filter disimpan di sessionStorage (hanya selama sesi).
import { LEVELS } from '../data/levels.js'

export const PAGE_SIZE = 10
export const NO_MATCH_TEXT = 'Tidak ada permainan yang cocok. Coba ubah filternya.'
export const FILTERS_KEY = 'warung-pahlawan:history-filters'

export const LEVEL_OPTIONS = [
  { value: 'all', label: 'Semua' },
  ...LEVELS.map((level) => ({ value: String(level.id), label: level.name })),
]

export const DATE_OPTIONS = [
  { value: 'all', label: 'Semua' },
  { value: 'today', label: 'Hari ini' },
  { value: 'week', label: '7 hari terakhir' },
  { value: 'month', label: '30 hari terakhir' },
  { value: 'custom', label: 'Rentang sendiri' },
]

// Logika skor selalu memberi minimal 1 bintang, jadi tidak ada pilihan 0.
export const STAR_OPTIONS = [
  { value: 'all', label: 'Semua' },
  { value: '3', label: '3 bintang' },
  { value: '2', label: '2 bintang' },
  { value: '1', label: '1 bintang' },
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'highest', label: 'Skor tertinggi' },
  { value: 'lowest', label: 'Skor terendah' },
]

export const DEFAULT_FILTERS = { level: 'all', date: 'all', from: '', to: '', stars: 'all', sort: 'newest' }

const DAYS_BACK = { week: 6, month: 29 }
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const twoDigits = (value) => String(value).padStart(2, '0')
const hasValue = (options, value) => options.some((option) => option.value === value)
const labelOf = (options, value) => options.find((option) => option.value === value)?.label ?? ''

export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

// "2026-10-06" (nilai <input type="date">) menjadi awal hari itu, waktu setempat.
export function parseDay(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '')
  if (!match) return null
  const [year, month, day] = match.slice(1).map(Number)
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  return date
}

export function toDayKey(date) {
  return `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`
}

// Rentang waktu filter tanggal: { start, end } dengan end tidak termasuk
// (awal hari sesudahnya). null berarti tidak dibatasi di sisi itu.
export function getDateRange(filters, now) {
  const today = startOfDay(now)
  const tomorrow = addDays(today, 1)
  switch (filters.date) {
    case 'today':
      return { start: today, end: tomorrow }
    case 'week':
    case 'month':
      return { start: addDays(today, -DAYS_BACK[filters.date]), end: tomorrow }
    case 'custom': {
      let from = parseDay(filters.from)
      let to = parseDay(filters.to)
      // Kalau "dari" sesudah "sampai", keduanya ditukar.
      if (from && to && from > to) [from, to] = [to, from]
      return { start: from, end: to ? addDays(to, 1) : null }
    }
    default:
      return { start: null, end: null }
  }
}

export function filterHistory(history, filters, now) {
  const { start, end } = getDateRange(filters, now)
  return history.filter((entry) => {
    if (filters.level !== 'all' && entry.level !== Number(filters.level)) return false
    if (filters.stars !== 'all' && entry.stars !== Number(filters.stars)) return false
    const time = Date.parse(entry.finishedAt)
    if (start && time < start.getTime()) return false
    if (end && time >= end.getTime()) return false
    return true
  })
}

const byNewest = (a, b) => Date.parse(b.finishedAt) - Date.parse(a.finishedAt)

const COMPARE = {
  newest: byNewest,
  oldest: (a, b) => -byNewest(a, b),
  // Skor sama: yang terbaru lebih dulu.
  highest: (a, b) => b.score - a.score || byNewest(a, b),
  lowest: (a, b) => a.score - b.score || byNewest(a, b),
}

export function sortHistory(entries, sort) {
  return [...entries].sort(COMPARE[sort] ?? COMPARE.newest)
}

export function applyHistoryFilters(history, filters, now) {
  return sortHistory(filterHistory(history, filters, now), filters.sort)
}

export function isDefaultFilters(filters) {
  return Object.keys(DEFAULT_FILTERS).every((key) => filters[key] === DEFAULT_FILTERS[key])
}

export function formatDay(date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

function describeDate(filters) {
  if (filters.date !== 'custom') return labelOf(DATE_OPTIONS, filters.date)
  let from = parseDay(filters.from)
  let to = parseDay(filters.to)
  if (from && to && from > to) [from, to] = [to, from]
  if (from && to) return `${formatDay(from)} sampai ${formatDay(to)}`
  if (from) return `Mulai ${formatDay(from)}`
  if (to) return `Sampai ${formatDay(to)}`
  return null
}

// Filter yang aktif sebagai chip yang bisa dihapus satu per satu. Urutan
// selain "Terbaru" juga ditampilkan supaya jelas kenapa urutannya berubah.
export function getActiveChips(filters) {
  const chips = []
  if (filters.level !== 'all') chips.push({ key: 'level', label: labelOf(LEVEL_OPTIONS, filters.level) })
  if (filters.date !== 'all') {
    const label = describeDate(filters)
    if (label) chips.push({ key: 'date', label })
  }
  if (filters.stars !== 'all') chips.push({ key: 'stars', label: labelOf(STAR_OPTIONS, filters.stars) })
  if (filters.sort !== 'newest') chips.push({ key: 'sort', label: `Urutan: ${labelOf(SORT_OPTIONS, filters.sort)}` })
  return chips
}

export function removeFilter(filters, key) {
  if (key === 'date') return { ...filters, date: 'all', from: '', to: '' }
  return { ...filters, [key]: DEFAULT_FILTERS[key] }
}

export function formatDayLabel(dayKey, now) {
  const today = startOfDay(now)
  if (dayKey === toDayKey(today)) return 'Hari ini'
  if (dayKey === toDayKey(addDays(today, -1))) return 'Kemarin'
  return formatDay(parseDay(dayKey))
}

// Kelompok per tanggal, mengikuti urutan entri. Kalau diurutkan menurut skor,
// tanggal yang sama bisa muncul di lebih dari satu kelompok.
export function groupByDay(entries, now) {
  const groups = []
  for (const entry of entries) {
    const dayKey = toDayKey(new Date(entry.finishedAt))
    const last = groups.at(-1)
    if (last && last.dayKey === dayKey) last.entries.push(entry)
    else groups.push({ id: `${dayKey}-${groups.length}`, dayKey, label: formatDayLabel(dayKey, now), entries: [entry] })
  }
  return groups
}

export function formatTime(iso) {
  const date = new Date(iso)
  return `${twoDigits(date.getHours())}.${twoDigits(date.getMinutes())}`
}

export function describeCount(count) {
  return `${count} permainan`
}

// Pilihan filter dari sessionStorage. Nilai yang tidak dikenal diganti nilai
// bawaan; storage yang diblokir atau rusak berarti filter bawaan.
export function normalizeFilters(raw) {
  const value = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  const pick = (key, options) => (hasValue(options, value[key]) ? value[key] : DEFAULT_FILTERS[key])
  const day = (key) => (parseDay(value[key]) ? value[key] : '')
  const filters = {
    level: pick('level', LEVEL_OPTIONS),
    date: pick('date', DATE_OPTIONS),
    from: day('from'),
    to: day('to'),
    stars: pick('stars', STAR_OPTIONS),
    sort: pick('sort', SORT_OPTIONS),
  }
  if (filters.date !== 'custom') return { ...filters, from: '', to: '' }
  return filters
}

export function loadFilters(storage) {
  if (!storage) return DEFAULT_FILTERS
  try {
    return normalizeFilters(JSON.parse(storage.getItem(FILTERS_KEY) ?? 'null'))
  } catch {
    return DEFAULT_FILTERS
  }
}

export function saveFilters(storage, filters) {
  if (!storage) return false
  try {
    storage.setItem(FILTERS_KEY, JSON.stringify(filters))
    return true
  } catch {
    return false
  }
}
