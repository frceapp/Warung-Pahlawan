import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { CHARACTERS } from '../data/characters.js'
import { FRUITS } from '../data/fruits.js'
import { LEVELS } from '../data/levels.js'
import { DENOMINATIONS, PAYMENT_NOTES } from '../data/money.js'

function readTable(markdown, heading) {
  const section = markdown.split(`## ${heading}`)[1].split('\n## ')[0]
  return section
    .split('\n')
    .filter((line) => line.startsWith('| ') && !line.startsWith('| Tokoh') && !line.startsWith('| ---'))
    .map((line) =>
      line
        .slice(1, -1)
        .split(' | ')
        .map((cell) => cell.trim()),
    )
}

describe('buah', () => {
  it('sesuai tabel harga di AGENTS.md', () => {
    expect(FRUITS.map(({ name, price, minLevel }) => [name, price, minLevel])).toEqual([
      ['Pisang', 1000, 1],
      ['Apel', 2000, 1],
      ['Mangga', 3000, 1],
      ['Semangka', 5000, 2],
      ['Rambutan', 500, 3],
      ['Jeruk', 1500, 3],
    ])
  })
})

describe('uang', () => {
  it('memuat pecahan yang dipakai pembeli dan laci', () => {
    expect(PAYMENT_NOTES).toEqual([2000, 5000, 10000, 20000, 50000, 100000])
    for (const level of LEVELS) {
      for (const value of level.drawer) expect(DENOMINATIONS).toContain(value)
    }
  })
})

describe('level', () => {
  it('sesuai tabel level di AGENTS.md', () => {
    expect(
      LEVELS.map((level) => [
        level.id,
        level.name,
        level.fruitTypesPerOrder,
        level.maxPerFruit,
        level.customerCount,
        level.totalMode,
      ]),
    ).toEqual([
      [1, 'Warung Kecil', 1, 3, 4, 'shown'],
      [2, 'Warung Ramai', 2, 3, 5, 'guided'],
      [3, 'Pasar Besar', 3, 4, 6, 'unguided'],
    ])
  })

  it('level 1 tidak pernah uang pas, level 2 dan 3 kira-kira 1 dari 5', () => {
    expect(LEVELS.map((level) => level.exactPaymentRatio)).toEqual([0, 0.2, 0.2])
  })

  it('isi laci uang sesuai AGENTS.md', () => {
    expect(LEVELS.map((level) => level.drawer)).toEqual([
      [1000, 2000, 5000],
      [1000, 2000, 5000, 10000, 20000],
      [500, 1000, 2000, 5000, 10000, 20000],
    ])
  })
})

describe('tokoh', () => {
  const markdown = readFileSync(
    new URL('../../docs/sumber-fakta.md', import.meta.url),
    'utf8',
  )
  const factRows = readTable(markdown, 'Fun fact')
  const originRows = readTable(markdown, 'Asal tokoh')

  it('ada delapan tokoh, masing-masing dua fun fact', () => {
    expect(CHARACTERS).toHaveLength(8)
    for (const character of CHARACTERS) expect(character.facts).toHaveLength(2)
    expect(new Set(CHARACTERS.map((c) => c.id)).size).toBe(8)
  })

  it('fun fact sama persis dengan docs/sumber-fakta.md dan sudah dicek', () => {
    const fromDocs = factRows.map(([name, sentence, , status]) => ({
      name,
      sentence,
      status,
    }))
    const fromData = CHARACTERS.flatMap((character) =>
      character.facts.map((sentence) => ({
        name: character.name,
        sentence,
        status: 'sudah dicek',
      })),
    )
    expect(fromData).toEqual(fromDocs)
  })

  it('asal tokoh sama dengan docs/sumber-fakta.md dan sudah dicek', () => {
    const fromDocs = originRows.map(([name, origin, , status]) => [name, origin, status])
    const fromData = CHARACTERS.map((c) => [c.name, c.origin, 'sudah dicek'])
    expect(fromData).toEqual(fromDocs)
  })
})
