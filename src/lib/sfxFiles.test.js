import { readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { SFX_FILES } from './sfxFiles.js'

const DIR = fileURLToPath(new URL('../../public/sfx/', import.meta.url))

describe('berkas efek suara', () => {
  it('semua berkas di daftar ada di public/sfx, dan sebaliknya', () => {
    const files = readdirSync(DIR).filter((name) => name.endsWith('.mp3')).sort()
    expect(SFX_FILES.map(({ file }) => file).sort()).toEqual(files)
  })

  it('tiap berkas paling besar 30 kB, total paling besar 300 kB', () => {
    const sizes = SFX_FILES.map(({ file }) => statSync(DIR + file).size)
    sizes.forEach((size) => expect(size).toBeLessThanOrEqual(30 * 1024))
    expect(sizes.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(300 * 1024)
  })

  it('semua berlisensi CC0 dan punya pembuat serta tautan sumber', () => {
    for (const entry of SFX_FILES) {
      expect(entry.license).toBe('CC0 1.0')
      expect(entry.author).toBeTruthy()
      expect(entry.original).toBeTruthy()
      expect(entry.source).toMatch(/^https:\/\/(kenney\.nl\/assets|freesound\.org\/people)\//)
    }
    expect(new Set(SFX_FILES.map(({ id }) => id)).size).toBe(SFX_FILES.length)
  })
})
