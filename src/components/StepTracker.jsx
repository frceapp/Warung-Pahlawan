import { STEPS } from '../game/session.js'

const STATUS_TEXT = { done: 'selesai', active: 'sedang dikerjakan', todo: 'belum' }

// Penanda "urutan langkah": algoritma melayani satu pembeli.
// Di HP dibuat kompak: nomor kecil dengan nama di bawahnya.
function StepTracker({ currentStep }) {
  const activeIndex = STEPS.findIndex((step) => step.id === currentStep)
  const allDone = activeIndex === -1

  return (
    <nav aria-label="Urutan langkah">
      <p className="sr-only md:not-sr-only md:mb-1 md:text-sm md:font-bold">Urutan langkah</p>
      <ol className="grid grid-cols-4 gap-1 md:gap-3">
        {STEPS.map((step, index) => {
          const status =
            allDone || index < activeIndex ? 'done' : index === activeIndex ? 'active' : 'todo'
          return (
            <li
              key={step.id}
              aria-current={status === 'active' ? 'step' : undefined}
              className={`flex items-center justify-center gap-0.5 rounded-lg border-2 border-tinta px-0 py-1 text-center text-[11px] leading-tight whitespace-nowrap md:min-h-10 md:flex-row md:gap-2 md:rounded-xl md:border-4 md:py-1 md:text-base ${
                status === 'active' ? 'bg-pisang md:font-bold' : 'bg-kapur'
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-tinta font-heading text-[10px] md:h-6 md:w-6 md:text-sm ${
                  status === 'done' ? 'bg-daun text-kapur' : ''
                }`}
              >
                {status === 'done' ? (
                  <svg viewBox="0 0 16 16" className="h-2.5 w-2.5 md:h-3.5 md:w-3.5">
                    <path
                      d="M3 8.5 L6.5 12 L13 4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <span>
                {step.name}
                <span className="sr-only"> ({STATUS_TEXT[status]})</span>
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default StepTracker
