import { describe, expect, it } from 'vitest'
import { CORRECT_TUNE, FANFARE_TUNES, fanfareTune, frequencyOf, midiOf, tuneLength } from './sfxTunes.js'

// Langkah dari do (C) dalam tangga nada mayor: hanya do, mi, sol (akor mayor).
const MAJOR_TRIAD = new Set([0, 4, 7])
const degree = (note) => ((midiOf(note) % 12) + 12) % 12

// Melodi: nada selain akor penutup dan dentingan, diurutkan menurut waktu.
function melody(tune) {
  return tune.filter((tone) => !tone.chord && tone.voice !== 'chime').sort((a, b) => a.start - b.start)
}

const ALL = { 'jawaban benar': CORRECT_TUNE, ...Object.fromEntries(Object.entries(FANFARE_TUNES).map(([stars, tune]) => [`fanfare ${stars} bintang`, tune])) }

describe('nada', () => {
  it('nama nada ke frekuensi', () => {
    expect(frequencyOf('A4')).toBeCloseTo(440, 5)
    expect(frequencyOf('C5')).toBeCloseTo(523.25, 1)
    expect(midiOf('C4')).toBe(60)
    expect(() => midiOf('H2')).toThrow()
  })
})

describe.each(Object.entries(ALL))('%s terdengar riang', (_, tune) => {
  it('hanya memakai nada akor mayor (do, mi, sol), tanpa interval minor', () => {
    for (const tone of tune) expect(MAJOR_TRIAD.has(degree(tone.note))).toBe(true)
  })

  it('melodinya naik, tidak pernah turun', () => {
    const notes = melody(tune).map((tone) => midiOf(tone.note))
    expect(notes.length).toBeGreaterThanOrEqual(2)
    for (let i = 1; i < notes.length; i += 1) expect(notes[i]).toBeGreaterThan(notes[i - 1])
  })

  it('berakhir di do (tidak menggantung)', () => {
    const chord = tune.filter((tone) => tone.chord)
    const ending = chord.length > 0 ? chord : [melody(tune).at(-1)]
    const lowest = ending.reduce((low, tone) => (midiOf(tone.note) < midiOf(low.note) ? tone : low))
    expect(degree(lowest.note)).toBe(0)
    // akor penutup dipetik naik dan dimulai setelah melodi
    for (let i = 1; i < chord.length; i += 1) expect(midiOf(chord[i].note)).toBeGreaterThan(midiOf(chord[i - 1].note))
    if (chord.length > 0) expect(chord[0].start).toBeGreaterThan(melody(tune).at(-1).start)
  })

  it('volume tiap nada aman (tidak lebih dari 0,35)', () => {
    for (const tone of tune) expect(tone.volume).toBeLessThanOrEqual(0.35)
  })
})

describe('panjang dan lapisan', () => {
  it('jawaban benar singkat dan cepat', () => {
    expect(tuneLength(CORRECT_TUNE)).toBeLessThanOrEqual(0.6)
  })

  it('fanfare 1 sampai 1,5 detik', () => {
    for (const tune of Object.values(FANFARE_TUNES)) {
      expect(tuneLength(tune)).toBeGreaterThanOrEqual(1)
      expect(tuneLength(tune)).toBeLessThanOrEqual(1.5)
    }
  })

  it('hanya 3 bintang yang punya lapisan dentingan, dan dentingannya naik', () => {
    const chimes = FANFARE_TUNES[3].filter((tone) => tone.voice === 'chime')
    expect(chimes.length).toBeGreaterThan(0)
    for (let i = 1; i < chimes.length; i += 1) expect(midiOf(chimes[i].note)).toBeGreaterThan(midiOf(chimes[i - 1].note))
    expect(FANFARE_TUNES[2].some((tone) => tone.voice === 'chime')).toBe(false)
    expect(FANFARE_TUNES[1].some((tone) => tone.voice === 'chime')).toBe(false)
  })

  it('1 bintang memakai suara hangat; 0 bintang diperlakukan seperti 1', () => {
    expect(FANFARE_TUNES[1].every((tone) => tone.voice === 'warm')).toBe(true)
    expect(fanfareTune(0)).toBe(FANFARE_TUNES[1])
    expect(fanfareTune(5)).toBe(FANFARE_TUNES[3])
    expect(fanfareTune(undefined)).toBe(FANFARE_TUNES[1])
  })
})
