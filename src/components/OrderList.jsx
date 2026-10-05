import { getFruit } from '../data/fruits.js'
import FruitImage from './FruitImage.jsx'

// Chip pesanan muncul satu per satu: chip pertama bersama balon bicara
// (400 ms setelah pembeli datang, lihat --animate-bubble-in), lalu tiap 80 ms.
const CHIP_FIRST_DELAY_MS = 400
const CHIP_STAGGER_MS = 80

// Pesanan pembeli: gambar buah dan angka.
function OrderList({ order }) {
  return (
    <ul className="flex flex-wrap gap-1.5 md:gap-2" aria-label="Pesanan">
      {order.map(({ fruitId, quantity }, index) => (
        <li
          key={fruitId}
          data-fruit-id={fruitId}
          data-quantity={quantity}
          style={{ animationDelay: `${CHIP_FIRST_DELAY_MS + index * CHIP_STAGGER_MS}ms` }}
          className="flex items-center gap-1 rounded-lg border-2 border-tinta bg-kapur py-0.5 pr-2 pl-0.5 motion-safe:animate-chip-in md:gap-1.5 md:rounded-xl md:border-4 md:py-1 md:pr-3 md:pl-1"
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
