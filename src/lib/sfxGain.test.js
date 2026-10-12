import { describe, expect, it } from 'vitest'
import { gainFor, LEVEL, MASTER_GAIN, playbackGain, SAMPLE_TRIM_DB, SFX_GAIN, sampleTrim } from './sfxGain.js'
import { SELF_MADE_SOUNDS, SFX_FILES } from './sfxFiles.js'

describe('gain efek suara', () => {
  it('ada gain untuk setiap bunyi, tidak ada yang lebih dari 1', () => {
    for (const { id } of [...SFX_FILES, ...SELF_MADE_SOUNDS]) {
      expect(SFX_GAIN[id]).toBeGreaterThan(0)
      expect(SFX_GAIN[id]).toBeLessThanOrEqual(1)
    }
  })

  it('pintu gulung 40 sampai 50% dari bunyi lain dan tidak lebih keras dari lonceng', () => {
    expect(gainFor('doorRoll')).toBeGreaterThanOrEqual(0.4)
    expect(gainFor('doorRoll')).toBeLessThanOrEqual(0.5)
    expect(playbackGain('doorRoll')).toBeLessThan(playbackGain('doorBell'))
  })

  it('volume utama 0,7 dari volume sebelumnya (level rekaman lama 0,7)', () => {
    expect(MASTER_GAIN).toBe(0.7)
    expect(LEVEL).toBe(0.7)
    expect(playbackGain('correct', { sample: false })).toBeCloseTo(0.49, 6)
  })

  it('koreksi rekaman hanya untuk rekaman berpuncak tajam', () => {
    expect(Object.keys(SAMPLE_TRIM_DB).sort()).toEqual(['note', 'registerKeys'])
    expect(sampleTrim('doorBell')).toBe(1)
    expect(sampleTrim('note')).toBeCloseTo(10 ** (5.7 / 20), 6)
    expect(playbackGain('note', { sample: false })).toBeLessThan(playbackGain('note'))
  })

  it('id bunyi tidak dikenal memakai gain 1', () => {
    expect(gainFor('tidak-ada')).toBe(1)
  })
})
