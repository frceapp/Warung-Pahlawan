import { loadFonts } from '../lib/fonts.js'
import { importWithRetry } from '../lib/importWithRetry.js'

// Pemuat layar hasil (dimuat terpisah dari bundel awal). Layar permainan
// memanggilnya lebih awal saat pembeli terakhir dilayani.
let loaded = null

export function loadResultScreen() {
  return importWithRetry(() => import('./ResultScreen.jsx')).then((module) => {
    loaded = module.default
    return module
  })
}

export function getLoadedResultScreen() {
  return loaded
}

export function prepareResultScreen() {
  return Promise.all([loadResultScreen(), loadFonts()])
}
