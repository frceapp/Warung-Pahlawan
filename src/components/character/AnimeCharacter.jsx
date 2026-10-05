import { useEffect, useRef, useState } from 'react'
import './animeCharacter.css'
import { CHARACTER_LOOKS } from './characterLooks.js'
import {
  cloth,
  FACE_PATH,
  faceAccessories,
  hairBack,
  hairFront,
  headwear,
  headwearBack,
  legColor,
  paint,
  shoulderDrape,
  sleeveColor,
  torso,
} from './characterParts.jsx'

const BLINK_MS = 160
const REACTION_MS = 900

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

function Leg({ x, look }) {
  return (
    <>
      <rect x={x - 4.5} y="95" width="9" height="33" rx="4" fill={legColor(look)} />
      <ellipse cx={x + 2} cy="129.5" rx="6.5" ry="3.8" fill={paint('tinta')} />
    </>
  )
}

function Arm({ x, look }) {
  return (
    <>
      <rect x={x - 4} y="73" width="8" height="23" rx="4" fill={sleeveColor(look)} />
      <circle cx={x} cy="97.5" r="4.6" fill={paint(look.skin)} />
    </>
  )
}

function Eye({ cx }) {
  return (
    <g>
      <ellipse cx={cx} cy="50" rx="5.2" ry="6.8" fill={paint('tinta')} stroke="none" />
      <ellipse cx={cx} cy="52.6" rx="3.4" ry="3.1" fill="#6B4528" stroke="none" />
      <circle cx={cx + 1.8} cy="47.2" r="2.3" fill={paint('kapur')} stroke="none" />
      <circle cx={cx - 1.7} cy="53.6" r="1" fill={paint('kapur')} stroke="none" />
      <path d={`M${cx - 6.6} 45.2 Q${cx} 40.4 ${cx + 6.6} 45.2`} fill="none" strokeWidth="2.6" />
    </g>
  )
}

// Karakter pembeli bergaya anime (chibi) dari satu rangka SVG bersama.
// Bagian rangka: rambut belakang, kaki kiri dan kanan, lengan kiri dan
// kanan, badan, kain bawah, kepala (wajah, rambut depan, penutup kepala).
// Semua gerak ada di animeCharacter.css dan hanya memakai transform dan
// opacity. Komponen ini mengatur keadaan lewat atribut data-*:
// - entrance: 'walk' (berjalan masuk, menoleh, melambai), 'step' (selangkah
//   bersama kartu), atau 'none'
// - leaving: melambai lalu berjalan keluar ke kanan
// - talkKey/talkMs/talkDelayMs: mulut bergerak selama kalimat baru dibaca
// - reaction: { id, tone } dari umpan balik; 'success' melompat dan senyum,
//   'error' menggeleng, alis turun, dan mulut cemberut
// Ilustrasi ini dekoratif (aria-hidden); nama tokoh ditulis di luar.
function AnimeCharacter({
  characterId,
  entrance = 'walk',
  leaving = false,
  talkKey,
  talkMs = 1500,
  talkDelayMs = 0,
  reaction,
  rng = Math.random,
  className = '',
}) {
  const look = CHARACTER_LOOKS[characterId]
  if (!look) throw new Error(`Unknown character look: ${characterId}`)
  const rootRef = useRef(null)
  const [talking, setTalking] = useState(false)

  // Kedip mata tiap 3 sampai 5 detik dengan jeda acak. Tidak berjalan saat
  // tab tersembunyi atau saat pengguna memilih kurangi gerakan.
  useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return undefined
    let timer
    let openTimer
    const schedule = () => {
      timer = setTimeout(() => {
        if (!document.hidden) {
          root.setAttribute('data-blink', '')
          openTimer = setTimeout(() => root.removeAttribute('data-blink'), BLINK_MS)
        }
        schedule()
      }, 3000 + rng() * 2000)
    }
    schedule()
    return () => {
      clearTimeout(timer)
      clearTimeout(openTimer)
    }
  }, [rng])

  // Animasi berulang (napas, rambut) berhenti saat tab tidak aktif.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const update = () => root.toggleAttribute('data-paused', document.hidden)
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  // Mulut bergerak selama kalimat baru tampil, lalu berhenti.
  useEffect(() => {
    if (talkKey === undefined || prefersReducedMotion()) return undefined
    const start = setTimeout(() => setTalking(true), talkDelayMs)
    const stop = setTimeout(() => setTalking(false), talkDelayMs + talkMs)
    return () => {
      clearTimeout(start)
      clearTimeout(stop)
      setTalking(false)
    }
  }, [talkKey, talkMs, talkDelayMs])

  // Reaksi terhadap jawaban anak. Umpan balik yang sudah ada saat karakter
  // muncul (misalnya dari pembeli sebelumnya) tidak memicu reaksi. Atribut
  // dipasang ulang supaya reaksi yang sama berturut-turut tetap terlihat.
  const reactionId = reaction?.id
  const reactionTone = reaction?.tone
  const mountReactionId = useRef(reactionId)
  useEffect(() => {
    const root = rootRef.current
    if (!root || reactionId === mountReactionId.current || prefersReducedMotion()) return undefined
    const mood = reactionTone === 'success' ? 'happy' : reactionTone === 'error' ? 'sad' : null
    if (!mood) return undefined
    root.removeAttribute('data-react')
    void root.getBoundingClientRect()
    root.setAttribute('data-react', mood)
    const timer = setTimeout(() => root.removeAttribute('data-react'), REACTION_MS)
    return () => {
      clearTimeout(timer)
      root.removeAttribute('data-react')
    }
  }, [reactionId, reactionTone])

  const covered = look.accessories.includes('selendang')

  return (
    <div
      ref={rootRef}
      className={`ch ${className}`}
      data-entrance={entrance}
      data-phase={leaving ? 'exit' : 'in'}
      data-talking={talking ? '' : undefined}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 140" className="block h-full w-full overflow-visible">
        <g stroke={paint('tinta')} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
          <g className="ch-jump">
            <g className="ch-walkbob">
              <g className="ch-up">
                <g className="ch-head-b">
                  <g className="ch-hair-back">
                    {headwearBack(look)}
                    {hairBack(look)}
                  </g>
                </g>
              </g>
              <g className="ch-leg-b-pos">
                <g className="ch-leg-b">
                  <Leg x={44} look={look} />
                </g>
              </g>
              <g className="ch-up">
                <g className="ch-arm-b-pos">
                  <g className="ch-arm-b">
                    <Arm x={32} look={look} />
                  </g>
                </g>
                <g className="ch-body">{torso(look)}</g>
              </g>
              <g className="ch-leg-f-pos">
                <g className="ch-leg-f">
                  <Leg x={56} look={look} />
                </g>
              </g>
              <g className="ch-cloth">{cloth(look)}</g>
              <g className="ch-up">
                {shoulderDrape(look)}
                <g className="ch-head">
                  {!covered && (
                    <g fill={paint(look.skin)}>
                      <ellipse cx="24.5" cy="49" rx="3.8" ry="5.2" />
                      <ellipse cx="75.5" cy="49" rx="3.8" ry="5.2" />
                    </g>
                  )}
                  <path d={FACE_PATH} fill={paint(look.skin)} />
                  <g fill={paint('cabai')} opacity="0.28" stroke="none">
                    <ellipse cx="32.5" cy="58" rx="4" ry="2.4" />
                    <ellipse cx="67.5" cy="58" rx="4" ry="2.4" />
                  </g>
                  <g className="ch-face">
                    <g className="ch-eyes">
                      <Eye cx={40} />
                      <Eye cx={60} />
                    </g>
                    <g className="ch-eyes-closed" fill="none" strokeWidth="2.6">
                      <path d="M33.6 50 Q40 54.2 46.4 50" />
                      <path d="M53.6 50 Q60 54.2 66.4 50" />
                    </g>
                    <path className="ch-brow-l" d="M33 38.5 Q39 35 45 37" fill="none" strokeWidth="2.2" />
                    <path className="ch-brow-r" d="M55 37 Q61 35 67 38.5" fill="none" strokeWidth="2.2" />
                    <path d="M50.6 54.6 l-0.9 1.7" fill="none" strokeWidth="1.6" />
                    <path className="ch-mouth-smile" d="M45.5 59 Q50 62.6 54.5 59" fill="none" strokeWidth="2.2" />
                    <path className="ch-mouth-sad" d="M46 61.5 Q50 58.6 54 61.5" fill="none" strokeWidth="2.2" />
                    <g className="ch-mouth-open">
                      <ellipse cx="50" cy="60" rx="3.2" ry="2.8" fill={paint('tinta')} strokeWidth="1.4" />
                      <ellipse cx="50" cy="61.4" rx="1.8" ry="1" fill={paint('cabai')} stroke="none" />
                    </g>
                    <g className="ch-mouth-grin">
                      <path d="M43.5 57.5 Q50 67 56.5 57.5 Z" fill={paint('tinta')} strokeWidth="1.6" />
                      <path d="M46.5 62.4 Q50 64.6 53.5 62.4 Q50 60.7 46.5 62.4 Z" fill={paint('cabai')} stroke="none" />
                    </g>
                    {faceAccessories(look)}
                  </g>
                  <g className="ch-hair-front">{hairFront(look)}</g>
                  {headwear(look)}
                </g>
                <g className="ch-arm-f-pos">
                  <g className="ch-arm-f">
                    <Arm x={68} look={look} />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}

export default AnimeCharacter
