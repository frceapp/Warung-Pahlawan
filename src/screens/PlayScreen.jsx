import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { lazy, Suspense, useEffect, useReducer, useRef, useState } from 'react'
import ActionBar from '../components/ActionBar.jsx'
import Awning from '../components/Awning.jsx'
import Button from '../components/Button.jsx'
import CashCounter from '../components/CashCounter.jsx'
import ChangeStep from '../components/ChangeStep.jsx'
import CountStep from '../components/CountStep.jsx'
import CustomerStage from '../components/CustomerStage.jsx'
import SoundToggle from '../components/SoundToggle.jsx'
import MoneyImage from '../components/MoneyImage.jsx'
import OrderList from '../components/OrderList.jsx'
import PickStep from '../components/PickStep.jsx'
import { loadWarungScene } from '../components/scene/loadWarungScene.js'
import ServedStep from '../components/ServedStep.jsx'
import StepTracker from '../components/StepTracker.jsx'
import TotalChoices from '../components/TotalChoices.jsx'
import { getFruit } from '../data/fruits.js'
import { formatRupiah } from '../game/format.js'
import { getRegisterScreen } from '../lib/registerScreen.js'
import { playCoins, playPop } from '../lib/sfx.js'
import { useFeedbackSound } from '../lib/useFeedbackSound.js'
import { getLevelFruits } from '../game/order.js'
import {
  createSession,
  getCurrentCustomer,
  getSessionScore,
  sessionReducer,
  STEPS,
  summarizeSession,
} from '../game/session.js'

// Latar warung dimuat terpisah; data dekorasinya hanya untuk level ini.
const WarungScene = lazy(loadWarungScene)

// Lama laci mesin kasir terbuka setelah "Berikan kembalian" ditekan.
const DRAWER_OPEN_MS = 700

// Petunjuk yang tampil di bar aksi saat sebuah langkah dimulai, selama belum
// ada umpan balik dari aksi anak di langkah itu.
const STEP_HINTS = {
  change: {
    id: 'hint-change',
    tone: 'info',
    text: 'Kembalian = uang pembeli dikurangi total belanja. Uangnya pas? Pilih "Tidak perlu kembalian".',
  },
}

// Lama pembeli "berbicara" (mulut bergerak): sekitar 55 ms per huruf dari
// kalimat di balon bicara, paling sebentar 0,8 detik dan paling lama 4 detik.
function speechMs(text) {
  return Math.min(4000, Math.max(800, text.length * 55))
}

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
  const isGreet = state.step === 'greet'

  // Pindahkan fokus ke judul langkah setiap kali langkah berganti, supaya
  // pengguna keyboard dan pembaca layar langsung tahu langkah barunya.
  const headingRef = useRef(null)
  const greetHeadingRef = useRef(null)
  const workRef = useRef(null)
  const isFirstRender = useRef(true)
  useEffect(() => {
    workRef.current?.scrollTo?.({ top: 0 })
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    // Langkah Sapa punya judul sendiri; area kerja lama mungkin masih memudar.
    const title = state.step === 'greet' ? greetHeadingRef.current : headingRef.current
    title?.focus({ preventScroll: true })
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
  useFeedbackSound(state.feedback)

  // Tanda "geser ke bawah" saat isi area kerja lebih tinggi dari ruangnya.
  // Selama isinya bisa digeser, area kerja juga bisa difokus supaya bisa
  // digeser dengan keyboard.
  const contentRef = useRef(null)
  const [canScrollDown, setCanScrollDown] = useState(false)
  const [isScrollable, setIsScrollable] = useState(false)
  useEffect(() => {
    const work = workRef.current
    if (!work) return undefined
    const update = () => {
      setCanScrollDown(work.scrollHeight - work.clientHeight - work.scrollTop > 8)
      setIsScrollable(work.scrollHeight - work.clientHeight > 1)
    }
    update()
    work.addEventListener('scroll', update, { passive: true })
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(work)
    if (contentRef.current) observer?.observe(contentRef.current)
    return () => {
      work.removeEventListener('scroll', update)
      observer?.disconnect()
    }
    // Area kerja baru ada setelah langkah Sapa, jadi dipasang ulang saat itu.
  }, [isGreet])

  // Laci mesin kasir terbuka sebentar saat anak menekan "Berikan kembalian",
  // lalu menutup lagi (tanpa animasi kalau "kurangi gerakan" aktif).
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerTimer = useRef(0)
  useEffect(() => () => clearTimeout(drawerTimer.current), [])
  function giveChange() {
    clearTimeout(drawerTimer.current)
    setDrawerOpen(true)
    drawerTimer.current = setTimeout(() => setDrawerOpen(false), DRAWER_OPEN_MS)
    dispatch({ type: 'giveChange' })
  }

  const registerScreen = getRegisterScreen(state.step, level.totalMode, customer.total)

  // Laporkan hasil sekali saja ketika level selesai.
  const hasReported = useRef(false)
  useEffect(() => {
    if (state.step !== 'finished' || !onFinish || hasReported.current) return
    hasReported.current = true
    onFinish(summarizeSession(state))
  }, [state, onFinish])

  let bubble = null
  let speech = ''
  let body = null
  let actions = null

  if (state.step === 'greet') {
    speech = `Halo! Aku ${character.name}. ${customer.fact}`
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
    speech = `Aku mau beli: ${customer.order
      .map(({ fruitId, quantity }) => `${quantity} ${getFruit(fruitId).name}`)
      .join(', ')}`
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
        onAdd={(fruitId) => {
          playPop()
          dispatch({ type: 'addFruit', fruitId })
        }}
        onRemove={(fruitId) => dispatch({ type: 'removeFruit', fruitId })}
      />
    )
    actions = (
      <Button onClick={() => dispatch({ type: 'wrapOrder' })} className="w-full md:w-auto md:self-start">
        Bungkus pesanan
      </Button>
    )
  } else if (state.step === 'count') {
    speech = 'Terima kasih sudah dibungkus. Berapa semuanya?'
    bubble = <p>{speech}</p>
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
    speech = `Uangku ${formatRupiah(customer.payment.amount)}. Total belanjaku ${formatRupiah(customer.total)}.`
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
        onAdd={(value) => {
          playCoins()
          dispatch({ type: 'addMoney', value })
        }}
        onRemove={(index) => dispatch({ type: 'removeMoney', index })}
        onClear={() => dispatch({ type: 'clearMoney' })}
      />
    )
    actions = (
      <div className="grid grid-cols-2 gap-2 md:flex md:gap-3">
        <Button onClick={giveChange} className="px-1 text-[13px] md:px-5 md:text-lg">
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
    speech = 'Terima kasih! Senang belanja di warungmu.'
    bubble = <p>{speech}</p>
    body = <ServedStep isLast={isLast} />
    actions = (
      <Button onClick={() => dispatch({ type: 'nextCustomer' })} className="w-full md:w-auto md:self-start">
        {isLast ? 'Lihat hasil' : 'Layani pembeli berikutnya'}
      </Button>
    )
  } else {
    const summary = summarizeSession(state)
    speech = 'Terima kasih! Sampai jumpa lagi.'
    bubble = <p>{speech}</p>
    body = (
      <p className="w-fit rounded-xl border-4 border-tinta bg-kapur px-3 py-1.5 text-lg">
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

  return (
    <div className="relative isolate flex h-[100vh] flex-col overflow-hidden supports-[height:100dvh]:h-dvh">
      <Suspense fallback={null}>
        <WarungScene levelId={level.id} />
      </Suspense>
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
        <p className="ml-auto flex shrink-0 flex-col items-end rounded-lg bg-kapur/90 px-1.5 py-0.5 text-sm leading-tight font-bold md:ml-0 md:flex-row md:gap-3 md:px-2 md:py-1 md:text-base">
          <span>
            Pembeli {state.index + 1}
            <span className="hidden md:inline"> dari {state.customers.length}</span>
            <span className="md:hidden">/{state.customers.length}</span>
          </span>
          <span data-score={score}>Skor {score}</span>
        </p>
        <SoundToggle />
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        <div className="mx-auto w-full max-w-5xl shrink-0 px-3 pt-1.5 md:px-4 md:pt-2">
          <StepTracker currentStep={state.step} />
        </div>

        {isGreet && (
          <h2 ref={greetHeadingRef} tabIndex={-1} className="sr-only">
            {heading}
          </h2>
        )}

        {/* Kamera dekat: panggung pembeli tepat di atas meja kasir. Pembeli
            setengah badan berdiri di belakang meja (pinggang di tepi atas
            meja). Di HP panggung tinggi di langkah Sapa dan memendek halus di
            langkah lain; meja kasir mengisi sisanya dan menjadi tempat kerja. */}
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <div
            data-stage
            className={`relative shrink-0 transition-[height] duration-500 ease-out ${
              isGreet ? 'h-[calc(100%-100px)] md:h-[calc(100%-130px)]' : 'h-[161px] md:h-[335px]'
            }`}
          >
            {/* Satu panggung per pembeli. Saat pembeli berganti, panggung lama
                pergi dulu (karakter berjalan keluar), baru panggung baru masuk. */}
            <AnimatePresence mode="wait">
              <CustomerStage
                key={state.index}
                character={character}
                large={isGreet}
                stepKey={stepKey}
                talkMs={speechMs(speech)}
                reaction={state.feedback ?? undefined}
                farewell={state.step === 'served'}
              >
                {bubble}
              </CustomerStage>
            </AnimatePresence>
          </div>

          {/* Meja kasir selebar layar. Keranjang, kantong, laci, nampan, dan
              mesin kasir ada di atas meja. Isinya muncul setelah langkah Sapa
              dan memudar saat pembeli berganti. */}
          <div
            data-counter
            className="scene-counter relative z-10 flex min-h-0 flex-1 flex-col border-t-4 border-tinta"
          >
            <AnimatePresence initial={false}>
              {!isGreet && (
                <m.section
                  key={`work-${state.index}`}
                  aria-labelledby="step-title"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="relative flex min-h-0 flex-1 flex-col"
                >
                  <CashCounter screen={registerScreen} drawerOpen={drawerOpen} />
                  <div
                    ref={workRef}
                    data-work-area
                    tabIndex={isScrollable ? 0 : undefined}
                    className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto"
                  >
                    <div ref={contentRef} className="mx-auto w-full max-w-5xl px-2 pt-2.5 pb-1 md:px-4 md:pt-3 md:pb-1">
                      <h2 id="step-title" ref={headingRef} tabIndex={-1} className="sr-only">
                        {heading}
                      </h2>
                      <m.div
                        key={stepKey}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-2 md:gap-3"
                      >
                        {body}
                      </m.div>
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
                  </div>
                </m.section>
              )}
            </AnimatePresence>
          </div>
        </div>

        <ActionBar feedback={visibleFeedback}>{actions}</ActionBar>
      </main>
    </div>
  )
}

export default PlayScreen
