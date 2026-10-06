import { useEffect, useRef, useState } from 'react'
import Awning from './Awning.jsx'
import Button from './Button.jsx'

// Kalau transitionend tidak datang (misalnya tab sedang tidak aktif), pintu
// dianggap sudah terbuka setelah waktu ini.
const OPEN_FALLBACK_MS = 900

// Layar loading berupa pintu gulung warung yang tertutup, dengan papan nama
// dan teks loading. Menutupi seluruh layar tanpa scroll.
// - status 'loading': pintu tertutup.
// - status 'error': pesan ramah dengan tombol "Coba lagi" dan "Kembali".
// - status 'opening': layar di belakangnya sudah lengkap. Setelah layar itu
//   tergambar, pintu naik 500 ms (atau memudar 150 ms kalau "kurangi
//   gerakan" aktif), lalu onOpened dipanggil.
function LoadingScreen({ sign, status, loadingText, errorText, onRetry, onBack, onOpened }) {
  const [raised, setRaised] = useState(false)
  const retryRef = useRef(null)
  const openedRef = useRef(onOpened)
  useEffect(() => {
    openedRef.current = onOpened
  })

  // Tunggu dua frame supaya layar di belakang pintu sudah tergambar utuh
  // sebelum pintu mulai naik.
  useEffect(() => {
    if (status !== 'opening') return undefined
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setRaised(true))
    })
    return () => cancelAnimationFrame(frame)
  }, [status])

  useEffect(() => {
    if (!raised) return undefined
    const timer = setTimeout(() => openedRef.current?.(), OPEN_FALLBACK_MS)
    return () => clearTimeout(timer)
  }, [raised])

  useEffect(() => {
    if (status === 'error') retryRef.current?.focus()
  }, [status])

  return (
    // Saat pintu naik, layar di belakangnya sudah menjadi isi utama, jadi
    // pintu disembunyikan dari pembaca layar.
    <div
      aria-hidden={status === 'opening' ? true : undefined}
      className={`fixed inset-0 z-50 overflow-hidden ${raised ? 'pointer-events-none' : ''}`}
    >
      <div
        data-loading-door
        onTransitionEnd={(event) => {
          if (raised && event.target === event.currentTarget) openedRef.current?.()
        }}
        className={`rolling-door door-transition absolute inset-0 flex flex-col border-b-8 border-tinta ${
          raised ? 'motion-safe:-translate-y-full motion-reduce:opacity-0' : ''
        }`}
      >
        <Awning thin />
        <div className="h-5 shrink-0 border-b-4 border-tinta bg-kayu" aria-hidden="true" />
        <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 px-4 text-center">
          <h1 className="-rotate-1 rounded-2xl border-4 border-tinta bg-terpal px-6 py-3 font-heading text-4xl leading-tight text-kapur shadow-[0_6px_0_var(--color-tinta)] md:px-10 md:py-4 md:text-5xl">
            {sign}
          </h1>
          <p
            role="status"
            className="max-w-xs rounded-2xl border-4 border-tinta bg-kapur px-5 py-2 text-lg font-bold md:max-w-md md:text-xl"
          >
            {status === 'error' ? errorText : loadingText}
          </p>
          {status === 'error' && (
            <div className="flex flex-wrap justify-center gap-3">
              <Button ref={retryRef} onClick={onRetry}>
                Coba lagi
              </Button>
              <Button variant="secondary" onClick={onBack}>
                Kembali
              </Button>
            </div>
          )}
        </main>
        {/* Bilah bawah pintu dengan pegangan. */}
        <div className="flex h-9 shrink-0 items-center justify-center border-t-4 border-tinta bg-kayu" aria-hidden="true">
          <div className="h-3 w-24 rounded-full border-4 border-tinta bg-kapur" />
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
