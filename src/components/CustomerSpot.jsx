import { lazy, Suspense } from 'react'
import { loadAnimeCharacter } from './character/loadAnimeCharacter.js'
import SpeechBubble from './SpeechBubble.jsx'

// Karakter anime (sekitar 20 kB JS dan CSS) dimuat terpisah supaya bundel
// awal tidak membesar. Selama berkasnya dimuat, ruangnya sudah tersedia
// (tanpa layout shift).
const AnimeCharacter = lazy(loadAnimeCharacter)

// Gerak kartu ringkas: datang dari kiri saat muncul, pergi ke kanan saat
// `leaving`. Dengan "kurangi gerakan", kartu hanya memudar. Tanda ! diperlukan
// supaya fade tidak dimatikan aturan reduced-motion global di index.css.
const ARRIVE = 'motion-safe:animate-arrive motion-reduce:animate-fade-in!'
const LEAVE = 'motion-safe:animate-leave motion-reduce:animate-fade-out!'
const FADE_ONLY = 'motion-reduce:animate-fade-in!'
// Balon bicara muncul setelah pembeli berhenti. Tanpa gerak, balon ikut kartu.
const BUBBLE = 'motion-safe:animate-bubble-in'
const BUBBLE_AFTER_WALK = 'motion-safe:animate-bubble-after-walk'
// Pembeli di langkah Sapa mulai bicara setelah berjalan masuk dan menoleh.
const TALK_AFTER_WALK_MS = 1300
const TALK_AFTER_CARD_MS = 400

function Figure({ className, ...props }) {
  return (
    <div className={`relative shrink-0 ${className}`} aria-hidden="true">
      <Suspense fallback={null}>
        <AnimeCharacter className="h-full w-full" {...props} />
      </Suspense>
    </div>
  )
}

// Pembeli dan balon bicaranya.
// `large`: tampilan penuh untuk langkah Sapa: pembeli berjalan masuk.
// Selain itu ringkas: pembeli kecil di samping balon bicara pendek.
// `leaving` + `onLeft`: kartu ringkas pergi (setelah anak menekan tombol).
// `walkingOut`: pembeli melambai lalu berjalan keluar (setelah dilayani).
// `talkKey`/`talkMs`: mulut bergerak saat kalimat baru tampil.
// `reaction`: umpan balik terakhir, untuk reaksi senang atau sedih.
function CustomerSpot({
  character,
  large = false,
  leaving = false,
  onLeft,
  walkingOut = false,
  talkKey,
  talkMs,
  reaction,
  children,
}) {
  function handleAnimationEnd(event) {
    if (leaving && event.target === event.currentTarget) onLeft?.()
  }
  const figureProps = { characterId: character.id, talkKey, talkMs, reaction }

  if (large) {
    return (
      <div className={`flex flex-col items-center gap-3 md:flex-row md:items-start md:gap-6 ${FADE_ONLY}`}>
        <div className="flex shrink-0 flex-col items-center gap-1 text-center">
          <Figure
            className="h-32 w-[92px] md:h-44 md:w-[126px]"
            entrance="walk"
            talkDelayMs={TALK_AFTER_WALK_MS}
            {...figureProps}
          />
          <div className="flex flex-col items-center gap-1 motion-safe:animate-label-after-walk">
            <p className="rounded-lg border-4 border-tinta bg-terpal-tua px-2 py-0.5 font-heading text-base leading-tight text-kapur">
              {character.name}
            </p>
            <p className="text-sm leading-tight">{character.origin}</p>
          </div>
        </div>
        <SpeechBubble tail="top" className={`w-full md:mt-2 md:flex-1 ${BUBBLE_AFTER_WALK}`}>
          {children}
        </SpeechBubble>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center gap-2 md:gap-4 ${leaving ? LEAVE : ARRIVE}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="flex w-16 shrink-0 flex-col items-center md:w-20">
        <Figure
          className="h-16 w-[46px] md:h-[88px] md:w-[63px]"
          entrance="step"
          leaving={walkingOut}
          talkDelayMs={TALK_AFTER_CARD_MS}
          {...figureProps}
        />
        <p className="mt-0.5 line-clamp-2 text-center text-[11px] leading-tight font-bold md:text-sm">
          {character.name}
        </p>
      </div>
      <SpeechBubble className={`z-10 min-w-0 flex-1 ${BUBBLE}`} compact>
        {children}
      </SpeechBubble>
    </div>
  )
}

export default CustomerSpot
