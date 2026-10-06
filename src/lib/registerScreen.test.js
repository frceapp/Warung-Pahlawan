import { describe, expect, it } from 'vitest'
import { getRegisterScreen } from './registerScreen.js'

describe('layar mesin kasir', () => {
  it('belum menampilkan total sebelum langkah Hitung', () => {
    expect(getRegisterScreen('greet', 'shown', 7000)).toBe('Rp ?')
    expect(getRegisterScreen('pick', 'shown', 7000)).toBe('Rp ?')
  })

  it('level 1 menampilkan total di langkah Hitung (sama dengan nota)', () => {
    expect(getRegisterScreen('count', 'shown', 7000)).toBe('Rp7.000')
  })

  it.each(['guided', 'unguided'])('level dengan pilihan total (%s) tidak membocorkan jawaban', (mode) => {
    expect(getRegisterScreen('count', mode, 17000)).toBe('Rp ?')
    expect(getRegisterScreen('change', mode, 17000)).toBe('Rp17.000')
    expect(getRegisterScreen('served', mode, 17000)).toBe('Rp17.000')
  })

  it('menulis "Tutup" setelah semua pembeli dilayani', () => {
    expect(getRegisterScreen('finished', 'unguided', 17000)).toBe('Tutup')
  })
})
