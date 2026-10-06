import { useEffect, useReducer, useRef } from 'react'
import ActionBar from '../components/ActionBar.jsx'
import Awning from '../components/Awning.jsx'
import Button from '../components/Button.jsx'
import StepCard from '../components/StepCard.jsx'
import { useFeedbackSound } from '../lib/useFeedbackSound.js'
import {
  CORRECT_ORDER,
  createSequenceState,
  describeSequenceResult,
  sequenceReducer,
  shuffleCards,
} from '../game/sequence.js'
import { STEPS } from '../game/session.js'

function stepName(id) {
  return STEPS.find((step) => step.id === id).name
}

// Mode "Susun Langkah": anak menyusun empat langkah melayani pembeli.
// Layar setinggi layar penuh; tombol aksi ada di bar bawah.
function SequenceScreen({ rng, onExit }) {
  const [state, dispatch] = useReducer(sequenceReducer, null, () => createSequenceState(rng))
  const { result } = state
  const isSolved = result?.isCorrect ?? false
  const wrong = new Set(result?.wrongPositions ?? [])
  const feedback = result ? { id: state.checkCount, ...describeSequenceResult(result) } : null
  useFeedbackSound(feedback)

  const headingRef = useRef(null)
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  // Setelah kartu dipindah, tombolnya hilang. Pindahkan fokus ke kartu
  // berikutnya di tumpukan, atau ke tombol cek kalau tumpukan sudah habis.
  const rootRef = useRef(null)
  const pendingFocus = useRef(false)
  useEffect(() => {
    if (!pendingFocus.current) return
    pendingFocus.current = false
    const next =
      rootRef.current?.querySelector('[data-pool-card]') ??
      rootRef.current?.querySelector('[data-check-button]')
    next?.focus()
  }, [state.pool, state.placed])

  function place(id) {
    pendingFocus.current = true
    dispatch({ type: 'place', id })
  }

  function remove(id) {
    pendingFocus.current = true
    dispatch({ type: 'remove', id })
  }

  return (
    <div
      ref={rootRef}
      className="relative flex h-[100vh] flex-col overflow-hidden supports-[height:100dvh]:h-dvh"
    >
      <Awning thin />
      <header className="mx-auto flex w-full max-w-3xl shrink-0 items-center gap-2 px-3 pt-1.5 md:px-4">
        <Button
          variant="quiet"
          onClick={onExit}
          aria-label="Kembali ke beranda"
          className="w-12 shrink-0 px-0 text-base md:w-auto md:px-3"
        >
          <span aria-hidden="true">←</span>
          <span className="hidden md:inline">Beranda</span>
        </Button>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="rounded-lg border-4 border-tinta bg-terpal px-2 py-0.5 font-heading text-lg text-kapur md:text-2xl"
        >
          Susun Langkah
        </h1>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        <section
          aria-label="Susun urutan"
          className="relative mt-1.5 min-h-0 flex-1 overflow-y-auto border-t-4 border-tinta bg-kayu"
        >
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-2 py-1.5 md:gap-3 md:px-4 md:py-3">
            <div className="flex flex-col gap-1.5 rounded-2xl border-4 border-tinta bg-kapur p-2 md:gap-3 md:p-4">
              <p className="text-sm leading-snug md:text-base">
                Ketuk kartu untuk menaruh atau mengeluarkannya.
              </p>

              <section aria-labelledby="slots-title">
                <h2 id="slots-title" className="mb-1 font-heading text-base md:text-xl">
                  Urutanmu
                </h2>
                <ol className="flex flex-col gap-1 md:gap-2">
                  {CORRECT_ORDER.map((_, index) => {
                    const id = state.placed[index]
                    return (
                      <li key={index} className="flex items-center gap-2" data-slot={index}>
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-tinta bg-pisang font-heading text-base"
                        >
                          {index + 1}
                        </span>
                        {id ? (
                          <div className="min-w-0 flex-1">
                            <StepCard
                              id={id}
                              name={stepName(id)}
                              actionLabel={`Keluarkan dari urutan nomor ${index + 1}`}
                              onClick={() => remove(id)}
                              status={result && (wrong.has(index) ? 'wrong' : isSolved ? 'right' : undefined)}
                              disabled={isSolved}
                              compact
                              data-placed-card={id}
                            />
                          </div>
                        ) : (
                          <p className="flex min-h-10 min-w-0 flex-1 items-center rounded-xl border-4 border-dashed border-tinta/50 px-2 text-sm md:min-h-12">
                            Kotak {index + 1} masih kosong
                          </p>
                        )}
                      </li>
                    )
                  })}
                </ol>
              </section>

              {state.pool.length > 0 && (
                <section aria-labelledby="pool-title">
                  <h2 id="pool-title" className="mb-1 font-heading text-base md:text-xl">
                    Kartu langkah
                  </h2>
                  <ul className="grid grid-cols-2 gap-1.5 md:gap-2">
                    {state.pool.map((id) => (
                      <li key={id}>
                        <StepCard
                          id={id}
                          name={stepName(id)}
                          actionLabel={`Taruh di urutan nomor ${state.placed.length + 1}`}
                          onClick={() => place(id)}
                          data-pool-card={id}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </section>

        <ActionBar feedback={feedback}>
          {isSolved ? (
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-3">
              <Button
                onClick={() =>
                  dispatch({ type: 'restart', pool: shuffleCards(CORRECT_ORDER, rng) })
                }
                className="px-2 text-base md:px-5"
              >
                Main lagi
              </Button>
              <Button variant="secondary" onClick={onExit} className="px-2 text-base md:px-5">
                Kembali ke beranda
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => dispatch({ type: 'check' })}
              data-check-button
              className="w-full md:w-auto md:self-start"
            >
              Cek urutan
            </Button>
          )}
        </ActionBar>
      </main>
    </div>
  )
}

export default SequenceScreen
