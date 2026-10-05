import FruitImage from './FruitImage.jsx'

// Isi kantong belanja. Tiap buah bisa dikeluarkan satu per satu.
function ShoppingBag({ fruits, bag, onRemove }) {
  const items = fruits.filter((fruit) => (bag[fruit.id] ?? 0) > 0)

  if (items.length === 0) {
    return <p className="py-3 text-base">Kantong masih kosong.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((fruit) => (
        <li
          key={fruit.id}
          data-fruit-id={fruit.id}
          className="flex items-center gap-2 rounded-xl border-4 border-tinta bg-kapur py-1 pr-1 pl-2"
        >
          <FruitImage fruitId={fruit.id} size={40} decorative />
          <span className="flex-1 text-base">
            {fruit.name}{' '}
            <span
              key={bag[fruit.id]}
              className="inline-block font-heading text-2xl motion-safe:animate-pop"
            >
              {bag[fruit.id]}
            </span>
          </span>
          <button
            type="button"
            onClick={() => onRemove(fruit.id)}
            aria-label={`Keluarkan 1 ${fruit.name}`}
            className="flex h-12 w-12 items-center justify-center rounded-lg border-4 border-tinta bg-kapur font-heading text-2xl transition-colors hover:bg-langit"
          >
            <span aria-hidden="true">−</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default ShoppingBag
