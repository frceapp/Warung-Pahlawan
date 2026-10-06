import { describe, expect, it } from 'vitest'
import { findModuleUrl, importWithRetry } from './importWithRetry.js'

describe('findModuleUrl', () => {
  it('membaca alamat berkas dari pesan error Chrome dan Firefox', () => {
    expect(
      findModuleUrl(new TypeError('Failed to fetch dynamically imported module: https://wp.itslim.dev/assets/PlayScreen-Ab1.js')),
    ).toBe('https://wp.itslim.dev/assets/PlayScreen-Ab1.js')
    expect(findModuleUrl(new TypeError('error loading dynamically imported module: http://localhost:4173/assets/level2-x.js'))).toBe(
      'http://localhost:4173/assets/level2-x.js',
    )
  })

  it('null kalau pesan tidak menyebut alamat', () => {
    expect(findModuleUrl(new TypeError('Importing a module script failed.'))).toBe(null)
    expect(findModuleUrl(undefined)).toBe(null)
  })
})

describe('importWithRetry', () => {
  it('memakai hasil import pertama kalau berhasil', async () => {
    const module = { default: 'ok' }
    expect(await importWithRetry(() => Promise.resolve(module), () => Promise.reject(new Error('tidak dipanggil')))).toBe(module)
  })

  it('mengunduh ulang dengan alamat baru kalau import gagal', async () => {
    const asked = []
    const module = await importWithRetry(
      () => Promise.reject(new TypeError('Failed to fetch dynamically imported module: https://a.test/assets/x.js')),
      (url) => {
        asked.push(url)
        return Promise.resolve({ default: 'baru' })
      },
    )
    expect(module.default).toBe('baru')
    expect(asked[0]).toMatch(/^https:\/\/a\.test\/assets\/x\.js\?coba=\d+$/)
  })

  it('meneruskan error kalau alamatnya tidak diketahui', async () => {
    const error = new TypeError('Importing a module script failed.')
    await expect(importWithRetry(() => Promise.reject(error))).rejects.toBe(error)
  })
})
