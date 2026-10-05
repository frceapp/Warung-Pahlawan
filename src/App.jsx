import { lazy, Suspense, useEffect, useState } from 'react'
import { getLevel } from './data/levels.js'
import { getBrowserStorage, loadBestStars, recordStars, saveBestStars } from './game/progress.js'
import HomeScreen from './screens/HomeScreen.jsx'
import PlayScreen from './screens/PlayScreen.jsx'

// Layar hasil bukan layar inti, jadi dimuat terpisah.
const ResultScreen = lazy(() => import('./screens/ResultScreen.jsx'))

// Galeri ilustrasi hanya untuk pengembangan; tidak ikut build produksi.
const GalleryScreen = import.meta.env.DEV
  ? lazy(() => import('./screens/GalleryScreen.jsx'))
  : null

const storage = getBrowserStorage()

function App() {
  const [screen, setScreen] = useState({ name: 'home', isFirst: true })
  const [bestStars, setBestStars] = useState(() => loadBestStars(storage))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  function startLevel(levelId) {
    setScreen({ name: 'play', levelId, playId: Date.now() })
  }

  function goHome() {
    setScreen({ name: 'home' })
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

  return <HomeScreen bestStars={bestStars} onPlay={startLevel} focusHeading={!screen.isFirst} />
}

export default App
