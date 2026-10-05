import Button from './Button.jsx'
import FruitBasket from './FruitBasket.jsx'
import ShoppingBag from './ShoppingBag.jsx'

// Langkah 2: ambil buah dari keranjang ke kantong, lalu bungkus pesanan.
function PickStep({ fruits, bag, onAdd, onRemove, onWrap }) {
  const bagCount = Object.values(bag).reduce((sum, count) => sum + count, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section aria-labelledby="basket-title" className="rounded-2xl border-4 border-tinta bg-langit p-3">
        <h3 id="basket-title" className="mb-2 font-heading text-xl">
          Keranjang buah
        </h3>
        <FruitBasket fruits={fruits} onPick={onAdd} />
      </section>
      <section
        aria-labelledby="bag-title"
        className="flex flex-col gap-3 rounded-2xl border-4 border-tinta bg-langit p-3"
      >
        <h3 id="bag-title" className="font-heading text-xl">
          Kantong belanja <span className="font-body text-base font-normal">({bagCount} buah)</span>
        </h3>
        <ShoppingBag fruits={fruits} bag={bag} onRemove={onRemove} />
        <Button onClick={onWrap} className="mt-auto self-start">
          Bungkus pesanan
        </Button>
      </section>
    </div>
  )
}

export default PickStep
