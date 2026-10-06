import { useEffect, useRef, useState } from 'react'
import { delay, waitForReady } from '../lib/loadingGate.js'
import LoadingScreen from './LoadingScreen.jsx'

// Layar loading paling sebentar tampil selama ini supaya tidak berkedip,
// dan dianggap gagal kalau belum siap setelah batas waktu.
const MIN_MS = 600
const TIMEOUT_MS = 8000

// Gerbang sebuah layar: pintu warung tertutup sampai `prepare()` selesai
// (semua berkas yang dibutuhkan layar itu sudah dimuat), lalu layarnya
// dirender di belakang pintu dan pintu dibuka. `children(opened)` dirender
// mulai saat pintu naik; `opened` menjadi true setelah pintu terbuka penuh.
// "Coba lagi" menjalankan `prepare()` sekali lagi.
function OpeningGate({ sign, loadingText, errorText, prepare, onBack, children }) {
  const [phase, setPhase] = useState('loading')
  const [attempt, setAttempt] = useState(0)
  // Gerbang hanya memuat (ulang) saat pertama tampil dan saat anak menekan
  // "Coba lagi", bukan setiap kali induknya membuat fungsi prepare baru.
  const prepareRef = useRef(prepare)
  useEffect(() => {
    prepareRef.current = prepare
  })

  useEffect(() => {
    let alive = true
    waitForReady(prepareRef.current(), { minMs: MIN_MS, timeoutMs: TIMEOUT_MS, wait: delay }).then((result) => {
      if (alive) setPhase(result === 'ready' ? 'opening' : 'error')
    })
    return () => {
      alive = false
    }
  }, [attempt])

  const isShown = phase === 'opening' || phase === 'open'
  return (
    <>
      {isShown && children(phase === 'open')}
      {phase !== 'open' && (
        <LoadingScreen
          sign={sign}
          status={phase}
          loadingText={loadingText}
          errorText={errorText}
          onRetry={() => {
            setPhase('loading')
            setAttempt((count) => count + 1)
          }}
          onBack={onBack}
          onOpened={() => setPhase('open')}
        />
      )}
    </>
  )
}

export default OpeningGate
