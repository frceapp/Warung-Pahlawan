import { formatRupiah } from '../game/format.js'

// Tiga pilihan total. Pilihan yang sudah dicoba dan belum tepat diberi
// tanda teks, bukan warna saja, dan tidak bisa dipilih lagi.
function TotalChoices({ choices, wrongChoices, onChoose }) {
  return (
    <ul className="grid grid-cols-3 gap-2 md:gap-3" aria-label="Pilihan total belanja">
      {choices.map((amount) => {
        const isWrong = wrongChoices.includes(amount)
        return (
          <li key={amount}>
            <button
              type="button"
              disabled={isWrong}
              onClick={() => onChoose(amount)}
              data-amount={amount}
              className="flex min-h-12 w-full flex-col items-center justify-center rounded-xl border-4 border-tinta bg-pisang px-1 py-1 font-heading text-lg leading-tight shadow-[0_4px_0_var(--color-tinta)] transition-transform duration-150 active:translate-y-1 active:shadow-none disabled:translate-y-0 disabled:bg-kapur disabled:shadow-none motion-safe:hover:-translate-y-0.5 md:min-h-14 md:text-2xl"
            >
              <span className={isWrong ? 'line-through' : undefined}>{formatRupiah(amount)}</span>
              {isWrong && <span className="font-body text-xs font-bold md:text-sm">belum tepat</span>}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default TotalChoices
