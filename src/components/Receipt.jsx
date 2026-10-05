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
    <div
      data-region="receipt"
      className="rounded-xl border-4 border-tinta bg-kapur px-3 py-1 md:px-4 md:py-2"
    >
      <p className="border-b-2 border-dashed border-tinta pb-0.5 text-center font-heading text-sm md:pb-1 md:text-lg">
        Nota Warung
      </p>
      <ul className="divide-y-2 divide-dashed divide-tinta/30">
        {lines.map((line) => (
          <li
            key={line.fruitId}
            data-fruit-id={line.fruitId}
            data-quantity={line.quantity}
            data-price={line.price}
            className="flex items-center gap-x-2 py-0.5 text-[15px] md:py-1 md:text-lg"
          >
            <FruitImage fruitId={line.fruitId} size={40} decorative className="h-6 w-6 md:h-10 md:w-10" />
            <span className="min-w-0 flex-1">
              <span className="font-bold">{getFruit(line.fruitId).name}</span>{' '}
              <span className="whitespace-nowrap">
                {line.quantity} × {formatRupiah(line.price)}
              </span>
            </span>
            {showSubtotals && (
              <span className="font-bold whitespace-nowrap">= {formatRupiah(line.subtotal)}</span>
            )}
          </li>
        ))}
      </ul>
      <p className="flex items-center justify-between border-t-4 border-tinta pt-0.5 font-heading text-lg md:pt-2 md:text-2xl">
        <span>Total</span>
        <span data-total={showTotal ? total : undefined}>
          {showTotal ? formatRupiah(total) : '?'}
        </span>
      </p>
    </div>
  )
}

export default Receipt
