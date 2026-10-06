// Pemuat layar permainan (dimuat terpisah dari bundel awal supaya beranda
// lebih ringan). Beranda memanggilnya lebih awal saat browser senggang,
// jadi saat anak memilih warung, berkasnya biasanya sudah siap.
export function loadPlayScreen() {
  return import('./PlayScreen.jsx')
}
