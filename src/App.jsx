import { lazy, Suspense } from 'react'
import HomeScreen from './screens/HomeScreen.jsx'

// Galeri ilustrasi hanya untuk pengembangan; tidak ikut build produksi.
const GalleryScreen = import.meta.env.DEV
  ? lazy(() => import('./screens/GalleryScreen.jsx'))
  : null

function App() {
  if (GalleryScreen && new URLSearchParams(window.location.search).has('galeri')) {
    return (
      <Suspense fallback={null}>
        <GalleryScreen />
      </Suspense>
    )
  }
  return <HomeScreen />
}

export default App
