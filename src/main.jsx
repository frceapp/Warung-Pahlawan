import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LazyMotion, MotionConfig } from 'motion/react'
// Font hanya subset latin dan bobot yang dipakai. Semua teks game memakai
// huruf latin dasar, jadi subset latin-ext tidak perlu.
import '@fontsource/lilita-one/latin-400.css'
import '@fontsource/atkinson-hyperlegible/latin-400.css'
import '@fontsource/atkinson-hyperlegible/latin-700.css'
import './index.css'
import App from './App.jsx'
import { installAudioUnlock } from './lib/sfx.js'

// Animasi memakai Motion. reducedMotion="user": kalau pengguna memilih
// kurangi gerakan, animasi transform langsung selesai dan hanya opacity
// yang tetap memudar. `strict` memastikan hanya komponen `m` yang dipakai.
const loadMotionFeatures = () => import('./motionFeatures.js').then((module) => module.default)

// Situs ini hanya punya satu alamat. Alamat lain (alamat lama atau salah
// ketik) sudah menampilkan beranda; alamatnya dirapikan ke "/" juga.
if (window.location.pathname !== '/') {
  window.history.replaceState(null, '', `/${window.location.search}${window.location.hash}`)
}

// Efek suara: AudioContext baru dibuat setelah sentuhan atau tombol pertama.
installAudioUnlock()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <App />
      </LazyMotion>
    </MotionConfig>
  </StrictMode>,
)
