import { useEffect, useReducer, useRef } from 'react'
import Awning from '../components/Awning.jsx'
import Button from '../components/Button.jsx'
import ChangeStep from '../components/ChangeStep.jsx'
import CharacterAvatar from '../components/CharacterAvatar.jsx'
import CountStep from '../components/CountStep.jsx'
import FeedbackMessage from '../components/FeedbackMessage.jsx'
import GreetStep from '../components/GreetStep.jsx'
import MoneyImage from '../components/MoneyImage.jsx'
import OrderList from '../components/OrderList.jsx'
import PickStep from '../components/PickStep.jsx'
import ServedStep from '../components/ServedStep.jsx'
import SpeechBubble from '../components/SpeechBubble.jsx'
import StepTracker from '../components/StepTracker.jsx'
import { formatRupiah } from '../game/format.js'
import { getLevelFruits } from '../game/order.js'
import {
  createSession,
  getCurrentCustomer,
  getSessionScore,
  sessionReducer,
  STEPS,
  summarizeSession,
} from '../game/session.js'

function PlayScreen({ level, rng, onExit, onFinish }) {
  const [state, dispatch] = useReducer(sessionReducer, null, () => createSession(level, rng))
  const customer = getCurrentCustomer(state)
  const { character } = customer
  const fruits = getLevelFruits(level)
  const stepIndex = STEPS.findIndex((step) => step.id === state.step)
  const stepName = STEPS[stepIndex]?.name

  // Pindahkan fokus ke judul langkah setiap kali langkah berganti, supaya
  // pengguna keyboard dan pembaca layar langsung tahu langkah barunya.
  const headingRef = useRef(null)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    headingRef.current?.focus({ preventScroll: true })
    headingRef.current?.scrollIntoView({ block: 'nearest' })
  }, [state.index, state.step])

  // Laporkan hasil sekali saja ketika level selesai.
  const hasReported = useRef(false)
  useEffect(() => {
    if (state.step !== 'finished' || !onFinish || hasReported.current) return
    hasReported.current = true
    onFinish(summarizeSession(state))
  }, [state, onFinish])

  let bubble = null
  let body = null
  if (state.step === 'greet') {
    bubble = (
      <>
        <p className="font-bold">Halo! Aku {character.name}.</p>
        <p>{customer.fact}</p>
      </>
    )
    body = (
      <GreetStep customerName={character.name} onStart={() => dispatch({ type: 'startServing' })} />
    )
  } else if (state.step === 'pick') {
    bubble = (
      <>
        <p className="mb-2">Aku mau beli ini:</p>
        <OrderList order={customer.order} />
      </>
    )
    body = (
      <PickStep
        fruits={fruits}
        bag={state.bag}
        onAdd={(fruitId) => dispatch({ type: 'addFruit', fruitId })}
        onRemove={(fruitId) => dispatch({ type: 'removeFruit', fruitId })}
        onWrap={() => dispatch({ type: 'wrapOrder' })}
      />
    )
  } else if (state.step === 'count') {
    bubble = <p>Terima kasih sudah dibungkus. Berapa semuanya?</p>
    body = (
      <CountStep
        level={level}
        customer={customer}
        wrongTotals={state.wrongTotals}
        onChoose={(amount) => dispatch({ type: 'chooseTotal', amount })}
        onConfirm={() => dispatch({ type: 'confirmTotal' })}
      />
    )
  } else if (state.step === 'change') {
    bubble = (
      <>
        <p className="mb-2">Ini uangku.</p>
        <ul className="flex flex-wrap gap-2" aria-label="Uang dari pembeli">
          {customer.payment.notes.map((value, index) => (
            <li key={`${index}-${value}`}>
              <MoneyImage value={value} size={96} />
            </li>
          ))}
        </ul>
        <p className="mt-1 font-bold">Jumlahnya {formatRupiah(customer.payment.amount)}.</p>
      </>
    )
    body = (
      <ChangeStep
        level={level}
        customer={customer}
        givenChange={state.givenChange}
        onAdd={(value) => dispatch({ type: 'addMoney', value })}
        onRemove={(index) => dispatch({ type: 'removeMoney', index })}
        onClear={() => dispatch({ type: 'clearMoney' })}
        onGive={() => dispatch({ type: 'giveChange' })}
        onNoChange={() => dispatch({ type: 'noChange' })}
      />
    )
  } else if (state.step === 'served') {
    bubble = <p>Terima kasih! Senang belanja di warungmu.</p>
    body = (
      <ServedStep
        isLast={state.index + 1 >= state.customers.length}
        onNext={() => dispatch({ type: 'nextCustomer' })}
      />
    )
  } else {
    const summary = summarizeSession(state)
    bubble = <p>Terima kasih! Sampai jumpa lagi.</p>
    body = (
      <div className="flex flex-col items-start gap-3">
        <p className="text-lg">
          Warung tutup. Skormu {summary.score} dari {summary.maxScore}, dapat {summary.stars} bintang.
        </p>
        <Button onClick={onExit}>Kembali ke beranda</Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Awning />
      <header className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 pt-1">
        <Button variant="quiet" onClick={onExit} className="px-3 text-base">
          <span aria-hidden="true">←</span> Beranda
        </Button>
        <p className="rounded-xl border-4 border-tinta bg-terpal px-3 py-1 font-heading text-lg text-kapur">
          {level.name}
        </p>
        <p className="flex gap-3 text-base font-bold">
          <span>
            Pembeli {state.index + 1} dari {state.customers.length}
          </span>
          <span data-score={getSessionScore(state)}>Skor {getSessionScore(state)}</span>
        </p>
      </header>

      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-5xl px-4 pt-3">
          <StepTracker currentStep={state.step} />
        </div>

        <section
          aria-label="Pembeli"
          className="mx-auto flex w-full max-w-5xl items-start gap-4 px-4 py-4 sm:gap-6"
        >
          <div
            key={state.index}
            className="flex w-24 shrink-0 flex-col items-center gap-1 text-center motion-safe:animate-arrive sm:w-40"
          >
            <CharacterAvatar
              characterId={character.id}
              size={160}
              decorative
              className="h-24 w-24 sm:h-40 sm:w-40"
            />
            <p className="w-full rounded-lg border-4 border-tinta bg-terpal-tua px-1 py-0.5 font-heading text-sm leading-tight text-kapur sm:text-base">
              {character.name}
            </p>
            <p className="text-xs leading-tight sm:text-sm">{character.origin}</p>
          </div>
          <SpeechBubble key={`${state.index}-${state.step}`} className="mt-2 min-w-0 flex-1">
            {bubble}
          </SpeechBubble>
        </section>

        <section
          aria-labelledby="step-title"
          className="flex-1 border-t-4 border-tinta bg-kayu pb-8"
        >
          <div className="mx-auto w-full max-w-5xl px-4 pt-4">
            <div className="flex flex-col gap-4 rounded-2xl border-4 border-tinta bg-kapur p-3 sm:p-5">
              <h2
                id="step-title"
                ref={headingRef}
                tabIndex={-1}
                className="font-heading text-2xl"
              >
                {stepName
                  ? `Langkah ${stepIndex + 1}: ${stepName}`
                  : state.step === 'served'
                    ? 'Pembeli selesai dilayani'
                    : 'Warung tutup'}
              </h2>
              {body}
              <FeedbackMessage feedback={state.feedback} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default PlayScreen
