// Tiga level game. Lihat AGENTS.md bagian 3, "Level" dan "Uang".
// totalMode:
//   'shown'   total belanja langsung ditampilkan
//   'guided'  anak memilih total, hasil kali tiap baris dibantu
//   'unguided' anak memilih total tanpa bantuan
export const LEVELS = [
  {
    id: 1,
    name: 'Warung Kecil',
    fruitTypesPerOrder: 1,
    maxPerFruit: 3,
    customerCount: 4,
    totalMode: 'shown',
    exactPaymentRatio: 0,
    drawer: [1000, 2000, 5000],
  },
  {
    id: 2,
    name: 'Warung Ramai',
    fruitTypesPerOrder: 2,
    maxPerFruit: 3,
    customerCount: 5,
    totalMode: 'guided',
    exactPaymentRatio: 1 / 5,
    drawer: [1000, 2000, 5000, 10000, 20000],
  },
  {
    id: 3,
    name: 'Pasar Besar',
    fruitTypesPerOrder: 3,
    maxPerFruit: 4,
    customerCount: 6,
    totalMode: 'unguided',
    exactPaymentRatio: 1 / 5,
    drawer: [500, 1000, 2000, 5000, 10000, 20000],
  },
]

export function getLevel(id) {
  const level = LEVELS.find((item) => item.id === id)
  if (!level) throw new Error(`Unknown level: ${id}`)
  return level
}
