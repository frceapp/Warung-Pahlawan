import { STEPS } from '../game/session.js'

const STATUS_TEXT = { done: 'selesai', active: 'sedang dikerjakan', todo: 'belum' }

// Penanda "urutan langkah": algoritma melayani satu pembeli.
function StepTracker({ currentStep }) {
  const activeIndex = STEPS.findIndex((step) => step.id === currentStep)
  const allDone = activeIndex === -1

  return (
    <nav aria-label="Urutan langkah">
      <p className="mb-1 text-sm font-bold">Urutan langkah</p>
      <ol className="grid grid-cols-4 gap-1.5 sm:gap-3">
        {STEPS.map((step, index) => {
          const status =
            allDone || index < activeIndex ? 'done' : index === activeIndex ? 'active' : 'todo'
          return (
            <li
              key={step.id}
              aria-current={status === 'active' ? 'step' : undefined}
              className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl border-4 border-tinta px-0.5 py-1 text-center text-[13px] leading-tight sm:flex-row sm:gap-2 sm:text-base ${
                status === 'active'
                  ? 'bg-pisang font-bold'
                  : 'bg-kapur'
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-tinta font-heading text-sm ${
                  status === 'done' ? 'bg-daun text-kapur' : ''
                }`}
              >
                {status === 'done' ? (
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
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
