import { formatRupiah } from '../game/format.js'
import MoneyImage from './MoneyImage.jsx'

// Laci uang: ketuk uang untuk menambahkannya ke kembalian.
function MoneyDrawer({ values, onAdd }) {
  return (
    <ul className="grid grid-cols-3 gap-1.5 md:grid-flow-col md:grid-cols-none md:auto-cols-fr md:gap-2">
      {values.map((value) => (
        <li key={value}>
          <button
            type="button"
            data-money={value}
            onClick={() => onAdd(value)}
            className="group flex min-h-12 w-full flex-col items-center justify-center gap-0.5 rounded-xl border-4 border-tinta bg-kapur px-0.5 py-0.5 text-xs font-bold md:px-1 shadow-[0_3px_0_var(--color-tinta)] transition-transform duration-150 active:translate-y-1 active:shadow-none motion-safe:hover:-translate-y-0.5 md:gap-0.5 md:py-1 md:text-base md:shadow-[0_4px_0_var(--color-tinta)]"
          >
            <MoneyImage
              value={value}
              size={80}
              decorative
              className="h-[34px] w-14 shrink-0 transition-transform duration-150 motion-safe:group-hover:-rotate-3 md:h-[43px] md:w-[72px]"
            />
            <span className="sr-only md:not-sr-only">
              <span className="sr-only">Tambah </span>
              {formatRupiah(value)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default MoneyDrawer
