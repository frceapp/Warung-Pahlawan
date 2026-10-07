import * as m from 'motion/react-m'
import { getFruit } from '../data/fruits.js'
import FruitImage from './FruitImage.jsx'

// Chip pesanan muncul satu per satu (jeda 80 ms) mengikuti balon bicara
// (lihat BUBBLE di CustomerStage).
const CHIP = {
  hidden: { opacity: 0, scale: 0.9 },
  shown: { opacity: 1, scale: 1, transition: { duration: 0.14, ease: 'easeOut' } },
}

// Pesanan pembeli: gambar buah dan angka.
function OrderList({ order }) {
  return (
    <ul className="flex flex-wrap gap-1.5 md:gap-2" aria-label="Pesanan">
      {order.map(({ fruitId, quantity }) => (
        <m.li
          key={fruitId}
          variants={CHIP}
          data-fruit-id={fruitId}
          data-quantity={quantity}
          className="flex items-center gap-1 rounded-lg border-2 border-tinta bg-kapur py-0.5 pr-2 pl-0.5 md:gap-1.5 md:rounded-xl md:border-4 md:py-1 md:pr-3 md:pl-1"
        >
          <FruitImage fruitId={fruitId} size={44} decorative className="h-7 w-7 md:h-11 md:w-11 lg:h-9 lg:w-9" />
          <span className="font-heading text-xl md:text-2xl lg:text-xl">{quantity}</span>
          <span className="sr-only md:not-sr-only md:text-base">{getFruit(fruitId).name}</span>
        </m.li>
      ))}
    </ul>
  )
}

export default OrderList
