// Buah yang dijual di warung. Lihat AGENTS.md bagian 3, "Buah dan harga".
export const FRUITS = [
  { id: 'banana', name: 'Pisang', price: 1000, minLevel: 1 },
  { id: 'apple', name: 'Apel', price: 2000, minLevel: 1 },
  { id: 'mango', name: 'Mangga', price: 3000, minLevel: 1 },
  { id: 'watermelon', name: 'Semangka', price: 5000, minLevel: 2 },
  { id: 'rambutan', name: 'Rambutan', price: 500, minLevel: 3 },
  { id: 'orange', name: 'Jeruk', price: 1500, minLevel: 3 },
]

export function getFruit(id) {
  const fruit = FRUITS.find((item) => item.id === id)
  if (!fruit) throw new Error(`Unknown fruit: ${id}`)
  return fruit
}
