// Riwayat skor: satu entri per permainan yang selesai, disimpan di
// localStorage sebagai larik JSON (terbaru di depan, paling banyak 50).
// Hanya data skor, tanpa nama atau data pribadi. Semua fungsi menerima
// `storage` sebagai parameter dan tetap jalan kalau storage tidak tersedia
// (null), melempar error (mode privat, diblokir browser), atau isinya rusak:
// riwayat dianggap kosong dan entri yang tidak valid diabaikan.
// Bintang terbaik tetap disimpan terpisah (game/progress.js).
import { LEVELS } from '../data/levels.js'

export const HISTORY_KEY = 'warung-pahlawan:history'
export const HISTORY_LIMIT = 50

export const HISTORY_EMPTY_TEXT = 'Belum ada riwayat. Buka warung dan mainkan satu level dulu.'
export const HISTORY_CLEARED_TEXT = 'Riwayat main sudah dihapus. Bintang terbaik tetap ada.'

const LEVEL_IDS = new Set(LEVELS.map((level) => level.id))
const MAX_ID_LENGTH = 64

const isCount = (value) => Number.isInteger(value) && value >= 0

export function isValidEntry(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return false
  const { id, level, score, maxScore, stars, mistakes, finishedAt } = entry
  return (
    typeof id === 'string' &&
    id.length > 0 &&
    id.length <= MAX_ID_LENGTH &&
    LEVEL_IDS.has(level) &&
    isCount(maxScore) &&
    maxScore > 0 &&
    isCount(score) &&
    score <= maxScore &&
    Number.isInteger(stars) &&
    stars >= 1 &&
    stars <= 3 &&
    isCount(mistakes) &&
    typeof finishedAt === 'string' &&
    !Number.isNaN(Date.parse(finishedAt))
  )
}

// Hanya kolom yang dikenal yang disimpan dan dipakai.
function cleanEntry({ id, level, score, maxScore, stars, mistakes, finishedAt }) {
  return { id, level, score, maxScore, stars, mistakes, finishedAt }
}

// Urutkan terbaru dulu, buang entri ganda (id sama) dan sisakan 50.
function normalize(entries) {
  const seen = new Set()
  return entries
    .filter((entry) => {
      if (seen.has(entry.id)) return false
      seen.add(entry.id)
      return true
    })
    .sort((a, b) => Date.parse(b.finishedAt) - Date.parse(a.finishedAt))
    .slice(0, HISTORY_LIMIT)
}

// { entries, ok }: ok bernilai false kalau storage tidak bisa dibaca sama
// sekali (bukan sekadar kosong atau rusak).
export function readHistory(storage) {
  if (!storage) return { entries: [], ok: false }
  let raw
  try {
    raw = storage.getItem(HISTORY_KEY)
  } catch {
    return { entries: [], ok: false }
  }
  if (raw == null) return { entries: [], ok: true }
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return { entries: [], ok: true }
    return { entries: normalize(parsed.filter(isValidEntry).map(cleanEntry)), ok: true }
  } catch {
    return { entries: [], ok: true }
  }
}

export function loadHistory(storage) {
  return readHistory(storage).entries
}

export function saveHistory(storage, history) {
  if (!storage) return false
  try {
    storage.setItem(HISTORY_KEY, JSON.stringify(history))
    return true
  } catch {
    return false
  }
}

// Menghapus riwayat saja; bintang terbaik (key lain) tidak tersentuh.
export function clearHistory(storage) {
  if (!storage) return false
  try {
    storage.removeItem(HISTORY_KEY)
    return true
  } catch {
    return false
  }
}

// Id unik satu permainan, dibuat saat level dimulai. Waktu dan angka acak
// lewat parameter supaya bisa dites.
export function createGameId(now, rng) {
  const random = Math.floor(rng() * 36 ** 6)
    .toString(36)
    .padStart(6, '0')
  return `${now.toString(36)}-${random}`
}

// Entri dari ringkasan layar hasil (game/session.js, summarizeSession).
export function createHistoryEntry({ id, summary, finishedAt }) {
  return {
    id,
    level: summary.levelId,
    score: summary.score,
    maxScore: summary.maxScore,
    stars: summary.stars,
    mistakes: summary.results.reduce((sum, result) => sum + result.mistakes, 0),
    finishedAt: finishedAt.toISOString(),
  }
}

// Permainan yang sudah tercatat (id sama) tidak ditambah lagi; riwayat yang
// sama dikembalikan apa adanya.
export function addHistoryEntry(history, entry) {
  if (!isValidEntry(entry) || history.some((item) => item.id === entry.id)) return history
  return normalize([cleanEntry(entry), ...history])
}

// Dibandingkan dengan permainan sebelumnya di level yang sama.
// previousHistory: riwayat sebelum entri ini ditambahkan.
export function compareWithPrevious(previousHistory, entry) {
  const earlier = previousHistory.filter((item) => item.level === entry.level && item.id !== entry.id)
  if (earlier.length === 0) {
    return { previousScore: null, previousBest: null, difference: null, isNewRecord: false }
  }
  const previousScore = earlier[0].score
  const previousBest = Math.max(...earlier.map((item) => item.score))
  return {
    previousScore,
    previousBest,
    difference: entry.score - previousScore,
    isNewRecord: entry.score > previousBest,
  }
}

export function describeComparison(comparison) {
  const { difference, previousScore } = comparison
  if (difference === null) return null
  if (difference > 0) return `Naik ${difference} poin dari terakhir kali.`
  if (difference === 0) return 'Sama dengan skor terakhir kali.'
  return `Terakhir kali skormu ${previousScore}. Ayo coba lagi!`
}

// Ringkasan untuk halaman "Semua riwayat": jumlah permainan, lalu skor
// tertinggi dan bintang terbaik tiap level (null kalau belum dimainkan).
export function summarizeHistory(history) {
  return {
    count: history.length,
    levels: LEVELS.map((level) => {
      const plays = history.filter((item) => item.level === level.id)
      if (plays.length === 0) return { levelId: level.id, plays: 0, bestScore: null, maxScore: null, bestStars: null }
      const best = plays.reduce((top, item) => (item.score > top.score ? item : top))
      return {
        levelId: level.id,
        plays: plays.length,
        bestScore: best.score,
        maxScore: best.maxScore,
        bestStars: Math.max(...plays.map((item) => item.stars)),
      }
    }),
  }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const twoDigits = (value) => String(value).padStart(2, '0')

// "8 Okt, 08.05" (waktu setempat). Tahun ditulis kalau bukan tahun ini.
export function formatPlayedAt(iso, now = new Date()) {
  const date = new Date(iso)
  const year = date.getFullYear() === now.getFullYear() ? '' : ` ${date.getFullYear()}`
  return `${date.getDate()} ${MONTHS[date.getMonth()]}${year}, ${twoDigits(date.getHours())}.${twoDigits(date.getMinutes())}`
}
