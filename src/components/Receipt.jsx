import { getFruit } from '../data/fruits.js'
import { formatRupiah } from '../game/format.js'
import { getOrderLines } from '../game/order.js'
import FruitImage from './FruitImage.jsx'

// Nota belanja. showSubtotals: hasil kali tiap baris ditampilkan (bantuan).
// showTotal: total langsung ditampilkan (level 1).
function Receipt({ order, showSubtotals, showTotal }) {
  const lines = getOrderLines(order)
  const total = lines.reduce((sum, line) => sum + line.subtotal, 0)

  return (
    <div className="rounded-xl border-4 border-tinta bg-kapur px-3 py-3 sm:px-4">
      <p className="border-b-2 border-dashed border-tinta pb-2 text-center font-heading text-xl">
        Nota Warung
      </p>
      <ul className="divide-y-2 divide-dashed divide-tinta/30">
        {lines.map((line) => (
          <li
            key={line.fruitId}
            data-fruit-id={line.fruitId}
            data-quantity={line.quantity}
            data-price={line.price}
            className="flex flex-wrap items-center gap-x-2 gap-y-1 py-2 text-base sm:text-lg"
          >
            <FruitImage fruitId={line.fruitId} size={40} decorative />
            <span className="min-w-20 font-bold">{getFruit(line.fruitId).name}</span>
            <span>
              {line.quantity} × {formatRupiah(line.price)}
            </span>
            {showSubtotals && (
              <span className="ml-auto font-bold">= {formatRupiah(line.subtotal)}</span>
            )}
          </li>
        ))}
      </ul>
      <p className="flex items-center justify-between border-t-4 border-tinta pt-2 font-heading text-2xl">
        <span>Total</span>
        <span data-total={showTotal ? total : undefined}>
          {showTotal ? formatRupiah(total) : '?'}
        </span>
      </p>
    </div>
  )
}

export default Receipt
