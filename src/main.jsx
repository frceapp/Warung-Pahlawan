import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LazyMotion, MotionConfig } from 'motion/react'
import '@fontsource/lilita-one/400.css'
import '@fontsource/atkinson-hyperlegible/400.css'
import '@fontsource/atkinson-hyperlegible/700.css'
import './index.css'
import App from './App.jsx'

// Animasi memakai Motion. reducedMotion="user": kalau pengguna memilih
// kurangi gerakan, animasi transform langsung selesai dan hanya opacity
// yang tetap memudar. `strict` memastikan hanya komponen `m` yang dipakai.
const loadMotionFeatures = () => import('./motionFeatures.js').then((module) => module.default)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <App />
      </LazyMotion>
    </MotionConfig>
  </StrictMode>,
)
