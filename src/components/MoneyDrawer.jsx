import { formatRupiah } from '../game/format.js'
import MoneyImage from './MoneyImage.jsx'

// Laci uang: ketuk uang untuk menambahkannya ke kembalian.
function MoneyDrawer({ values, onAdd }) {
  return (
    <ul className="grid grid-cols-3 gap-2 sm:gap-3">
      {values.map((value) => (
        <li key={value}>
          <button
            type="button"
            data-money={value}
            onClick={() => onAdd(value)}
            className="group flex min-h-12 w-full flex-col items-center gap-1 rounded-xl border-4 border-tinta bg-kapur px-1 py-2 text-base font-bold shadow-[0_4px_0_var(--color-tinta)] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
          >
            <MoneyImage
              value={value}
              size={80}
              decorative
              className="transition-transform duration-150 group-hover:-rotate-3"
            />
            <span>
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
