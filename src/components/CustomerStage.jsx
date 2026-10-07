import { usePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { createElement, lazy, Suspense, useEffect, useRef, useState } from 'react'
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

// Kamera dekat: pembeli berdiri tepat di belakang meja kasir. Kotak gambar
// diletakkan sehingga garis meja di gambar (COUNTER_Y, setinggi perut; 68,2%
// tinggi gambar) tepat di tepi bawah panggung, yaitu tepi atas meja. Badan di
// bawah garis itu dipotong (di belakang meja); lengan dan tangan yang
// bertumpu di tepi meja digambar di depan meja, jadi kotak gambar berada di
// atas meja (z-20) dan tidak menerima klik. Ukuran berubah halus antarlangkah
// (scale dengan titik putar di garis meja, jadi pembeli tetap menempel di
// meja).
// - HP: kotak 260×342 px di langkah Sapa, skala 0,7 di langkah lain.
// - Tablet (768 px ke atas): kotak 460×606 px di langkah Sapa, skala 0,84 di
//   langkah lain.
// - Layar lebar (1024 px ke atas): dua kolom; pembeli di tengah kolom kiri.
//   Kotak 460×606 px, atau lebih kecil kalau panggung pendek (stage-fit dan
//   figure-fit di index.css), supaya balon di atas kepala tidak menimpa
//   kepala. Pembeli digeser ke kiri secukupnya supaya wajahnya tidak
//   tertutup mesin kasir di kanan.
const FIGURE =
  'pointer-events-none absolute z-20 bottom-[-108.8px] h-[342px] w-[260px] origin-[50%_233.2px] transition-[left,scale] duration-500 ease-out md:bottom-[-192.8px] md:h-[606px] md:w-[460px] md:origin-[50%_413.2px] lg:figure-fit'
// Layar HP yang pendek (misalnya 320×568): karakter Sapa sedikit diperkecil
// supaya balon fun fact tetap muat di atas kepala.
const FIGURE_LARGE =
  'left-[calc(50%-130px)] [@media(max-height:620px)]:scale-[0.8] md:left-0 md:[@media(max-height:620px)]:scale-100'
const FIGURE_COMPACT = '-left-[39px] scale-[0.7] md:-left-[37px] md:scale-[0.84]'

// Balon bicara menempel di kepala: di HP di atas kepala saat langkah Sapa
// (teks fun fact panjang) dan di samping kepala di langkah lain; di tablet
// selalu di samping kepala; di layar lebar (kolom kiri) selalu di atas
// kepala.
const BUBBLE_LARGE =
  'inset-x-2 bottom-[240px] [@media(max-height:620px)]:bottom-[192px] md:inset-x-auto md:right-0 md:bottom-auto md:left-[350px] md:top-[max(8px,calc(100%-350px))] md:[@media(max-height:620px)]:bottom-auto lg:inset-x-3 lg:top-3'
const BUBBLE_COMPACT = 'top-1 right-2 left-[150px] md:right-0 md:left-[296px] md:top-2 lg:inset-x-3 lg:top-3'

// Papan nama tidak boleh menutupi tangan yang bertumpu di tepi meja: di
// langkah Sapa di depan meja, di bawah tangan; di langkah lain kecil di tepi
// bawah panggung, di samping siku pembeli (di layar lebar di bawah tangan).
// Di layar lebar papan nama Sapa sedikit lebih kecil supaya muat di
// sepotong meja di bawah tangan (h-28) tanpa terpotong.
// Di HP papan nama langkah lain cukup sempit (nama boleh dua baris) supaya
// tidak tertutup mesin kasir di kanan; di layar lebar papan nama ada di
// bawah pembeli (--figure-x).
const PLAQUE_LARGE =
  'top-[calc(100%+30px)] left-1/2 -translate-x-1/2 md:top-[calc(100%+50px)] md:left-[230px] lg:left-(--figure-x) lg:gap-0.5'
const PLAQUE_COMPACT =
  'bottom-1 left-[146px] max-w-[82px] md:left-[300px] md:max-w-none lg:bottom-auto lg:top-[calc(100%+44px)] lg:left-(--figure-x) lg:-translate-x-1/2'
// Setengah lebar wajah dibanding tinggi gambar (26 satuan dari 100, lebar
// gambar 0,759 × tingginya), di langkah Sapa dan di langkah lain (skala 0,84).
const FACE_REACH_LARGE = 'lg:[--face-reach:0.197]'
const FACE_REACH_COMPACT = 'lg:[--face-reach:0.166]'

// Cadangan kalau berkas karakter belum dimuat: balon tetap muncul dan
// panggung tetap bisa pergi.
const ARRIVE_FALLBACK_MS = 2000
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

// Panggung satu pembeli: karakter, papan nama, dan balon bicaranya. Satu
// panggung dipakai untuk keempat langkah, jadi karakter tidak dipasang ulang
// saat langkah berganti. Panggung adalah anak langsung AnimatePresence di
// PlayScreen: saat pembeli berganti, balon memudar, karakter berjalan keluar,
// baru pembeli baru masuk.
// - large: tampilan langkah Sapa (karakter besar, papan nama, fun fact)
// - stepKey/talkMs: kalimat baru dan lama mulut bergerak
// - reaction: umpan balik terakhir, untuk reaksi senang atau sedih
// - handover: bungkusan diserahkan ('reach', lalu 'hold'; lihat AnimeCharacter)
// - farewell: pembeli sudah dilayani dan melambai
// - onArrived: pembeli sudah diam menghadap depan
function CustomerStage({
  character,
  large = false,
  stepKey,
  talkMs,
  reaction,
  handover,
  farewell = false,
  onArrived,
  children,
}) {
  const [isPresent, safeToRemove] = usePresence()
  const [arrived, setArrived] = useState(false)
  const [isPreloaded] = useState(() => getLoadedAnimeCharacter() !== null)

  // Lonceng pintu berbunyi saat pembeli masuk (panggungnya dipasang tepat
  // saat ia mulai berjalan masuk); langkah kakinya menyusul (AnimeCharacter).
  useEffect(() => {
    playCustomerBell()
    const timer = setTimeout(() => setArrived(true), ARRIVE_FALLBACK_MS)
    return () => clearTimeout(timer)
  }, [])

  // Layar main diberi tahu saat pembeli sampai, supaya tombol "Mulai
  // melayani" baru muncul saat pembeli diam menghadap depan.
  const arrivedRef = useRef(onArrived)
  useEffect(() => {
    arrivedRef.current = onArrived
  })
  useEffect(() => {
    if (arrived) arrivedRef.current?.()
  }, [arrived])

  useEffect(() => {
    if (isPresent) return undefined
    const timer = setTimeout(() => safeToRemove?.(), LEAVE_FALLBACK_MS)
    return () => clearTimeout(timer)
  }, [isPresent, safeToRemove])

  const characterProps = {
    characterId: character.id,
    talkKey: stepKey,
    talkMs,
    reaction,
    handover,
    farewell,
    leaving: !isPresent,
    behindCounter: true,
    onArrived: () => setArrived(true),
    onLeft: () => safeToRemove?.(),
    className: 'h-full w-full',
  }
  const showText = arrived && isPresent ? 'shown' : 'hidden'

  return (
    <section aria-label="Pembeli" className="absolute inset-0">
      <div className={`relative mx-auto h-full w-full max-w-5xl lg:stage-fit ${large ? FACE_REACH_LARGE : FACE_REACH_COMPACT}`}>
        <div
          data-customer-figure
          className={`${FIGURE} ${large ? FIGURE_LARGE : FIGURE_COMPACT}`}
          aria-hidden="true"
        >
          {isPreloaded ? (
            <PreloadedCharacter {...characterProps} />
          ) : (
            <Suspense fallback={null}>
              <LazyAnimeCharacter {...characterProps} />
            </Suspense>
          )}
        </div>
        {large ? (
          <m.div
            key="plaque-large"
            data-plaque=""
            variants={FADE}
            initial="hidden"
            animate={showText}
            className={`absolute z-20 flex flex-col items-center gap-1 text-center ${PLAQUE_LARGE}`}
          >
            <p className="rounded-lg border-4 border-tinta bg-terpal-tua px-3 py-0.5 font-heading text-lg leading-tight whitespace-nowrap text-kapur md:text-2xl lg:text-xl">
              {character.name}
            </p>
            <p className="rounded-md bg-kapur/90 px-1.5 text-sm leading-tight whitespace-nowrap md:text-base lg:text-sm">
              {character.origin}
            </p>
          </m.div>
        ) : (
          <m.p
            key="plaque-compact"
            data-plaque=""
            variants={FADE}
            initial="hidden"
            animate={showText}
            className={`absolute z-20 w-max rounded-md border-2 border-tinta bg-terpal-tua px-1.5 py-px text-center font-heading text-xs leading-tight text-kapur md:max-w-none md:border-4 md:px-2 md:text-base ${PLAQUE_COMPACT}`}
          >
            {character.name}
          </m.p>
        )}
        <m.div
          key={stepKey}
          variants={BUBBLE}
          initial="hidden"
          animate={showText}
          data-bubble
          style={{ originX: large ? 0.5 : 0, originY: large ? 1 : 0.5 }}
          className={`absolute z-20 ${large ? BUBBLE_LARGE : BUBBLE_COMPACT}`}
        >
          <SpeechBubble tail={large ? 'bottom' : 'left'} compact={!large}>
            {children}
          </SpeechBubble>
        </m.div>
      </div>
    </section>
  )
}

export default CustomerStage
