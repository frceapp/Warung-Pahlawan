import { formatRupiah } from '../game/format.js'
import { sumMoney } from '../game/payment.js'
import MoneyImage from './MoneyImage.jsx'

// Kembalian yang sedang disusun anak, beserta jumlahnya. Uang yang sama
// dikelompokkan ("Rp500 ×5") supaya tetap muat di layar HP; tombolnya
// mengembalikan satu lembar ke laci.
function ChangeTray({ values, onRemove, onClear }) {
  const total = sumMoney(values)
  const groups = [...new Set(values)]
    .sort((a, b) => b - a)
    .map((value) => ({ value, count: values.filter((item) => item === value).length }))

  return (
    <div className="flex flex-col gap-1 md:gap-2">
      <div className="flex flex-wrap items-center gap-x-2">
        <p className="flex flex-wrap items-baseline gap-x-2 text-sm md:text-lg">
          <span>
            Kembalianmu<span className="hidden md:inline"> yang sudah disusun</span>:
          </span>
          <span
            key={total}
            className="inline-block font-heading text-xl motion-safe:animate-pop md:text-2xl"
            data-change-total={total}
          >
            {formatRupiah(total)}
          </span>
        </p>
        {values.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="ml-auto min-h-12 rounded-lg px-2 text-sm font-bold underline underline-offset-4 hover:bg-kapur md:text-base"
          >
            Kosongkan
          </button>
        )}
      </div>
      {values.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5 md:gap-2" aria-label="Uang kembalian">
          {groups.map(({ value, count }) => (
            <li key={value}>
              <button
                type="button"
                onClick={() => onRemove(values.lastIndexOf(value))}
                className="flex min-h-12 items-center gap-1 rounded-lg border-2 border-tinta bg-kapur py-0.5 pr-2 pl-1 text-sm font-bold transition-colors hover:bg-langit md:border-4"
              >
                <MoneyImage value={value} size={56} decorative className="h-6 w-10 md:h-[34px] md:w-14" />
                <span aria-hidden="true">
                  ×{count} <span className="ml-0.5">✕</span>
                </span>
                <span className="sr-only">
                  Kembalikan satu {formatRupiah(value)} ke laci. Sekarang ada {count}.
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm md:text-base">
          Belum ada uang. Ketuk uang di laci. Kembalian = uang pembeli − total belanja. Jika
          uangnya pas, tidak perlu kembalian.
        </p>
      )}
    </div>
  )
}

export default ChangeTray
