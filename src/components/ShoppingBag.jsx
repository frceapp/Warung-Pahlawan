import FruitImage from './FruitImage.jsx'

// Isi kantong belanja. Tiap buah bisa dikeluarkan satu per satu.
function ShoppingBag({ fruits, bag, onRemove }) {
  const items = fruits.filter((fruit) => (bag[fruit.id] ?? 0) > 0)

  if (items.length === 0) {
    return <p className="py-1 text-sm md:py-3 md:text-base">Kantong masih kosong.</p>
  }

  return (
    <ul className="grid grid-cols-3 gap-1.5 md:grid-cols-2 md:gap-2">
      {items.map((fruit) => (
        <li
          key={fruit.id}
          data-fruit-id={fruit.id}
          className="flex items-center gap-0.5 rounded-xl border-2 border-tinta bg-kapur py-0.5 pr-0.5 pl-0.5 md:gap-2 md:border-4 md:py-1 md:pr-1 md:pl-2"
        >
          <FruitImage fruitId={fruit.id} size={40} decorative className="h-6 w-6 shrink-0 md:h-10 md:w-10" />
          <span className="min-w-0 flex-1 text-sm md:text-base">
            <span className="sr-only md:not-sr-only">{fruit.name} </span>
            <span
              key={bag[fruit.id]}
              className="inline-block font-heading text-lg motion-safe:animate-pop md:text-2xl"
            >
              {bag[fruit.id]}
            </span>
          </span>
          <button
            type="button"
            onClick={() => onRemove(fruit.id)}
            aria-label={`Keluarkan 1 ${fruit.name}`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 md:border-4 border-tinta bg-kapur font-heading text-2xl transition-colors hover:bg-langit"
          >
            <span aria-hidden="true">−</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default ShoppingBag
