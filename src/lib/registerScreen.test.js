import { describe, expect, it } from 'vitest'
import { getRegisterMotion, getRegisterScreen } from './registerScreen.js'

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

describe('gerak mesin kasir', () => {
  it('diam sebelum pesanan dibungkus', () => {
    for (const step of ['greet', 'pick']) {
      expect(getRegisterMotion(step)).toEqual({ ringing: false, paperOut: false, drawerOpen: false })
    }
  })

  it('di langkah Hitung tombol berkedip dan kertas nota keluar', () => {
    expect(getRegisterMotion('count')).toEqual({ ringing: true, paperOut: true, drawerOpen: false })
  })

  it('laci terbuka di langkah Kembalian dan menutup setelah kembalian benar', () => {
    expect(getRegisterMotion('change').drawerOpen).toBe(true)
    expect(getRegisterMotion('served').drawerOpen).toBe(false)
    expect(getRegisterMotion('finished').drawerOpen).toBe(false)
  })
})
