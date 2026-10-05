// Bintang terbaik tiap level, disimpan di localStorage. Semua fungsi menerima
// `storage` sebagai parameter dan tetap jalan kalau storage tidak tersedia
// (null) atau melempar error (mode privat, diblokir browser).

export const STORAGE_KEY = 'warung-pahlawan:best-stars'

export function getBrowserStorage() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

export function loadBestStars(storage) {
  if (!storage) return {}
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY) ?? '{}')
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const result = {}
    for (const [levelId, stars] of Object.entries(parsed)) {
      if (Number.isInteger(stars) && stars >= 1 && stars <= 3) result[levelId] = stars
    }
    return result
  } catch {
    return {}
  }
}

// Mengembalikan catatan baru; bintang hanya disimpan kalau lebih baik.
export function recordStars(best, levelId, stars) {
  if ((best[levelId] ?? 0) >= stars) return best
  return { ...best, [levelId]: stars }
}

export function saveBestStars(storage, best) {
  if (!storage) return false
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(best))
    return true
  } catch {
    return false
  }
}
