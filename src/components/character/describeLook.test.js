import { describe, expect, it } from 'vitest'
import { CHARACTERS } from '../../data/characters.js'
import { ACCESSORY_COLORS, HAIR_COLOR } from './characterParts.jsx'
import { CHARACTER_LOOKS } from './characterLooks.js'
import { colorName, describeLook } from './describeLook.js'

const describeOf = (id) => Object.fromEntries(describeLook(CHARACTER_LOOKS[id]).map(({ label, value }) => [label, value]))

describe('ciri tokoh di lembar /?tokoh', () => {
  it('semua tokoh punya penampilan dan lima baris ciri', () => {
    for (const character of CHARACTERS) {
      const rows = describeLook(CHARACTER_LOOKS[character.id])
      expect(rows.map((row) => row.label)).toEqual(['Kepala', 'Kacamata', 'Kumis', 'Pakaian', 'Warna utama'])
      for (const row of rows) expect(row.value).not.toBe('')
    }
  })

  it('semua warna yang dipakai punya nama', () => {
    for (const look of Object.values(CHARACTER_LOOKS)) {
      for (const color of [look.outfit.top, look.outfit.accent, look.outfit.bottom]) expect(() => colorName(color)).not.toThrow()
    }
    for (const color of [HAIR_COLOR, ...Object.values(ACCESSORY_COLORS)]) expect(() => colorName(color)).not.toThrow()
    expect(() => colorName('ungu')).toThrow()
  })

  // Ciri khas yang diminta di prompt P33, dicocokkan dengan data gambar.
  it.each([
    ['soekarno', { Kepala: /peci hitam/, Pakaian: /^jas putih/ }],
    ['hatta', { Kepala: /disisir/, Kacamata: /bulat/, Pakaian: /^jas /, Kumis: /tidak/ }],
    ['dewantara', { Kepala: /peci hitam/, Kacamata: /bulat/, Kumis: /^ada$/, Pakaian: /^beskap/ }],
    ['cut-nyak-dhien', { Kepala: /selendang hijau di kepala/, Pakaian: /^baju kurung/ }],
    ['kartini', { Kepala: /disanggul/, Pakaian: /^kebaya .*bros kuning/ }],
    ['diponegoro', { Kepala: /sorban putih/, Pakaian: /^jubah/ }],
    ['sudirman', { Kepala: /blangkon hitam/, Pakaian: /^mantel/ }],
    ['pattimura', { Kepala: /ikat kepala merah, rambut pendek bergelombang/, Kumis: /^ada$/, Pakaian: /^kemeja/ }],
  ])('%s', (id, expected) => {
    const rows = describeOf(id)
    for (const [label, pattern] of Object.entries(expected)) expect(rows[label]).toMatch(pattern)
  })

  it('contoh lengkap: Ir. Soekarno', () => {
    expect(describeOf('soekarno')).toEqual({
      Kepala: 'peci hitam, rambut pendek',
      Kacamata: 'tidak ada',
      Kumis: 'tidak ada',
      Pakaian: 'jas putih, dasi hitam, celana hitam',
      'Warna utama': 'putih, hitam',
    })
  })
})
