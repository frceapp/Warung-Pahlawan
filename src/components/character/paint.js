// Nama token desain menjadi warna CSS; kode hex dipakai apa adanya.
export function paint(color) {
  return color.startsWith('#') ? color : `var(--color-${color})`
}
