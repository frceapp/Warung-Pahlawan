import { AnimatePresence, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { Suspense, useEffect, useReducer, useRef, useState } from 'react'
import ActionBar from '../components/ActionBar.jsx'
import Awning from '../components/Awning.jsx'
import Button from '../components/Button.jsx'
import CashCounter from '../components/CashCounter.jsx'
import ChangeStep from '../components/ChangeStep.jsx'
import CountStep from '../components/CountStep.jsx'
import CustomerStage from '../components/CustomerStage.jsx'
import ExitDialog from '../components/ExitDialog.jsx'
import HandoverFlight from '../components/HandoverFlight.jsx'
import SoundToggle from '../components/SoundToggle.jsx'
import MoneyImage from '../components/MoneyImage.jsx'
import OrderList from '../components/OrderList.jsx'
import PickStep from '../components/PickStep.jsx'
import { loadAnimeCharacter } from '../components/character/loadAnimeCharacter.js'
import WarungScene from '../components/scene/WarungScene.jsx'
import ServedStep from '../components/ServedStep.jsx'
import StepTracker from '../components/StepTracker.jsx'
import TotalChoices from '../components/TotalChoices.jsx'
import { getFruit } from '../data/fruits.js'
import { formatRupiah } from '../game/format.js'
import { getRegisterScreen } from '../lib/registerScreen.js'
import { playCoins, playPop } from '../lib/sfx.js'
import { useFeedbackSound } from '../lib/useFeedbackSound.js'
import { loadResultScreen } from './loadResultScreen.js'
import { getLevelFruits } from '../game/order.js'
import {
  createSession,
  getCurrentCustomer,
  getSessionScore,
  sessionReducer,
  STEPS,
  summarizeSession,
} from '../game/session.js'

// Lama laci mesin kasir terbuka setelah "Berikan kembalian" ditekan.
const DRAWER_OPEN_MS = 700

// Tombol aksi: selebar layar di HP, di layar lebar memenuhi lebar area kerja
// dengan tinggi minimal 56 px.
const ACTION_BUTTON = 'w-full md:w-auto md:self-start lg:min-h-14 lg:w-full lg:self-stretch'

// Lama panggung membesar ke tata letak Sapa saat pembeli berganti (sama
// dengan transisi tinggi panggung). Pembeli baru berjalan masuk setelahnya.
const STAGE_GROW_MS = 520

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
// aksi yang selalu terlihat di bawah. Di layar lebar (1024 px ke atas) dua
// kolom: pembeli dan balon bicara di kiri, area kerja dan bar aksi di kanan.
// - opened: pintu warung (layar loading) sudah terbuka. Sebelum itu adegan
//   sudah lengkap di belakang pintu, tetapi pembeli pertama belum masuk.
// - backSignal: bertambah saat tombol kembali browser ditekan selama
//   permainan berjalan; dialog "Tutup warung" lalu muncul.
// - onBackGuard(aktif): memberi tahu App apakah tombol kembali browser perlu
//   dicegat (permainan sedang berjalan).
function PlayScreen({ level, rng, opened = true, onExit, onFinish, backSignal = 0, onBackGuard }) {
  const reduce = useReducedMotion()
  const [state, dispatch] = useReducer(sessionReducer, null, () => createSession(level, rng))
  const customer = getCurrentCustomer(state)
  const { character } = customer
  const fruits = getLevelFruits(level)
  const stepIndex = STEPS.findIndex((step) => step.id === state.step)
  const stepName = STEPS[stepIndex]?.name
  const score = getSessionScore(state)
  const isGreet = state.step === 'greet'
  const isLastCustomer = state.index + 1 >= state.customers.length

  // Pergantian pembeli, berurutan supaya tidak ada frame meja kosong dengan
  // latar terpotong:
  // 1. pembeli lama berputar dan berjalan keluar; meja masih menampilkan
  //    nota lunas pembeli lama;
  // 2. setelah ia pergi, panggung membesar ke tata letak Sapa sementara isi
  //    meja memudar;
  // 3. setelah panggung selesai membesar, pembeli baru berjalan masuk.
  // stageIndex: pembeli yang sedang (atau terakhir) ada di panggung.
  const [stageIndex, setStageIndex] = useState(state.index)
  const changingCustomer = stageIndex !== state.index
  const stageLarge = isGreet && !changingCustomer
  const [readyIndex, setReadyIndex] = useState(state.index)
  useEffect(() => {
    if (changingCustomer || readyIndex === state.index) return undefined
    const timer = setTimeout(() => setReadyIndex(state.index), reduce ? 0 : STAGE_GROW_MS)
    return () => clearTimeout(timer)
  }, [changingCustomer, readyIndex, state.index, reduce])
  const customerOnStage = opened && !changingCustomer && readyIndex === state.index

  // Tombol "Mulai melayani" baru muncul setelah pembeli diam menghadap depan
  // (bersamaan dengan balon sapaan dan papan nama).
  const [arrivedIndex, setArrivedIndex] = useState(-1)
  const hasArrived = arrivedIndex === state.index

  // Momen jawaban benar: bungkusan dan uang kembalian berpindah dari meja ke
  // tangan pembeli, lalu poin muncul sebentar di dekat skor. served menyimpan
  // keadaan pembeli yang baru dilayani, juga selama ia berjalan keluar.
  const [servedState, setServed] = useState(null)
  let served = servedState
  if (state.step === 'served' && served?.index !== state.index) {
    served = {
      index: state.index,
      change: customer.payment.change > 0 ? state.givenChange : [],
      points: state.results[state.results.length - 1]?.score ?? 0,
      landed: false,
    }
    setServed(served)
  }
  const servedNow = state.step === 'served' && served?.index === state.index
  const handover = servedNow ? (served.landed ? 'hold' : 'reach') : undefined

  // Tombol ← dan tombol kembali browser membuka dialog selama permainan
  // berjalan.
  const [exitOpen, setExitOpen] = useState(false)
  const playing = state.step !== 'finished'
  useEffect(() => {
    onBackGuard?.(opened && playing)
    return () => onBackGuard?.(false)
  }, [opened, playing, onBackGuard])
  const lastSignal = useRef(backSignal)
  useEffect(() => {
    if (backSignal === lastSignal.current) return
    lastSignal.current = backSignal
    setExitOpen(true)
  }, [backSignal])

  // Pindahkan fokus ke judul langkah setiap kali langkah berganti, supaya
  // pengguna keyboard dan pembaca layar langsung tahu langkah barunya.
  const headingRef = useRef(null)
  const greetHeadingRef = useRef(null)
  const titleRef = useRef(null)
  // Setelah pintu warung terbuka, fokus pindah ke judul layar permainan.
  useEffect(() => {
    if (opened) titleRef.current?.focus({ preventScroll: true })
  }, [opened])

  // Selama anak melayani pembeli ini, muat lebih dulu yang dibutuhkan
  // berikutnya di latar belakang: karakter pembeli berikutnya (satu berkas
  // berisi kedelapan tokoh, jadi biasanya sudah ada) dan, saat pembeli
  // terakhir, layar hasil.
  useEffect(() => {
    if (isLastCustomer) loadResultScreen().catch(() => {})
    else loadAnimeCharacter().catch(() => {})
  }, [state.index, isLastCustomer])

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
    // Tempatnya tetap ada (tidak menggeser tata letak), tetapi tombolnya baru
    // terlihat dan bisa dipakai setelah pembeli sampai.
    actions = (
      <Button
        onClick={() => dispatch({ type: 'startServing' })}
        disabled={!hasArrived}
        className={`${ACTION_BUTTON} ${hasArrived ? '' : 'invisible'}`}
      >
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
      <Button onClick={() => dispatch({ type: 'wrapOrder' })} className={ACTION_BUTTON}>
        Bungkus pesanan
      </Button>
    )
  } else if (state.step === 'count') {
    speech = 'Terima kasih sudah dibungkus. Berapa semuanya?'
    bubble = <p>{speech}</p>
    body = <CountStep level={level} customer={customer} />
    actions =
      level.totalMode === 'shown' ? (
        <Button onClick={() => dispatch({ type: 'confirmTotal' })} className={ACTION_BUTTON}>
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
      <div className="grid grid-cols-2 gap-2 md:flex md:gap-3 lg:grid">
        <Button onClick={giveChange} className="px-1 text-[13px] md:px-5 md:text-lg lg:min-h-14">
          Berikan kembalian
        </Button>
        <Button
          variant="secondary"
          onClick={() => dispatch({ type: 'noChange' })}
          className="px-1 text-[13px] md:px-5 md:text-lg lg:min-h-14"
        >
          Tidak perlu kembalian
        </Button>
      </div>
    )
  } else if (state.step === 'served') {
    speech = 'Terima kasih! Senang belanja di warungmu.'
    bubble = <p>{speech}</p>
    body = (
      <ServedStep customer={customer} change={served.change} handedOver={served.landed} isLast={isLastCustomer} />
    )
    actions = (
      <Button onClick={() => dispatch({ type: 'nextCustomer' })} className={ACTION_BUTTON}>
        {isLastCustomer ? 'Lihat hasil' : 'Layani pembeli berikutnya'}
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
      <Button onClick={onExit} className={ACTION_BUTTON}>
        Kembali ke beranda
      </Button>
    )
  }

  // Selama pembeli lama berjalan keluar, meja masih menampilkan nota lunasnya.
  if (changingCustomer && served?.index === stageIndex) {
    body = (
      <ServedStep
        customer={state.customers[stageIndex]}
        change={served.change}
        handedOver
        isLast={false}
      />
    )
  }

  const heading = stepName
    ? `Langkah ${stepIndex + 1}: ${stepName}`
    : state.step === 'served'
      ? 'Pembeli selesai dilayani'
      : 'Warung tutup'

  const showWork = !isGreet || changingCustomer
  const workKey = changingCustomer ? `work-${stageIndex}` : `work-${state.index}`

  return (
    <div className="relative isolate flex h-[100vh] flex-col overflow-hidden supports-[height:100dvh]:h-dvh">
      <Suspense fallback={null}>
        <WarungScene levelId={level.id} />
      </Suspense>
      <Awning thin />
      <header className="mx-auto flex w-full max-w-5xl shrink-0 items-center gap-2 px-3 pt-1.5 md:px-4 md:pt-1 lg:max-w-6xl">
        <Button
          variant="quiet"
          onClick={() => (playing ? setExitOpen(true) : onExit())}
          aria-label="Kembali ke beranda"
          className="w-12 shrink-0 px-0 text-base md:w-auto md:px-3"
        >
          <span aria-hidden="true">←</span>
          <span className="hidden md:inline">Beranda</span>
        </Button>
        <h1
          ref={titleRef}
          tabIndex={-1}
          className="min-w-0 truncate rounded-lg border-4 border-tinta bg-terpal px-2 py-0.5 font-heading text-base text-kapur md:mx-auto md:rounded-xl md:px-3 md:py-1 md:text-lg"
        >
          {level.name}
        </h1>
        <p className="relative ml-auto flex shrink-0 flex-col items-end rounded-lg bg-kapur/90 px-1.5 py-0.5 text-sm leading-tight font-bold md:ml-0 md:flex-row md:gap-3 md:px-2 md:py-1 md:text-base">
          <span>
            Pembeli {state.index + 1}
            <span className="hidden md:inline"> dari {state.customers.length}</span>
            <span className="md:hidden">/{state.customers.length}</span>
          </span>
          <span data-score={score}>Skor {score}</span>
          {/* Poin pembeli ini muncul sebentar di dekat skor setelah bungkusan
              diterima. Hanya hiasan: poinnya juga disebut di umpan balik. */}
          {servedNow && served.landed && (
            <m.span
              key={served.index}
              aria-hidden="true"
              data-points={served.points}
              className="pointer-events-none absolute top-full right-0 mt-1 rounded-lg border-4 border-tinta bg-pisang px-2 font-heading text-lg leading-snug text-tinta md:text-xl"
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: [0, 1, 1, 0], y: reduce ? 0 : [8, 0, 0, -6] }}
              transition={{ duration: 1.8, times: [0, 0.15, 0.8, 1] }}
            >
              +{served.points}
            </m.span>
          )}
        </p>
        <SoundToggle />
      </header>

      <main className="flex min-h-0 flex-1 flex-col lg:mx-auto lg:grid lg:w-full lg:max-w-6xl lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:grid-rows-[auto_minmax(0,1fr)_auto] lg:gap-x-4 lg:px-4 lg:pb-3">
        <div className="mx-auto w-full max-w-5xl shrink-0 px-3 pt-1.5 md:px-4 md:pt-2 lg:col-start-2 lg:row-start-1 lg:max-w-none lg:px-0">
          <StepTracker currentStep={state.step} />
        </div>

        {isGreet && (
          <h2 ref={greetHeadingRef} tabIndex={-1} className="sr-only">
            {heading}
          </h2>
        )}

        {/* Kamera dekat: panggung pembeli tepat di atas meja kasir. Pembeli
            setengah badan berdiri di belakang meja (perut di tepi atas meja,
            tangan bertumpu di depan meja). Di HP panggung tinggi di langkah
            Sapa dan memendek halus di langkah lain; meja kasir mengisi
            sisanya dan menjadi tempat kerja. Di layar lebar panggung mengisi
            kolom kiri setinggi layar dengan sepotong meja kasir di bawahnya,
            dan urutan langkah, meja kerja, serta bar aksi ada di kolom kanan. */}
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden lg:contents">
          <div
            data-stage
            className={`relative shrink-0 transition-[height] duration-500 ease-out lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-2 lg:flex lg:h-auto lg:min-h-0 lg:flex-col lg:overflow-hidden lg:rounded-2xl lg:border-4 lg:border-tinta ${
              stageLarge ? 'h-[calc(100%-100px)] md:h-[calc(100%-130px)]' : 'h-[178px] md:h-[372px]'
            }`}
          >
            <div className="relative h-full lg:min-h-0 lg:flex-1 lg:[container-type:size]">
              {/* Satu panggung per pembeli. Saat pembeli berganti, panggung
                  lama pergi dulu (karakter berjalan keluar), panggung membesar,
                  baru panggung baru masuk. Pembeli pertama baru berjalan masuk
                  setelah pintu warung terbuka. */}
              <AnimatePresence mode="wait" onExitComplete={() => setStageIndex(state.index)}>
                {customerOnStage && (
                  <CustomerStage
                    key={state.index}
                    character={character}
                    large={isGreet}
                    stepKey={stepKey}
                    talkMs={speechMs(speech)}
                    reaction={state.feedback ?? undefined}
                    handover={handover}
                    farewell={state.step === 'served'}
                    onArrived={() => setArrivedIndex(state.index)}
                  >
                    {bubble}
                  </CustomerStage>
                )}
              </AnimatePresence>
            </div>
            {/* Sepotong meja kasir di bawah pembeli (layar lebar). */}
            <div aria-hidden="true" className="scene-counter relative hidden h-28 shrink-0 border-t-4 border-tinta lg:block">
              <CashCounter screen={registerScreen} drawerOpen={drawerOpen} />
            </div>
          </div>

          {/* Meja kasir. Keranjang, kantong, nota, laci, nampan, dan mesin kasir
              ada di atas meja. Isinya muncul setelah langkah Sapa dan memudar
              saat panggung kembali ke tata letak Sapa. */}
          <div
            data-counter
            className="scene-counter relative z-10 flex min-h-0 flex-1 flex-col border-t-4 border-tinta lg:col-start-2 lg:row-start-2 lg:mt-2 lg:rounded-2xl lg:border-4"
          >
            {/* Di layar lebar, kolom kerja di langkah Sapa berisi petunjuk
                singkat supaya tidak kosong. */}
            {isGreet && readyIndex === state.index && !changingCustomer && (
              <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="m-4 hidden w-fit rounded-xl border-4 border-tinta bg-kapur px-4 py-3 text-lg lg:block"
              >
                Pembeli baru datang. Baca ceritanya, lalu tekan "Mulai melayani".
              </m.p>
            )}
            <AnimatePresence initial={false}>
              {showWork && (
                <m.section
                  key={workKey}
                  aria-labelledby="step-title"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.45 } }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="relative flex min-h-0 flex-1 flex-col"
                >
                  <div className="lg:hidden">
                    <CashCounter screen={registerScreen} drawerOpen={drawerOpen} />
                  </div>
                  <div
                    ref={workRef}
                    data-work-area
                    tabIndex={isScrollable ? 0 : undefined}
                    role={isScrollable ? 'region' : undefined}
                    aria-label={isScrollable ? 'Meja kasir (bisa digeser)' : undefined}
                    className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto"
                  >
                    {/* Jarak atas memberi tempat tangan pembeli yang bertumpu di
                        tepi meja (di layar lebar meja kerja ada di kolom lain). */}
                    <div
                      ref={contentRef}
                      className="mx-auto w-full max-w-5xl px-2 pt-3 pb-1 md:px-4 md:pt-8 md:pb-1 lg:px-3 lg:pt-3"
                    >
                      <h2 id="step-title" ref={headingRef} tabIndex={-1} className="sr-only">
                        {heading}
                      </h2>
                      <m.div
                        key={changingCustomer ? `served-${stageIndex}` : stepKey}
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

      {servedNow && !served.landed && (
        <HandoverFlight
          change={served.change}
          reduce={reduce}
          onLanded={() => setServed((current) => ({ ...current, landed: true }))}
        />
      )}

      <ExitDialog
        open={exitOpen}
        onStay={() => setExitOpen(false)}
        onLeave={() => {
          setExitOpen(false)
          onExit()
        }}
      />
    </div>
  )
}

export default PlayScreen
