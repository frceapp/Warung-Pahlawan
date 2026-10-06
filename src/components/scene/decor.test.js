import { describe, expect, it } from 'vitest'
import { loadDecor } from './loadDecor.js'
import level1 from './decor/level1.js'
import level2 from './decor/level2.js'
import level3 from './decor/level3.js'

const PIECES = ['shelf', 'bananas', 'lamp', 'calendar', 'poster', 'banner', 'sign', 'stall', 'flags', 'sacks', 'crates']
const SHOW = ['all', 'mobile', 'sm', 'md', 'lg', 'xl']
const POS = /^(l|r|t|w)(-md|-lg)?$/

describe.each([
  [1, level1],
  [2, level2],
  [3, level3],
])('dekorasi level %i', (levelId, decor) => {
  it('memakai dinding, lantai, dan potongan yang dikenal', () => {
    expect(['planks', 'plain', 'market']).toContain(decor.wall)
    expect(['planks', 'tiles', 'concrete']).toContain(decor.floor)
    for (const item of decor.items) {
      expect(PIECES).toContain(item.piece)
      expect(SHOW).toContain(item.show)
      for (const key of Object.keys(item.pos)) expect(key).toMatch(POS)
    }
  })

  it('punya papan nama "Warung Pahlawan" di HP dan di layar lebar', () => {
    const signs = decor.items.filter((item) => item.piece === 'sign')
    expect(signs.map((item) => item.show).sort()).toEqual(['md', 'mobile'])
    for (const sign of signs) expect(sign.props.lines.join(' ')).toBe('Warung Pahlawan')
  })

  it('dimuat lewat loadDecor dengan promise yang sama', async () => {
    const first = loadDecor(levelId)
    expect(loadDecor(levelId)).toBe(first)
    expect(await first).toBe(decor)
  })
})

describe('variasi level', () => {
  it('ramai: lampu menyala dan spanduk; pasar: lapak dan bendera', () => {
    expect(level1.items.some((item) => item.piece === 'lamp' && !item.props?.lit)).toBe(true)
    expect(level2.items.some((item) => item.piece === 'lamp' && item.props?.lit)).toBe(true)
    expect(level2.items.some((item) => item.piece === 'banner')).toBe(true)
    expect(level3.items.filter((item) => item.piece === 'stall').length).toBeGreaterThan(2)
    expect(level3.items.some((item) => item.piece === 'flags')).toBe(true)
  })

  it('rak level 2 lebih penuh daripada level 1', () => {
    const goods = (decor) =>
      decor.items
        .filter((item) => item.piece === 'shelf')
        .flatMap((item) => item.props.tiers.flat()).length
    expect(goods(level2)).toBeGreaterThan(goods(level1))
  })

  it('level yang tidak dikenal memakai latar polos', async () => {
    expect(await loadDecor(99)).toEqual({ wall: 'plain', floor: 'tiles', items: [] })
  })
})
