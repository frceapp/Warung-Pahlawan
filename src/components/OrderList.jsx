import { getFruit } from '../data/fruits.js'
import FruitImage from './FruitImage.jsx'

// Pesanan pembeli: gambar buah dan angka.
function OrderList({ order }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Pesanan">
      {order.map(({ fruitId, quantity }) => (
        <li
          key={fruitId}
          data-fruit-id={fruitId}
          data-quantity={quantity}
          className="flex items-center gap-1.5 rounded-xl border-4 border-tinta bg-kapur py-1 pr-3 pl-1"
        >
          <FruitImage fruitId={fruitId} size={44} decorative />
          <span className="font-heading text-2xl">{quantity}</span>
          <span className="text-base">{getFruit(fruitId).name}</span>
        </li>
      ))}
    </ul>
  )
}

export default OrderList
