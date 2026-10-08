import { useEffect, useRef } from 'react'
import Awning from '../components/Awning.jsx'
import FruitImage from '../components/FruitImage.jsx'
import HistoryCard from '../components/HistoryCard.jsx'
import LevelCard from '../components/LevelCard.jsx'
import PracticeIcon from '../components/PracticeIcon.jsx'
import SoundToggle from '../components/SoundToggle.jsx'
import { preparePlayScreen } from './loadPlayScreen.js'
import { HOW_TO_PLAY, PRACTICE } from '../data/guide.js'
import { LEVELS } from '../data/levels.js'

// Kegagalan di sini diabaikan; layar loading memuat ulang dan menampilkan
// pesan kalau memang gagal.
function preloadLevel(levelId) {
  preparePlayScreen(levelId).catch(() => {})
}

function HomeScreen({
  bestStars,
  history,
  onPlay,
  onShowHistory,
  onPrepareHistory,
  focusHeading = false,
}) {
  const headingRef = useRef(null)
  useEffect(() => {
    if (focusHeading) headingRef.current?.focus()
  }, [focusHeading])

  // Muat lebih dulu semua yang dibutuhkan layar permainan (layar main, latar
  // dan dekorasi ketiga level, karakter pembeli, Motion, font) saat browser
  // senggang setelah beranda tampil, supaya pintu warung cepat terbuka.
  // Kartu level juga memulai pemuatan levelnya saat disentuh atau difokus.
  useEffect(() => {
    const load = () => {
      for (const level of LEVELS) preloadLevel(level.id)
    }
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(load, { timeout: 1500 })
      return () => window.cancelIdleCallback(id)
    }
    const timer = setTimeout(load, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-dvh flex-col">
      <Awning />

      {/* Di HP bagian judul dibuat ringkas (tombol Suara sebaris dengan
          judul, deskripsi lebih rapat) supaya kartu level pertama dan tombol
          "Buka warung" terlihat tanpa scroll di layar 360×640. */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pt-3 pb-12 sm:gap-10">
        <header className="relative flex flex-col items-start gap-3 text-center sm:items-center sm:gap-5">
          <div className="absolute top-0 right-0 sm:static sm:flex sm:w-full sm:justify-end">
            <SoundToggle />
          </div>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="-rotate-1 rounded-2xl border-4 border-tinta bg-terpal px-4 py-2 font-heading text-3xl leading-tight whitespace-nowrap text-kapur shadow-[0_6px_0_var(--color-tinta)] sm:px-10 sm:py-5 sm:text-6xl"
          >
            Warung Pahlawan
          </h1>
          <p className="max-w-xl rounded-2xl border-4 border-tinta bg-kapur px-4 py-2 text-base leading-snug sm:px-8 sm:py-4 sm:text-xl sm:leading-relaxed">
            Jadi penjaga warung buah, layani para pahlawan Indonesia, sambil berlatih berhitung dan
            mengenal sejarah.
          </p>
        </header>

        <section aria-labelledby="levels-title">
          <h2 id="levels-title" className="mb-3 font-heading text-2xl sm:mb-4 sm:text-3xl">
            Pilih warungmu
          </h2>
          <ul className="grid gap-5 md:grid-cols-3">
            {LEVELS.map((level) => (
              <li key={level.id}>
                <LevelCard
                  level={level}
                  bestStars={bestStars[level.id]}
                  onPlay={onPlay}
                  onPrepare={preloadLevel}
                />
              </li>
            ))}
          </ul>
        </section>

        <HistoryCard history={history} onShowHistory={onShowHistory} onPrepareHistory={onPrepareHistory} />

        <section aria-labelledby="howto-title">
          <h2 id="howto-title" className="mb-4 font-heading text-3xl">
            Cara main
          </h2>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_TO_PLAY.map((step, index) => (
              <li
                key={step.title}
                className="flex items-start gap-3 rounded-2xl border-4 border-tinta bg-kapur p-3"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-tinta bg-pisang font-heading text-xl"
                >
                  {index + 1}
                </span>
                <span>
                  <span className="block font-heading text-xl">{step.title}</span>
                  <span className="text-base">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-base">
            Tiap pembeli bernilai 10 poin. Kalau ada yang belum pas, kamu boleh mencoba lagi.
          </p>
        </section>

        <section aria-labelledby="practice-title">
          <h2 id="practice-title" className="mb-4 font-heading text-3xl">
            Yang kamu latih
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PRACTICE.map((item) => (
              <li key={item.title} className="flex items-start gap-3 rounded-2xl border-4 border-tinta bg-kapur p-3">
                <PracticeIcon name={item.icon} className="h-10 w-10 shrink-0" />
                <span>
                  <span className="block font-heading text-xl">{item.title}</span>
                  <span className="text-base">{item.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t-4 border-tinta bg-kayu px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2" aria-hidden="true">
          {['banana', 'apple', 'mango', 'watermelon', 'rambutan', 'orange'].map((id) => (
            <FruitImage key={id} fruitId={id} size={40} decorative />
          ))}
        </div>
      </footer>
    </div>
  )
}

export default HomeScreen
