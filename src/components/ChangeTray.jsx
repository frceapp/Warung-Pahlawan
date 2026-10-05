import { formatRupiah } from '../game/format.js'
import { sumMoney } from '../game/payment.js'
import MoneyImage from './MoneyImage.jsx'

// Kembalian yang sedang disusun anak, beserta jumlahnya.
function ChangeTray({ values, onRemove, onClear }) {
  const total = sumMoney(values)

  return (
    <div className="flex flex-col gap-2">
      <p className="flex flex-wrap items-baseline gap-x-2 text-lg">
        <span>Kembalian yang kamu susun:</span>
        <span className="font-heading text-2xl" data-change-total={total}>
          {formatRupiah(total)}
        </span>
      </p>
      {values.length > 0 ? (
        <>
          <ul className="flex flex-wrap gap-2" aria-label="Uang kembalian">
            {values.map((value, index) => (
              <li key={`${index}-${value}`}>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="flex min-h-12 items-center gap-1 rounded-lg border-4 border-tinta bg-kapur py-1 pr-2 pl-1 text-sm font-bold transition-colors hover:bg-langit"
                >
                  <MoneyImage value={value} size={56} decorative />
                  <span aria-hidden="true">✕</span>
                  <span className="sr-only">Kembalikan {formatRupiah(value)} ke laci</span>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onClear}
            className="min-h-12 self-start rounded-lg px-2 text-base font-bold underline underline-offset-4 hover:bg-langit"
          >
            Kosongkan kembalian
          </button>
        </>
      ) : (
        <p className="text-base">Belum ada uang. Ketuk uang di laci.</p>
      )}
    </div>
  )
}

export default ChangeTray
