import FruitImage from './FruitImage.jsx'

// Keranjang buah: ketuk satu buah untuk memasukkannya ke kantong.
function FruitBasket({ fruits, onPick }) {
  return (
    <ul className="grid grid-cols-3 gap-2 md:gap-3">
      {fruits.map((fruit) => (
        <li key={fruit.id}>
          <button
            type="button"
            data-fruit-id={fruit.id}
            onClick={() => onPick(fruit.id)}
            className="group flex min-h-12 w-full flex-col items-center gap-0.5 rounded-xl border-4 border-tinta bg-kapur px-1 py-1 text-xs font-bold shadow-[0_3px_0_var(--color-tinta)] transition-transform duration-150 active:translate-y-1 active:shadow-none motion-safe:hover:-translate-y-0.5 md:gap-1 md:py-1.5 md:text-base md:shadow-[0_4px_0_var(--color-tinta)]"
          >
            <FruitImage
              fruitId={fruit.id}
              size={56}
              decorative
              className="h-8 w-8 transition-transform duration-150 motion-safe:group-hover:-rotate-6 md:h-12 md:w-12"
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
