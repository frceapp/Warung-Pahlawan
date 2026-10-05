import { describe, expect, it } from 'vitest'
import { formatRupiah } from './format.js'

describe('formatRupiah', () => {
  it('menulis rupiah tanpa spasi dengan titik ribuan', () => {
    expect(formatRupiah(500)).toBe('Rp500')
    expect(formatRupiah(7000)).toBe('Rp7.000')
    expect(formatRupiah(12500)).toBe('Rp12.500')
    expect(formatRupiah(100000)).toBe('Rp100.000')
    expect(formatRupiah(0)).toBe('Rp0')
  })
})
