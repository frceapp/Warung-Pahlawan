import { lazy, Suspense, useState } from 'react'
import { getLevel } from './data/levels.js'
import HomeScreen from './screens/HomeScreen.jsx'
import PlayScreen from './screens/PlayScreen.jsx'

// Galeri ilustrasi hanya untuk pengembangan; tidak ikut build produksi.
const GalleryScreen = import.meta.env.DEV
  ? lazy(() => import('./screens/GalleryScreen.jsx'))
  : null

function App() {
  const [screen, setScreen] = useState({ name: 'home' })

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
        onExit={() => setScreen({ name: 'home' })}
      />
    )
  }

  return (
    <HomeScreen
      onPlay={(levelId) => setScreen({ name: 'play', levelId, playId: Date.now() })}
    />
  )
}

export default App
