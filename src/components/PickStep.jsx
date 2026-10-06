import FruitBasket from './FruitBasket.jsx'
import ShoppingBag from './ShoppingBag.jsx'

// Langkah 2: ambil buah dari keranjang ke kantong. Keranjang dan kantong ada
// di atas meja kasir. Tombol "Bungkus pesanan" ada di bar aksi.
function PickStep({ fruits, bag, onAdd, onRemove }) {
  const bagCount = Object.values(bag).reduce((sum, count) => sum + count, 0)

  return (
    <div className="grid gap-1.5 md:grid-cols-[3fr_2fr] md:gap-4">
      <section
        aria-labelledby="basket-title"
        className="counter-basket rounded-2xl border-4 border-tinta p-1.5 md:p-3"
      >
        <h3 id="basket-title" className="mb-0.5 font-heading text-base leading-tight md:mb-2 md:text-xl">
          Keranjang buah
        </h3>
        <FruitBasket fruits={fruits} onPick={onAdd} />
      </section>
      <section
        aria-labelledby="bag-title"
        className="counter-bag flex flex-col gap-1 rounded-2xl rounded-t-md border-4 border-tinta p-1.5 md:gap-2 md:p-3"
      >
        <h3 id="bag-title" className="font-heading text-base leading-tight md:text-xl">
          Kantong belanja{' '}
          <span className="font-body text-sm font-normal md:text-base">({bagCount} buah)</span>
        </h3>
        <ShoppingBag fruits={fruits} bag={bag} onRemove={onRemove} />
      </section>
    </div>
  )
}

export default PickStep
