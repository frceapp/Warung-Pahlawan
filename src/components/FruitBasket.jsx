import FruitImage from './FruitImage.jsx'

// Keranjang buah: ketuk satu buah untuk memasukkannya ke kantong. Di layar
// lebar semua buah satu baris (nama sedikit lebih kecil supaya muat).
function FruitBasket({ fruits, onPick }) {
  return (
    <ul className="grid grid-cols-3 gap-1.5 md:gap-3 lg:grid-flow-col lg:grid-cols-none lg:auto-cols-fr lg:gap-2">
      {fruits.map((fruit) => (
        <li key={fruit.id}>
          <button
            type="button"
            data-fruit-id={fruit.id}
            onClick={() => onPick(fruit.id)}
            className="group flex min-h-12 w-full flex-col items-center gap-0.5 rounded-xl border-4 border-tinta bg-kapur px-1 py-1 text-xs font-bold shadow-[0_3px_0_var(--color-tinta)] transition-transform duration-150 active:translate-y-1 active:shadow-none motion-safe:hover:-translate-y-0.5 md:gap-1 md:px-0.5 md:py-2 md:text-base md:shadow-[0_4px_0_var(--color-tinta)] lg:text-xs xl:text-sm"
          >
            <FruitImage
              fruitId={fruit.id}
              size={56}
              decorative
              className="h-8 w-8 transition-transform duration-150 motion-safe:group-hover:-rotate-6 md:h-14 md:w-14"
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
