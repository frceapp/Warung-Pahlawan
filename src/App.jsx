import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import OpeningGate from './components/OpeningGate.jsx'
import { getLevel } from './data/levels.js'
import { getBrowserStorage, loadBestStars, recordStars, saveBestStars } from './game/progress.js'
import HomeScreen from './screens/HomeScreen.jsx'
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

const storage = getBrowserStorage()

// Penanda entri riwayat browser untuk layar selain beranda.
const IN_APP_STATE = 'warungPahlawanScreen'

function App() {
  const [screen, setScreen] = useState({ name: 'home', isFirst: true })
  const [bestStars, setBestStars] = useState(() => loadBestStars(storage))
  // Nomor unik tiap kali layar permainan atau hasil dibuka, supaya layar dan
  // pintu warungnya dipasang ulang dari awal (misalnya saat "Main lagi").
  const openCount = useRef(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  // Tombol kembali di browser atau HP membawa ke beranda, bukan keluar dari
  // situs. Semua layar selain beranda memakai satu entri riwayat yang sama.
  useEffect(() => {
    const backToHome = () => setScreen({ name: 'home' })
    window.addEventListener('popstate', backToHome)
    return () => window.removeEventListener('popstate', backToHome)
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
  function startLevel(levelId) {
    openCount.current += 1
    leaveHome({ name: 'play', levelId, playId: openCount.current })
  }

  function goHome() {
    if (window.history.state?.[IN_APP_STATE]) {
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
    openCount.current += 1
    setScreen({ name: 'result', resultId: openCount.current, summary, isNewBest: updated !== bestStars })
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
            <PlayScreen level={level} rng={Math.random} opened={opened} onExit={goHome} onFinish={finishLevel} />
          )
        }}
      </OpeningGate>
    )
  }

  if (screen.name === 'result') {
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
              onPlayAgain={() => startLevel(screen.summary.levelId)}
              onHome={goHome}
            />
          )
        }}
      </OpeningGate>
    )
  }

  return (
    <HomeScreen
      bestStars={bestStars}
      onPlay={startLevel}
      focusHeading={!screen.isFirst}
    />
  )
}

export default App
