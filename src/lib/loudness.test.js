import { describe, expect, it } from 'vitest'
import { gainToDb, measureLoudness } from './loudness.js'

function sine(frequency, amplitude, seconds, sampleRate) {
  const samples = new Float32Array(Math.round(seconds * sampleRate))
  for (let i = 0; i < samples.length; i += 1) samples[i] = amplitude * Math.sin((2 * Math.PI * frequency * i) / sampleRate)
  return samples
}

describe('kekerasan BS.1770', () => {
  // Titik acuan BS.1770: sinus 997 Hz dengan puncak 0 dBFS = -3,01 LUFS.
  it.each([44100, 48000])('sinus 997 Hz 0 dBFS sekitar -3,0 LUFS (%i Hz)', (sampleRate) => {
    const result = measureLoudness(sine(997, 1, 2, sampleRate), sampleRate)
    expect(result.lufs).toBeCloseTo(-3, 0)
    expect(result.integratedLufs).toBeCloseTo(-3, 0)
    expect(result.peakDb).toBeCloseTo(0, 1)
    expect(result.rmsDb).toBeCloseTo(-3, 0)
  })

  it('sinus -20 dBFS sekitar -23 LUFS, dan 10 dB lebih pelan memberi 10 LU lebih kecil', () => {
    const loud = measureLoudness(sine(997, 0.1, 1, 48000), 48000)
    const quiet = measureLoudness(sine(997, 0.0316, 1, 48000), 48000)
    expect(loud.lufs).toBeCloseTo(-23, 0)
    expect(loud.lufs - quiet.lufs).toBeCloseTo(10, 0)
  })

  it('bunyi pendek: tanpa LUFS terintegrasi, tetap ada LUFS seluruh bunyi', () => {
    const result = measureLoudness(sine(997, 0.5, 0.1, 44100), 44100)
    expect(result.integratedLufs).toBeNull()
    expect(result.lufs).toBeCloseTo(-9, 0)
    expect(result.seconds).toBeCloseTo(0.1, 2)
  })

  it('K-weighting meredam frekuensi rendah dan menaikkan frekuensi tinggi', () => {
    const low = measureLoudness(sine(50, 0.5, 1, 48000), 48000)
    const high = measureLoudness(sine(4000, 0.5, 1, 48000), 48000)
    const mid = measureLoudness(sine(997, 0.5, 1, 48000), 48000)
    expect(low.lufs).toBeLessThan(mid.lufs - 1)
    expect(high.lufs).toBeGreaterThan(mid.lufs + 2)
  })

  it('hening', () => {
    const result = measureLoudness(new Float32Array(1000), 44100)
    expect(result.lufs).toBe(-Infinity)
    expect(result.peakDb).toBe(-Infinity)
  })

  it('gain ke dB', () => {
    expect(gainToDb(0.5)).toBeCloseTo(-6, 0)
    expect(gainToDb(1)).toBe(0)
  })
})
