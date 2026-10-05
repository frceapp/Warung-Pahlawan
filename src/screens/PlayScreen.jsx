import { useEffect, useReducer, useRef, useState } from 'react'
import ActionBar from '../components/ActionBar.jsx'
import Awning from '../components/Awning.jsx'
import Button from '../components/Button.jsx'
import ChangeStep from '../components/ChangeStep.jsx'
import CountStep from '../components/CountStep.jsx'
import CustomerSpot from '../components/CustomerSpot.jsx'
import MoneyImage from '../components/MoneyImage.jsx'
import OrderList from '../components/OrderList.jsx'
import PickStep from '../components/PickStep.jsx'
import ServedStep from '../components/ServedStep.jsx'
import StepTracker from '../components/StepTracker.jsx'
import TotalChoices from '../components/TotalChoices.jsx'
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

// Petunjuk yang tampil di bar aksi saat sebuah langkah dimulai, selama belum
// ada umpan balik dari aksi anak di langkah itu.
const STEP_HINTS = {
  change: {
    id: 'hint-change',
    tone: 'info',
    text: 'Kembalian = uang pembeli dikurangi total belanja. Uangnya pas? Pilih "Tidak perlu kembalian".',
  },
}

// Kartu pembeli lama keluar 250 ms (atau memudar 150 ms) sebelum pembeli
// berikutnya datang. Timer ini cadangan kalau animationend tidak terpicu,
// misalnya saat tab tersembunyi.
const LEAVE_FALLBACK_MS = 400

// Layar main memakai tinggi layar penuh: terpal, header, urutan langkah,
// pembeli, area kerja (satu-satunya bagian yang boleh di-scroll), dan bar
// aksi yang selalu terlihat di bawah.
function PlayScreen({ level, rng, onExit, onFinish }) {
  const [state, dispatch] = useReducer(sessionReducer, null, () => createSession(level, rng))
  const customer = getCurrentCustomer(state)
  const { character } = customer
  const fruits = getLevelFruits(level)
  const stepIndex = STEPS.findIndex((step) => step.id === state.step)
  const stepName = STEPS[stepIndex]?.name
  const score = getSessionScore(state)

  // Pindahkan fokus ke judul langkah setiap kali langkah berganti, supaya
  // pengguna keyboard dan pembaca layar langsung tahu langkah barunya.
  const headingRef = useRef(null)
  const workRef = useRef(null)
  const isFirstRender = useRef(true)
  useEffect(() => {
    workRef.current?.scrollTo?.({ top: 0 })
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    headingRef.current?.focus({ preventScroll: true })
  }, [state.index, state.step])

  // Umpan balik di bar aksi hanya untuk langkah yang sedang aktif. Pesan yang
  // terbawa dari langkah sebelumnya disembunyikan dan diganti petunjuk langkah
  // ini (kalau ada). Pengecualian: pesan "pembeli selesai dilayani" memang
  // milik langkah selesai.
  const stepKey = `${state.index}-${state.step}`
  const [stepEntry, setStepEntry] = useState({ key: stepKey, feedbackId: state.feedback?.id ?? 0 })
  let entryFeedbackId = stepEntry.feedbackId
  if (stepEntry.key !== stepKey) {
    entryFeedbackId = state.feedback?.id ?? 0
    setStepEntry({ key: stepKey, feedbackId: entryFeedbackId })
  }
  const ownFeedback =
    state.feedback && (state.step === 'served' || state.feedback.id > entryFeedbackId)
      ? state.feedback
      : null
  const visibleFeedback = ownFeedback ?? STEP_HINTS[state.step] ?? null

  // Tanda "geser ke bawah" saat isi area kerja lebih tinggi dari ruangnya.
  const contentRef = useRef(null)
  const [canScrollDown, setCanScrollDown] = useState(false)
  useEffect(() => {
    const work = workRef.current
    if (!work) return undefined
    const update = () =>
      setCanScrollDown(work.scrollHeight - work.clientHeight - work.scrollTop > 8)
    update()
    work.addEventListener('scroll', update, { passive: true })
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(work)
    if (contentRef.current) observer?.observe(contentRef.current)
    return () => {
      work.removeEventListener('scroll', update)
      observer?.disconnect()
    }
  }, [])

  // Pembeli berikutnya: kartu lama pergi dulu, baru giliran pembeli baru.
  // `advancedFor` menjaga supaya satu pembeli hanya dilewati sekali, walau
  // animationend dan timer cadangan sama-sama terpicu.
  const [leavingIndex, setLeavingIndex] = useState(null)
  const isLeaving = leavingIndex === state.index
  const advancedFor = useRef(-1)
  function advanceFrom(index) {
    if (advancedFor.current === index) return
    advancedFor.current = index
    dispatch({ type: 'nextCustomer' })
  }
  // advanceFrom hanya memakai dispatch dan ref, keduanya stabil.
  useEffect(() => {
    if (leavingIndex === null) return undefined
    const timer = setTimeout(() => advanceFrom(leavingIndex), LEAVE_FALLBACK_MS)
    return () => clearTimeout(timer)
  }, [leavingIndex])

  // Laporkan hasil sekali saja ketika level selesai.
  const hasReported = useRef(false)
  useEffect(() => {
    if (state.step !== 'finished' || !onFinish || hasReported.current) return
    hasReported.current = true
    onFinish(summarizeSession(state))
  }, [state, onFinish])

  let bubble = null
  let body = null
  let actions = null

  if (state.step === 'greet') {
    bubble = (
      <>
        <p className="font-bold">Halo! Aku {character.name}.</p>
        <p>{customer.fact}</p>
      </>
    )
    actions = (
      <Button onClick={() => dispatch({ type: 'startServing' })} className="w-full md:w-auto md:self-start">
        Mulai melayani
      </Button>
    )
  } else if (state.step === 'pick') {
    bubble = (
      <>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>Aku mau beli:</span>
          <OrderList order={customer.order} />
        </div>
      </>
    )
    body = (
      <PickStep
        fruits={fruits}
        bag={state.bag}
        onAdd={(fruitId) => dispatch({ type: 'addFruit', fruitId })}
        onRemove={(fruitId) => dispatch({ type: 'removeFruit', fruitId })}
      />
    )
    actions = (
      <Button onClick={() => dispatch({ type: 'wrapOrder' })} className="w-full md:w-auto md:self-start">
        Bungkus pesanan
      </Button>
    )
  } else if (state.step === 'count') {
    bubble = <p>Terima kasih sudah dibungkus. Berapa semuanya?</p>
    body = <CountStep level={level} customer={customer} />
    actions =
      level.totalMode === 'shown' ? (
        <Button onClick={() => dispatch({ type: 'confirmTotal' })} className="w-full md:w-auto md:self-start">
          Terima uang pembeli
        </Button>
      ) : (
        <TotalChoices
          choices={customer.totalChoices}
          wrongChoices={state.wrongTotals}
          onChoose={(amount) => dispatch({ type: 'chooseTotal', amount })}
        />
      )
  } else if (state.step === 'change') {
    bubble = (
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 md:gap-x-2">
        <span>Uangku:</span>
        <ul className="flex flex-wrap gap-0.5 md:gap-1" aria-label="Uang dari pembeli">
          {customer.payment.notes.map((value, index) => (
            <li key={`${index}-${value}`}>
              <MoneyImage value={value} size={96} className="h-[29px] w-12 md:h-12 md:w-20" />
            </li>
          ))}
        </ul>
        <span className="font-bold" data-paid={customer.payment.amount}>
          {formatRupiah(customer.payment.amount)}
        </span>
        <span className="basis-full">
          Total belanjaku{' '}
          <span className="font-bold" data-total={customer.total}>
            {formatRupiah(customer.total)}
          </span>
          .
        </span>
      </div>
    )
    body = (
      <ChangeStep
        level={level}
        givenChange={state.givenChange}
        onAdd={(value) => dispatch({ type: 'addMoney', value })}
        onRemove={(index) => dispatch({ type: 'removeMoney', index })}
        onClear={() => dispatch({ type: 'clearMoney' })}
      />
    )
    actions = (
      <div className="grid grid-cols-2 gap-2 md:flex md:gap-3">
        <Button onClick={() => dispatch({ type: 'giveChange' })} className="px-1 text-[13px] md:px-5 md:text-lg">
          Berikan kembalian
        </Button>
        <Button
          variant="secondary"
          onClick={() => dispatch({ type: 'noChange' })}
          className="px-1 text-[13px] md:px-5 md:text-lg"
        >
          Tidak perlu kembalian
        </Button>
      </div>
    )
  } else if (state.step === 'served') {
    const isLast = state.index + 1 >= state.customers.length
    bubble = <p>Terima kasih! Senang belanja di warungmu.</p>
    body = <ServedStep isLast={isLast} />
    actions = (
      <Button
        onClick={() => (isLast ? advanceFrom(state.index) : setLeavingIndex(state.index))}
        className="w-full md:w-auto md:self-start"
      >
        {isLast ? 'Lihat hasil' : 'Layani pembeli berikutnya'}
      </Button>
    )
  } else {
    const summary = summarizeSession(state)
    bubble = <p>Terima kasih! Sampai jumpa lagi.</p>
    body = (
      <p className="text-lg">
        Warung tutup. Skormu {summary.score} dari {summary.maxScore}, dapat {summary.stars} bintang.
      </p>
    )
    actions = (
      <Button onClick={onExit} className="w-full md:w-auto md:self-start">
        Kembali ke beranda
      </Button>
    )
  }

  const heading = stepName
    ? `Langkah ${stepIndex + 1}: ${stepName}`
    : state.step === 'served'
      ? 'Pembeli selesai dilayani'
      : 'Warung tutup'
  const isGreet = state.step === 'greet'

  return (
    <div className="relative flex h-[100vh] flex-col overflow-hidden supports-[height:100dvh]:h-dvh">
      <Awning thin />
      <header className="mx-auto flex w-full max-w-5xl shrink-0 items-center gap-2 px-3 pt-1.5 md:px-4 md:pt-1">
        <Button
          variant="quiet"
          onClick={onExit}
          aria-label="Kembali ke beranda"
          className="w-12 shrink-0 px-0 text-base md:w-auto md:px-3"
        >
          <span aria-hidden="true">←</span>
          <span className="hidden md:inline">Beranda</span>
        </Button>
        <h1 className="min-w-0 truncate rounded-lg border-4 border-tinta bg-terpal px-2 py-0.5 font-heading text-base text-kapur md:mx-auto md:rounded-xl md:px-3 md:py-1 md:text-lg">
          {level.name}
        </h1>
        <p className="ml-auto flex shrink-0 flex-col items-end text-sm leading-tight font-bold md:ml-0 md:flex-row md:gap-3 md:text-base">
          <span>
            Pembeli {state.index + 1}
            <span className="hidden md:inline"> dari {state.customers.length}</span>
            <span className="md:hidden">/{state.customers.length}</span>
          </span>
          <span data-score={score}>Skor {score}</span>
        </p>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        <div className="mx-auto w-full max-w-5xl shrink-0 px-3 pt-1.5 md:px-4 md:pt-3">
          <StepTracker currentStep={state.step} />
        </div>

        {!isGreet && (
          <section
            aria-label="Pembeli"
            className="mx-auto w-full max-w-5xl shrink-0 px-3 py-1.5 md:px-4 md:py-3"
          >
            <CustomerSpot character={character} leaving={isLeaving} onLeft={() => advanceFrom(state.index)}>
              {bubble}
            </CustomerSpot>
          </section>
        )}

        <section
          ref={workRef}
          aria-labelledby="step-title"
          className={`relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto border-t-4 border-tinta ${isGreet ? 'mt-2 bg-langit md:mt-3' : 'bg-kayu'}`}
        >
          <div ref={contentRef} className="mx-auto w-full max-w-5xl px-2 py-1.5 md:px-4 md:py-2">
            <div
              className={`flex flex-col gap-2 rounded-2xl border-4 border-tinta p-1.5 md:gap-3 md:p-4 ${isGreet ? 'border-transparent bg-transparent' : 'bg-kapur'}`}
            >
              <h2
                id="step-title"
                ref={headingRef}
                tabIndex={-1}
                className={isGreet ? 'sr-only' : 'sr-only md:not-sr-only md:font-heading md:text-xl'}
              >
                {heading}
              </h2>
              {isGreet ? (
                <section aria-label="Pembeli">
                  <CustomerSpot key={state.index} character={character} large>
                    {bubble}
                  </CustomerSpot>
                </section>
              ) : (
                body
              )}
            </div>
          </div>
          <div
            aria-hidden="true"
            data-scroll-hint
            className={`pointer-events-none sticky bottom-0 -mt-8 flex h-8 items-end justify-end bg-linear-to-t from-tinta/35 to-transparent px-2 pb-1 transition-opacity duration-200 md:justify-center ${canScrollDown ? 'opacity-100' : 'opacity-0'}`}
          >
            <span className="rounded-full border-2 border-tinta bg-kapur px-3 py-0.5 text-xs font-bold">
              Geser ke bawah ↓
            </span>
          </div>
        </section>

        <ActionBar feedback={visibleFeedback}>{actions}</ActionBar>
      </main>
    </div>
  )
}

export default PlayScreen
