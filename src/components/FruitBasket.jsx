import FruitImage from './FruitImage.jsx'

// Keranjang buah: ketuk satu buah untuk memasukkannya ke kantong.
function FruitBasket({ fruits, onPick }) {
  return (
    <ul className="grid grid-cols-3 gap-2 sm:gap-3">
      {fruits.map((fruit) => (
        <li key={fruit.id}>
          <button
            type="button"
            data-fruit-id={fruit.id}
            onClick={() => onPick(fruit.id)}
            className="group flex min-h-12 w-full flex-col items-center gap-1 rounded-xl border-4 border-tinta bg-kapur px-1 py-2 text-base font-bold shadow-[0_4px_0_var(--color-tinta)] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
          >
            <FruitImage
              fruitId={fruit.id}
              size={56}
              decorative
              className="transition-transform duration-150 group-hover:-rotate-6"
            />
            <span>
              <span className="sr-only">Ambil 1 </span>
              {fruit.name}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default FruitBasket
