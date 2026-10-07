import { getFruit } from '../data/fruits.js'
import { formatRupiah } from '../game/format.js'
import { getOrderLines } from '../game/order.js'
import FruitImage from './FruitImage.jsx'

// Nota belanja. showSubtotals: hasil kali tiap baris ditampilkan (bantuan).
// showTotal: total langsung ditampilkan (level 1). paid: belanja sudah
// dibayar, nota diberi cap "Lunas".
function Receipt({ order, showSubtotals, showTotal, paid = false }) {
  const lines = getOrderLines(order)
  const total = lines.reduce((sum, line) => sum + line.subtotal, 0)

  return (
    <div
      data-region="receipt"
      className="relative rounded-xl border-4 border-tinta bg-kapur px-3 py-1 md:px-4 md:py-1"
    >
      {paid && (
        <p className="absolute top-1 right-2 -rotate-6 rounded-md border-[3px] border-daun bg-kapur px-1.5 font-heading text-sm leading-tight text-tinta md:text-base">
          Lunas
        </p>
      )}
      <p className="border-b-2 border-dashed border-tinta pb-0.5 text-center font-heading text-sm md:text-lg">
        Nota Warung
      </p>
      <ul className="divide-y-2 divide-dashed divide-tinta/30">
        {lines.map((line) => (
          <li
            key={line.fruitId}
            data-fruit-id={line.fruitId}
            data-quantity={line.quantity}
            data-price={line.price}
            className="flex items-center gap-x-2 py-0.5 text-[15px] md:text-lg"
          >
            <FruitImage fruitId={line.fruitId} size={40} decorative className="h-6 w-6 md:h-8 md:w-8" />
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
      <p className="flex items-center justify-between border-t-4 border-tinta pt-0.5 font-heading text-lg md:pt-1 md:text-2xl">
        <span>Total</span>
        <span data-total={showTotal ? total : undefined}>
          {showTotal ? formatRupiah(total) : '?'}
        </span>
      </p>
    </div>
  )
}

export default Receipt
