import FruitBasket from './FruitBasket.jsx'
import ShoppingBag from './ShoppingBag.jsx'

// Langkah 2: ambil buah dari keranjang ke kantong. Tombol "Bungkus
// pesanan" ada di bar aksi.
function PickStep({ fruits, bag, onAdd, onRemove }) {
  const bagCount = Object.values(bag).reduce((sum, count) => sum + count, 0)

  return (
    <div className="grid gap-2 md:grid-cols-2 md:gap-4">
      <section
        aria-labelledby="basket-title"
        className="rounded-2xl border-4 border-tinta bg-langit p-2 md:p-3"
      >
        <h3 id="basket-title" className="mb-1 font-heading text-base md:mb-2 md:text-xl">
          Keranjang buah
        </h3>
        <FruitBasket fruits={fruits} onPick={onAdd} />
      </section>
      <section
        aria-labelledby="bag-title"
        className="flex flex-col gap-1 rounded-2xl border-4 border-tinta bg-langit p-2 md:gap-2 md:p-3"
      >
        <h3 id="bag-title" className="font-heading text-base md:text-xl">
          Kantong belanja{' '}
          <span className="font-body text-sm font-normal md:text-base">({bagCount} buah)</span>
        </h3>
        <ShoppingBag fruits={fruits} bag={bag} onRemove={onRemove} />
      </section>
    </div>
  )
}

export default PickStep
