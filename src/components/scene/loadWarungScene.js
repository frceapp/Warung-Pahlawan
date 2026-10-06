// Pemuat komponen latar warung (dimuat terpisah dari bundel awal). Beranda
// memanggilnya lebih awal saat browser senggang. Kalau gagal dimuat, layar
// main tetap jalan tanpa latar.
export function loadWarungScene() {
  return import('./WarungScene.jsx').catch(() => ({ default: () => null }))
}
