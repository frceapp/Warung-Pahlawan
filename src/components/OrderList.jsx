import { getFruit } from '../data/fruits.js'
import FruitImage from './FruitImage.jsx'

// Pesanan pembeli: gambar buah dan angka.
function OrderList({ order }) {
  return (
    <ul className="flex flex-wrap gap-1.5 md:gap-2" aria-label="Pesanan">
      {order.map(({ fruitId, quantity }) => (
        <li
          key={fruitId}
          data-fruit-id={fruitId}
          data-quantity={quantity}
          className="flex items-center gap-1 rounded-lg border-2 border-tinta bg-kapur py-0.5 pr-2 pl-0.5 md:gap-1.5 md:rounded-xl md:border-4 md:py-1 md:pr-3 md:pl-1"
        >
          <FruitImage fruitId={fruitId} size={44} decorative className="h-7 w-7 md:h-11 md:w-11" />
          <span className="font-heading text-xl md:text-2xl">{quantity}</span>
          <span className="sr-only md:not-sr-only md:text-base">{getFruit(fruitId).name}</span>
        </li>
      ))}
    </ul>
  )
}

export default OrderList
