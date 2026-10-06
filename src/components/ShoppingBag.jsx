import FruitImage from './FruitImage.jsx'

// Isi kantong belanja. Tiap buah tampil sebagai satu tombol (gambar dan
// jumlah; namanya dibacakan lewat aria-label): ketuk untuk mengeluarkan satu
// buah. Tanda "−" di pojok menunjukkan aksinya, jadi ikon
// dan jumlah tidak pernah tertutup, bahkan di layar 320 px.
function ShoppingBag({ fruits, bag, onRemove }) {
  const items = fruits.filter((fruit) => (bag[fruit.id] ?? 0) > 0)

  if (items.length === 0) {
    return <p className="py-1 text-sm md:py-3 md:text-base">Kantong masih kosong.</p>
  }

  return (
    <ul className="grid grid-cols-3 gap-x-2 gap-y-2.5 pt-1.5 pr-1.5 md:grid-cols-2 md:gap-x-3 md:gap-y-3 lg:grid-cols-3">
      {items.map((fruit) => (
        <li key={fruit.id} data-fruit-id={fruit.id}>
          <button
            type="button"
            onClick={() => onRemove(fruit.id)}
            aria-label={`Keluarkan 1 ${fruit.name}. Di kantong ada ${bag[fruit.id]}.`}
            className="relative flex min-h-12 w-full items-center justify-center gap-1 rounded-xl border-2 border-tinta bg-kapur py-1 pr-4 pl-1 transition-colors hover:bg-langit md:gap-2 md:border-4 md:pr-5"
          >
            <FruitImage
              fruitId={fruit.id}
              size={40}
              decorative
              className="h-7 w-7 shrink-0 md:h-8 md:w-8"
            />
            <span
              key={bag[fruit.id]}
              data-bag-count
              className="inline-block font-heading text-xl leading-none motion-safe:animate-pop md:text-2xl"
            >
              {bag[fruit.id]}
            </span>
            <span
              aria-hidden="true"
              data-bag-minus
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-tinta bg-kapur font-heading text-base leading-none md:h-7 md:w-7 md:text-lg"
            >
              −
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default ShoppingBag
