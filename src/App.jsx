import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import OpeningGate from './components/OpeningGate.jsx'
import { getLevel, LEVELS } from './data/levels.js'
import { getBrowserStorage, loadBestStars, recordStars, saveBestStars } from './game/progress.js'
import {
  addHistoryEntry,
  clearHistory,
  compareWithPrevious,
  createGameId,
  createHistoryEntry,
  readHistory,
  saveHistory,
} from './lib/scoreHistory.js'
import HomeScreen from './screens/HomeScreen.jsx'
import { loadHistoryScreen } from './screens/loadHistoryScreen.js'
import { getLoadedPlayScreen, preparePlayScreen } from './screens/loadPlayScreen.js'
import { getLoadedResultScreen, prepareResultScreen } from './screens/loadResultScreen.js'

// Layar permainan dan layar hasil dimuat terpisah supaya beranda ringan.
// Keduanya dibuka lewat OpeningGate: pintu warung tertutup sampai semua
// berkasnya siap, lalu pintu naik dan layarnya tampil utuh.

// Galeri ilustrasi hanya untuk pengembangan; tidak ikut build produksi.
const GalleryScreen = import.meta.env.DEV
  ? lazy(() => import('./screens/GalleryScreen.jsx'))
  : null

// Komposisi gambar pratinjau tautan (/?og), juga hanya untuk pengembangan.
const OgImageScreen = import.meta.env.DEV
  ? lazy(() => import('./screens/OgImageScreen.jsx'))
  : null

// Halaman uji efek suara (/?sfx): tersembunyi, tetapi ikut build supaya
// bisa didengarkan di situs.
const SfxScreen = lazy(() => import('./screens/SfxScreen.jsx'))

const storage = getBrowserStorage()

// Penanda entri riwayat browser untuk layar selain beranda.
const IN_APP_STATE = 'warungPahlawanScreen'

function newGameId() {
  return createGameId(Date.now(), Math.random)
}

function App() {
  const [screen, setScreen] = useState({ name: 'home', isFirst: true })
  const [bestStars, setBestStars] = useState(() => loadBestStars(storage))
  // Riwayat skor (lib/scoreHistory.js). Kalau localStorage tidak bisa
  // dipakai, riwayat hanya ada selama halaman terbuka.
  const [history, setHistory] = useState(() => readHistory(storage).entries)
  // Halaman "Semua riwayat" setelah berkasnya dimuat.
  const [HistoryScreen, setHistoryScreen] = useState(null)
  // Nomor unik tiap kali layar permainan atau hasil dibuka, supaya layar dan
  // pintu warungnya dipasang ulang dari awal (misalnya saat "Main lagi").
  const openCount = useRef(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  // Tombol kembali di browser atau HP membawa ke beranda, bukan keluar dari
  // situs. Semua layar selain beranda memakai satu entri riwayat yang sama.
  // Selama permainan berjalan, tombol kembali membuka dialog "Tutup warung"
  // (sama dengan tombol ← di layar main): entri riwayatnya dipasang lagi dan
  // layar main diberi tanda lewat backSignal.
  const backGuard = useRef(false)
  const leaving = useRef(false)
  const [backSignal, setBackSignal] = useState(0)
  const setBackGuard = useCallback((active) => {
    backGuard.current = active
  }, [])
  useEffect(() => {
    const onBack = () => {
      if (backGuard.current && !leaving.current) {
        try {
          window.history.pushState({ [IN_APP_STATE]: true }, '')
        } catch {
          // Riwayat tidak tersedia; dialog tetap muncul.
        }
        setBackSignal((count) => count + 1)
        return
      }
      leaving.current = false
      setScreen({ name: 'home' })
    }
    window.addEventListener('popstate', onBack)
    return () => window.removeEventListener('popstate', onBack)
  }, [])

  function leaveHome(next) {
    if (screen.name === 'home') {
      try {
        window.history.pushState({ [IN_APP_STATE]: true }, '')
      } catch {
        // Riwayat tidak tersedia; layar tetap berpindah.
      }
    }
    setScreen(next)
  }

  // Pintu warung (layar loading) langsung tampil setelah anak memilih level.
  // Tiap permainan mendapat id unik saat dimulai, supaya satu permainan
  // hanya tercatat sekali di riwayat.
  function startLevel(levelId) {
    openCount.current += 1
    const gameId = newGameId()
    leaveHome({ name: 'play', levelId, playId: openCount.current, gameId })
  }

  function openHistory() {
    return loadHistoryScreen().then((module) => {
      setHistoryScreen(() => module.default)
      leaveHome({ name: 'history' })
    })
  }

  function prepareHistory() {
    loadHistoryScreen().catch(() => {})
  }

  function removeHistory() {
    clearHistory(storage)
    setHistory([])
  }

  // Dicatat saat layar hasil akan tampil. Riwayat dibaca ulang dari
  // localStorage (bisa berubah di tab lain); kalau tidak bisa dibaca, dipakai
  // riwayat yang ada di halaman ini.
  function recordGame(summary, gameId) {
    const stored = readHistory(storage)
    const previous = stored.ok ? stored.entries : history
    const entry = createHistoryEntry({ id: gameId, summary, finishedAt: new Date() })
    const updated = addHistoryEntry(previous, entry)
    if (updated !== previous) saveHistory(storage, updated)
    setHistory(updated)
    return compareWithPrevious(previous, entry)
  }

  function goHome() {
    if (window.history.state?.[IN_APP_STATE]) {
      leaving.current = true
      window.history.back() // memicu popstate, lalu kembali ke beranda
    } else {
      setScreen({ name: 'home' })
    }
  }

  function finishLevel(summary) {
    const updated = recordStars(bestStars, summary.levelId, summary.stars)
    if (updated !== bestStars) {
      setBestStars(updated)
      saveBestStars(storage, updated)
    }
    const comparison = recordGame(summary, screen.gameId)
    openCount.current += 1
    setScreen({
      name: 'result',
      resultId: openCount.current,
      summary,
      isNewBest: updated !== bestStars,
      comparison,
    })
  }

  if (new URLSearchParams(window.location.search).has('sfx')) {
    return (
      <Suspense fallback={null}>
        <SfxScreen />
      </Suspense>
    )
  }

  if (GalleryScreen && new URLSearchParams(window.location.search).has('galeri')) {
    return (
      <Suspense fallback={null}>
        <GalleryScreen />
      </Suspense>
    )
  }

  if (OgImageScreen && new URLSearchParams(window.location.search).has('og')) {
    return (
      <Suspense fallback={null}>
        <OgImageScreen />
      </Suspense>
    )
  }

  if (screen.name === 'play') {
    const level = getLevel(screen.levelId)
    return (
      <OpeningGate
        key={screen.playId}
        sign={level.name}
        loadingText="Membuka warung..."
        errorText="Warung belum bisa dibuka. Coba lagi ya."
        prepare={() => preparePlayScreen(level.id)}
        onBack={goHome}
      >
        {(opened) => {
          const PlayScreen = getLoadedPlayScreen()
          return (
            <PlayScreen
              level={level}
              rng={Math.random}
              opened={opened}
              onExit={goHome}
              onFinish={finishLevel}
              backSignal={backSignal}
              onBackGuard={setBackGuard}
            />
          )
        }}
      </OpeningGate>
    )
  }

  if (screen.name === 'result') {
    const nextLevel = LEVELS.find((level) => level.id === screen.summary.levelId + 1)
    return (
      <OpeningGate
        key={screen.resultId}
        sign={getLevel(screen.summary.levelId).name}
        loadingText="Menyiapkan hasil..."
        errorText="Hasil belum bisa ditampilkan. Coba lagi ya."
        prepare={prepareResultScreen}
        onBack={goHome}
      >
        {() => {
          const ResultScreen = getLoadedResultScreen()
          return (
            <ResultScreen
              summary={screen.summary}
              isNewBest={screen.isNewBest}
              comparison={screen.comparison}
              nextLevel={nextLevel}
              onNextLevel={() => startLevel(nextLevel.id)}
              onPlayAgain={() => startLevel(screen.summary.levelId)}
              onHome={goHome}
            />
          )
        }}
      </OpeningGate>
    )
  }

  if (screen.name === 'history' && HistoryScreen) {
    return <HistoryScreen history={history} onClearHistory={removeHistory} onHome={goHome} />
  }

  return (
    <HomeScreen
      bestStars={bestStars}
      history={history}
      onPlay={startLevel}
      onShowHistory={openHistory}
      onPrepareHistory={prepareHistory}
      onClearHistory={removeHistory}
      focusHeading={!screen.isFirst}
    />
  )
}

export default App
