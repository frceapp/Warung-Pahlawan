import { ACCESSORY_COLORS } from './characterParts.jsx'

// Ciri tokoh yang sekarang digambar, ditulis dari data yang sama dengan
// gambarnya (characterLooks.js dan warna di characterParts.jsx). Dipakai di
// lembar perbandingan /?tokoh.

export const COLOR_NAMES = {
  kapur: 'putih',
  tinta: 'hitam',
  terpal: 'biru',
  'terpal-tua': 'biru tua',
  jingga: 'jingga',
  pisang: 'kuning',
  daun: 'hijau',
  cabai: 'merah',
  kayu: 'cokelat',
}

const HAIR = {
  sanggul: 'rambut disanggul',
  pendek: 'rambut pendek',
  'belah-samping': 'rambut pendek disisir ke samping',
  bergelombang: 'rambut pendek bergelombang',
  tertutup: 'rambut tertutup',
}

const HEADWEAR = {
  peci: (color) => `peci ${color}`,
  sorban: (color) => `sorban ${color}`,
  blangkon: (color) => `blangkon ${color}`,
  'ikat-kepala': (color) => `ikat kepala ${color}`,
  selendang: (color) => `selendang ${color} di kepala`,
}

// Nama baju, bagian yang memakai warna aksen, dan bagian bawah (warna
// bottom). null: bagian itu tidak digambar dengan warnanya sendiri.
const OUTFIT = {
  kebaya: { name: 'kebaya', accent: 'kerah', bottom: 'kain panjang' },
  jas: { name: 'jas', accent: 'dasi', bottom: 'celana' },
  beskap: { name: 'beskap', accent: 'kancing', bottom: 'celana' },
  kurung: { name: 'baju kurung', accent: 'garis kain', bottom: 'kain panjang' },
  jubah: { name: 'jubah panjang', accent: 'selempang', bottom: null },
  mantel: { name: 'mantel', accent: 'kancing', bottom: 'celana' },
  kemeja: { name: 'kemeja', accent: 'sabuk', bottom: 'celana' },
}

export function colorName(color) {
  const name = COLOR_NAMES[color]
  if (!name) throw new Error(`Unknown color: ${color}`)
  return name
}

const has = (look, accessory) => look.accessories.includes(accessory)

function head(look) {
  const parts = Object.keys(HEADWEAR)
    .filter((accessory) => has(look, accessory))
    .map((accessory) => HEADWEAR[accessory](colorName(ACCESSORY_COLORS[accessory])))
  return [...parts, HAIR[look.hair]].join(', ')
}

function outfit(look) {
  const { style, top, accent, bottom } = look.outfit
  const parts = OUTFIT[style]
  return [
    `${parts.name} ${colorName(top)}`,
    `${parts.accent} ${colorName(accent)}`,
    parts.bottom && `${parts.bottom} ${colorName(bottom)}`,
    has(look, 'bros') && `bros ${colorName(ACCESSORY_COLORS.bros)}`,
    has(look, 'selendang') && 'selendang di pundak',
  ]
    .filter(Boolean)
    .join(', ')
}

// Warna yang paling luas: atasan, bawahan, lalu penutup kepala.
function mainColors(look) {
  const { style, top, bottom } = look.outfit
  const headwear = Object.keys(HEADWEAR)
    .filter((accessory) => has(look, accessory))
    .map((accessory) => ACCESSORY_COLORS[accessory])
  const colors = [top, OUTFIT[style].bottom ? bottom : top, ...headwear]
  return [...new Set(colors.map(colorName))].join(', ')
}

// [{ label, value }] untuk satu tokoh.
export function describeLook(look) {
  if (!HAIR[look.hair]) throw new Error(`Unknown hair: ${look.hair}`)
  if (!OUTFIT[look.outfit.style]) throw new Error(`Unknown outfit: ${look.outfit.style}`)
  return [
    { label: 'Kepala', value: head(look) },
    { label: 'Kacamata', value: has(look, 'kacamata') ? 'kacamata bulat' : 'tidak ada' },
    { label: 'Kumis', value: has(look, 'kumis') ? 'ada' : 'tidak ada' },
    { label: 'Pakaian', value: outfit(look) },
    { label: 'Warna utama', value: mainColors(look) },
  ]
}
