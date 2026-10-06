import { importWithRetry } from './importWithRetry.js'

// Fitur animasi Motion (domAnimation), dimuat terpisah. Dipakai LazyMotion di
// main.jsx dan oleh layar loading, yang menunggunya sebelum warung dibuka.
export function loadMotionFeatures() {
  return importWithRetry(() => import('../motionFeatures.js')).then((module) => module.default)
}
