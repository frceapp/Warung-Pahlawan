import { usePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { createElement, lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { playCustomerBell } from '../lib/sfx.js'
import { getLoadedAnimeCharacter, loadAnimeCharacter } from './character/loadAnimeCharacter.js'
import SpeechBubble from './SpeechBubble.jsx'

// Karakter anime dimuat terpisah supaya bundel awal tidak membesar. Biasanya
// berkasnya sudah dimuat dari beranda dan langsung dipakai; kalau belum,
// React.lazy menunggu dengan ruang yang sudah tersedia (tanpa layout shift).
const LazyAnimeCharacter = lazy(loadAnimeCharacter)

// Komponen karakter yang sudah dimuat selalu sama (disimpan sekali di
// loadAnimeCharacter.js), jadi aman dirender lewat createElement.
function PreloadedCharacter(props) {
  return createElement(getLoadedAnimeCharacter(), props)
}

// Kotak karakter. Di HP: 144 px di langkah Sapa dan 112 px di langkah lain
// (gambar tokoh setinggi kira-kira 96 sampai 107 px); di desktop 208 dan 144 px.
const FIGURE_SIZE = {
  large: 'h-36 w-[109px] md:h-52 md:w-[158px]',
  compact: 'h-28 w-[85px] md:h-36 md:w-[109px]',
}
// Perpindahan ukuran dan posisi karakter antar-langkah (FLIP, transform saja).
const RESIZE = { duration: 0.45, ease: [0.2, 0.7, 0.3, 1] }
// Cadangan kalau berkas karakter belum dimuat: balon tetap muncul dan kartu
// tetap bisa pergi.
const ARRIVE_FALLBACK_MS = 1600
const LEAVE_FALLBACK_MS = 1600

// Balon bicara muncul (pop) setelah pembeli sampai, lalu chip pesanan di
// dalamnya menyusul satu per satu (lihat OrderList).
const BUBBLE = {
  hidden: { opacity: 0, scale: 0.92, transition: { duration: 0.15 } },
  shown: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.18, ease: 'easeOut', delayChildren: 0.05, staggerChildren: 0.08 },
  },
}
const FADE = {
  hidden: { opacity: 0, transition: { duration: 0.15 } },
  shown: { opacity: 1, transition: { duration: 0.2 } },
}

// Panggung satu pembeli: karakter dan balon bicaranya. Satu panggung dipakai
// untuk keempat langkah, jadi karakter tidak dipasang ulang saat langkah
// berganti; ukurannya dihaluskan dari besar (Sapa) ke sedang (langkah lain).
// Panggung adalah anak langsung AnimatePresence di PlayScreen: saat pembeli
// berganti, balon memudar, karakter berjalan keluar, baru pembeli baru masuk.
// - large: tampilan langkah Sapa (karakter besar, papan nama, fun fact)
// - stepKey/talkMs: kalimat baru dan lama mulut bergerak
// - reaction: umpan balik terakhir, untuk reaksi senang atau sedih
// - farewell: pembeli sudah dilayani dan melambai
function CustomerStage({ character, large = false, stepKey, talkMs, reaction, farewell = false, children }) {
  const [isPresent, safeToRemove] = usePresence()
  const [arrived, setArrived] = useState(false)
  const [isPreloaded] = useState(() => getLoadedAnimeCharacter() !== null)
  const figureRef = useRef(null)
  const last = useRef({ large, rect: null })
  const [resizeFrom, setResizeFrom] = useState(null)
  const pendingResize = useRef(0)

  useEffect(() => {
    const timer = setTimeout(() => setArrived(true), ARRIVE_FALLBACK_MS)
    return () => clearTimeout(timer)
  }, [])

  // Lonceng warung saat pembeli sampai (bersamaan dengan papan nama dan
  // balon bicara yang muncul).
  useEffect(() => {
    if (arrived) playCustomerBell()
  }, [arrived])

  useEffect(() => {
    if (isPresent) return undefined
    const timer = setTimeout(() => safeToRemove?.(), LEAVE_FALLBACK_MS)
    return () => clearTimeout(timer)
  }, [isPresent, safeToRemove])

  // FLIP: saat tata letak berganti (Sapa ke langkah lain), karakter mulai dari
  // posisi dan ukuran lamanya, lalu bergeser dan mengecil dengan halus ke
  // tempat barunya. Transform awal ditulis langsung sebelum layar digambar
  // supaya tidak ada satu frame pun yang meloncat; Motion melanjutkannya
  // dari nilai yang sama pada frame berikutnya.
  useLayoutEffect(() => {
    const figure = figureRef.current
    const previous = last.current
    if (figure && previous.rect && previous.large !== large) {
      figure.style.transform = 'none'
      const next = figure.getBoundingClientRect()
      const from = {
        x: previous.rect.left - next.left,
        y: previous.rect.top - next.top,
        scale: previous.rect.width / next.width,
      }
      figure.style.transform = `translateX(${from.x}px) translateY(${from.y}px) scale(${from.scale})`
      pendingResize.current = requestAnimationFrame(() => setResizeFrom(from))
    }
    last.current = { large, rect: figure?.getBoundingClientRect() ?? null }
  }, [large])
  useEffect(() => () => cancelAnimationFrame(pendingResize.current), [])

  const characterProps = {
    characterId: character.id,
    talkKey: stepKey,
    talkMs,
    reaction,
    farewell,
    leaving: !isPresent,
    onArrived: () => setArrived(true),
    onLeft: () => safeToRemove?.(),
    className: 'h-full w-full',
  }
  const showText = arrived && isPresent ? 'shown' : 'hidden'

  return (
    <section
      aria-label="Pembeli"
      className={
        large
          ? 'flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pt-3 md:px-4 md:pt-5'
          : 'shrink-0 px-3 py-1 md:px-4 md:py-3'
      }
    >
      <div
        className={`mx-auto flex w-full max-w-5xl ${
          large ? 'flex-col items-center gap-2 md:flex-row md:items-start md:gap-6' : 'items-start gap-2 md:gap-4'
        }`}
      >
        <div className={`relative flex shrink-0 flex-col items-center ${large ? 'gap-1 text-center' : ''}`}>
          <m.div
            ref={figureRef}
            animate={
              resizeFrom
                ? { x: [resizeFrom.x, 0], y: [resizeFrom.y, 0], scale: [resizeFrom.scale, 1] }
                : undefined
            }
            transition={RESIZE}
            style={{ originX: 0, originY: 0 }}
            className={`relative shrink-0 ${large ? FIGURE_SIZE.large : FIGURE_SIZE.compact}`}
            aria-hidden="true"
          >
            {isPreloaded ? (
              <PreloadedCharacter {...characterProps} />
            ) : (
              <Suspense fallback={null}>
                <LazyAnimeCharacter {...characterProps} />
              </Suspense>
            )}
          </m.div>
          {large ? (
            <m.div
              key="plaque-large"
              variants={FADE}
              initial="hidden"
              animate={showText}
              className="flex flex-col items-center gap-1"
            >
              <p className="rounded-lg border-4 border-tinta bg-terpal-tua px-2 py-0.5 font-heading text-base leading-tight text-kapur">
                {character.name}
              </p>
              <p className="rounded-md bg-kapur/90 px-1.5 text-sm leading-tight">{character.origin}</p>
            </m.div>
          ) : (
            <m.p
              key="plaque-compact"
              variants={FADE}
              initial="hidden"
              animate={showText}
              className="absolute -bottom-1 left-1/2 w-max max-w-[96px] -translate-x-1/2 rounded-md border-2 border-tinta bg-terpal-tua px-1 py-px text-center font-heading text-[11px] leading-tight text-kapur md:max-w-[120px] md:text-xs"
            >
              {character.name}
            </m.p>
          )}
        </div>
        <m.div
          key={stepKey}
          variants={BUBBLE}
          initial="hidden"
          animate={showText}
          style={{ originX: large ? 0.5 : 0, originY: large ? 0 : 0.5 }}
          className={large ? 'w-full md:mt-2 md:flex-1' : 'relative z-10 min-w-0 flex-1'}
        >
          {large ? (
            <SpeechBubble tail="top">{children}</SpeechBubble>
          ) : (
            <SpeechBubble compact>{children}</SpeechBubble>
          )}
        </m.div>
      </div>
    </section>
  )
}

export default CustomerStage
