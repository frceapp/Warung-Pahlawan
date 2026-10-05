import { lazy, Suspense, useEffect, useState } from 'react'
import { getLevel } from './data/levels.js'
import { getBrowserStorage, loadBestStars, recordStars, saveBestStars } from './game/progress.js'
import HomeScreen from './screens/HomeScreen.jsx'
import PlayScreen from './screens/PlayScreen.jsx'

// Layar hasil dan mode Susun Langkah bukan layar inti, jadi dimuat terpisah.
const ResultScreen = lazy(() => import('./screens/ResultScreen.jsx'))
const SequenceScreen = lazy(() => import('./screens/SequenceScreen.jsx'))

// Galeri ilustrasi hanya untuk pengembangan; tidak ikut build produksi.
const GalleryScreen = import.meta.env.DEV
  ? lazy(() => import('./screens/GalleryScreen.jsx'))
  : null

const storage = getBrowserStorage()

// Penanda entri riwayat browser untuk layar selain beranda.
const IN_APP_STATE = 'warungPahlawanScreen'

function App() {
  const [screen, setScreen] = useState({ name: 'home', isFirst: true })
  const [bestStars, setBestStars] = useState(() => loadBestStars(storage))

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

  function startLevel(levelId) {
    leaveHome({ name: 'play', levelId, playId: Date.now() })
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
    setScreen({ name: 'result', summary, isNewBest: updated !== bestStars })
  }

  if (GalleryScreen && new URLSearchParams(window.location.search).has('galeri')) {
    return (
      <Suspense fallback={null}>
        <GalleryScreen />
      </Suspense>
    )
  }

  if (screen.name === 'play') {
    return (
      <PlayScreen
        key={screen.playId}
        level={getLevel(screen.levelId)}
        rng={Math.random}
        onExit={goHome}
        onFinish={finishLevel}
      />
    )
  }

  if (screen.name === 'sequence') {
    return (
      <Suspense fallback={<p className="p-8 text-lg">Menyiapkan kartu...</p>}>
        <SequenceScreen rng={Math.random} onExit={goHome} />
      </Suspense>
    )
  }

  if (screen.name === 'result') {
    return (
      <Suspense fallback={<p className="p-8 text-lg">Menyiapkan hasil...</p>}>
        <ResultScreen
          summary={screen.summary}
          isNewBest={screen.isNewBest}
          onPlayAgain={() => startLevel(screen.summary.levelId)}
          onHome={goHome}
        />
      </Suspense>
    )
  }

  return (
    <HomeScreen
      bestStars={bestStars}
      onPlay={startLevel}
      onOpenSequence={() => leaveHome({ name: 'sequence' })}
      focusHeading={!screen.isFirst}
    />
  )
}

export default App
