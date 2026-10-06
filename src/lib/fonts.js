// Font yang dipakai game (lihat main.jsx). Dimuat sebelum layar dibuka
// supaya teks tidak berganti font (dan bergeser) setelah adegan tampil.
const FONTS = ['400 1em "Lilita One"', '400 1em "Atkinson Hyperlegible"', '700 1em "Atkinson Hyperlegible"']

// Font hanya pelengkap: kalau gagal atau browser tidak mendukung
// document.fonts, layar tetap dibuka dengan font cadangan.
export function loadFonts() {
  if (typeof document === 'undefined' || !document.fonts?.load) return Promise.resolve()
  return Promise.all(FONTS.map((font) => document.fonts.load(font))).then(
    () => undefined,
    () => undefined,
  )
}
