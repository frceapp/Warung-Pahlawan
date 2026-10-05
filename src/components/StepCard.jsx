import { STEP_CARD_TEXT } from '../data/sequence.js'

// Kartu langkah di mode "Susun Langkah". Seluruh kartu adalah tombol.
// `status` hanya dipakai setelah dicek: 'wrong' memberi tanda teks
// "belum pas", 'right' memberi tanda teks "pas". `compact`: di HP hanya
// nama langkah yang tampil (keterangan tetap ada untuk pembaca layar).
function StepCard({ id, name, actionLabel, onClick, status, compact = false, disabled = false, ...rest }) {
  const border =
    status === 'wrong' ? 'border-cabai' : status === 'right' ? 'border-daun' : 'border-tinta'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${actionLabel}: ${name}${status === 'wrong' ? ' (belum pas)' : ''}`}
      className={`flex min-h-12 w-full items-center gap-2 rounded-xl border-4 bg-kapur px-2 py-1 text-left shadow-[0_3px_0_var(--color-tinta)] transition-transform duration-150 active:translate-y-1 active:shadow-none disabled:shadow-none motion-safe:hover:-translate-y-0.5 disabled:hover:translate-y-0 md:px-3 md:py-2 ${border}`}
      {...rest}
    >
      <span className="min-w-0 flex-1">
        <span className="block font-heading text-lg leading-tight md:text-xl">{name}</span>
        <span
          className={`block text-xs leading-snug md:not-sr-only md:text-sm ${compact ? 'sr-only' : ''}`}
        >
          {STEP_CARD_TEXT[id].description}
        </span>
      </span>
      {status === 'wrong' && (
        <span className="shrink-0 rounded-md bg-cabai px-1.5 py-0.5 text-xs font-bold text-kapur">
          belum pas
        </span>
      )}
      {status === 'right' && (
        <span className="shrink-0 rounded-md border-2 border-daun px-1.5 py-0.5 text-xs font-bold">
          pas
        </span>
      )}
    </button>
  )
}

export default StepCard
