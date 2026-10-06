import { useAnimationControls, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { CHARACTER_LOOKS } from './characterLooks.js'
import {
  cloth,
  FACE_PATH,
  faceAccessories,
  hairBack,
  hairFront,
  headwear,
  headwearBack,
  JOINTS,
  legColor,
  paint,
  shoulderDrape,
  SIDE_JOINTS,
  sideFaceAccessories,
  sideFacePath,
  sideHairBack,
  sideHairFront,
  sideHeadwear,
  sideEarCovered,
  sideHeadwearBack,
  sideHeadwearTails,
  sideShoulderDrape,
  sideTorso,
  sleeveColor,
  torso,
  VIEW_BOX,
} from './characterParts.jsx'

const BLINK_MS = 160
const REACTION_MS = 900
const WALK_S = 1.2
const STEP_S = 0.4
const WALK_IN_PX = 240

// Titik putar bagian rangka dalam koordinat viewBox. Untuk transform-box
// view-box, Chromium mengukur transform-origin dari pojok kiri atas viewBox
// (minX, minY), jadi koordinat dikurangi VIEW_BOX.y.
function pivot([x, y]) {
  return { transformBox: 'view-box', originX: `${x - VIEW_BOX.x}px`, originY: `${y - VIEW_BOX.y}px` }
}

// Berputar antara tampak samping dan tampak depan dalam sekitar 200 ms:
// badan menyempit, tampak diganti saat paling sempit, lalu melebar lagi.
const TURN_HALF_S = 0.1
const TURN_NARROW = 0.06

// Tiga langkah dalam 1,2 s; langkah terakhir lebih lambat dan kecil.
const WALK_TIMES = [0, 0.075, 0.15, 0.225, 0.3, 0.38, 0.458, 0.537, 0.617, 0.71, 0.808, 0.905, 1]
// Lengan tampak samping berayun bergantian (kaki tertutup meja kasir).
const ARM_SWING = [0, 28, 0, -28, 0, 26, 0, -26, 0, 16, 0, -10, 0]
// Badan turun saat kaki terbuka, naik saat kaki berpapasan.
const WALK_BOB = [0, 1.5, -2, 1.5, -2, 1.5, -2, 1.5, -2, 1.5, -2, 1, 0]
const negate = (values) => values.map((v) => (v === 0 ? 0 : -v))

// Satu langkah 0,4 s untuk berjalan keluar (diulang).
const STEP_TIMES = [0, 0.25, 0.5, 0.75, 1]
const LEAVE_STEPS = 2

// Bagian yang menjuntai: miring ke belakang saat badan turun (kaki terbuka),
// kembali sedikit saat badan naik, sejalan dengan WALK_BOB.
const TRAIL = [0, 5, 2, 5, 2, 5, 2, 5, 2, 4, 1.5, 2, 0]

// Lengan tampak samping: tiga langkah saat datang, langkah berulang saat
// pergi (dengan arah ayunan pertama yang sama).
function sideArm(swing) {
  const first = swing[1]
  return {
    walk: { rotate: swing, transition: { duration: WALK_S, times: WALK_TIMES, ease: 'linear' } },
    leave: {
      rotate: [0, first, 0, -first, 0],
      transition: { duration: STEP_S, times: STEP_TIMES, ease: 'linear', repeat: LEAVE_STEPS - 1 },
    },
  }
}

const WAVE = {
  rotate: [0, -150, -126, -152, -140, 0],
  times: [0, 0.25, 0.45, 0.65, 0.8, 1],
}

const VARIANTS = {
  turn: {
    squeeze: { scaleX: TURN_NARROW, transition: { duration: TURN_HALF_S, ease: 'easeIn' } },
    unsqueeze: { scaleX: 1, transition: { duration: TURN_HALF_S, ease: 'easeOut' } },
  },
  walkBob: {
    walk: { y: WALK_BOB, transition: { duration: WALK_S, times: WALK_TIMES, ease: 'linear' } },
    leave: {
      y: [0, 1.5, -2, 1.5, 0],
      transition: { duration: STEP_S, times: STEP_TIMES, ease: 'linear', repeat: LEAVE_STEPS - 1 },
    },
  },
  up: {
    idle: { y: [0, -2, 0], transition: { duration: 3.2, ease: 'easeInOut', repeat: Infinity } },
    rest: { y: 0, transition: { duration: 0.2 } },
    leave: { y: 0, transition: { duration: 0.15 } },
  },
  sideArmB: sideArm(ARM_SWING),
  sideArmF: sideArm(negate(ARM_SWING)),
  armF: {
    greet: { rotate: WAVE.rotate, transition: { duration: 0.8, times: WAVE.times, ease: 'easeInOut', delay: 0.05 } },
    farewell: { rotate: WAVE.rotate, transition: { duration: 0.8, times: WAVE.times, ease: 'easeInOut', delay: 0.4 } },
  },
  // Rambut belakang (tampak depan) bergoyang pelan saat diam. Rambut yang
  // menempel di kepala tidak diputar, supaya tidak tampak lepas dari kepala.
  hair: {
    idle: { rotate: [0, 1.5, 0], transition: { duration: 3.6, ease: 'easeInOut', repeat: Infinity } },
    rest: { rotate: 0, transition: { duration: 0.2 } },
  },
  // Bagian yang menjuntai di tampak samping (konde, rambut panjang, ujung
  // ikat kepala, kerudung): tertinggal sedikit ke belakang dari titik
  // tempelnya dan memantul kecil tiap langkah, sedikit terlambat dari badan.
  trail: {
    walk: { rotate: TRAIL, transition: { duration: WALK_S, times: WALK_TIMES, ease: 'easeInOut', delay: 0.06 } },
    leave: {
      rotate: [0, 5, 2, 5, 2],
      transition: { duration: STEP_S, times: STEP_TIMES, ease: 'easeInOut', delay: 0.06, repeat: LEAVE_STEPS - 1 },
    },
  },
  jump: {
    happy: { y: [0, -14, 0, -3, 0], transition: { duration: 0.52, times: [0, 0.35, 0.6, 0.75, 1], ease: 'easeOut' } },
  },
  shake: {
    sad: { rotate: [0, -7, 6, -5, 3, 0], transition: { duration: 0.64, ease: 'easeInOut' } },
  },
  browL: {
    sad: { y: [0, 2.5, 2.5, 0], rotate: [0, -20, -20, 0], transition: { duration: REACTION_MS / 1000, times: [0, 0.15, 0.85, 1] } },
  },
  browR: {
    sad: { y: [0, 2.5, 2.5, 0], rotate: [0, 20, 20, 0], transition: { duration: REACTION_MS / 1000, times: [0, 0.15, 0.85, 1] } },
  },
}

function rootVariants(leaveDistance) {
  return {
    hidden: { x: -WALK_IN_PX, opacity: 0 },
    walk: {
      x: 0,
      opacity: 1,
      transition: { x: { duration: WALK_S, ease: [0.3, 0.55, 0.45, 1] }, opacity: { duration: 0.15 } },
    },
    still: { x: 0, opacity: 1, transition: { duration: 0 } },
    appear: { x: 0, opacity: 1, transition: { opacity: { duration: 0.15 }, x: { duration: 0 } } },
    leave: {
      x: leaveDistance,
      opacity: [1, 1, 0],
      transition: {
        x: { duration: STEP_S * LEAVE_STEPS, ease: [0.3, 0, 0.7, 1] },
        opacity: { duration: STEP_S * LEAVE_STEPS, times: [0, 0.8, 1] },
      },
    },
    fadeOut: { opacity: 0, transition: { duration: 0.15 } },
  }
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

function SideEye() {
  return (
    <g>
      <ellipse cx="65" cy="50" rx="3.6" ry="6.6" fill={paint('tinta')} stroke="none" />
      <ellipse cx="65.6" cy="52.6" rx="2.3" ry="3" fill="#6B4528" stroke="none" />
      <circle cx="66.4" cy="47.4" r="1.6" fill={paint('kapur')} stroke="none" />
      <path d="M60.5 45 Q65 40.8 69.5 44.6" fill="none" strokeWidth="2.6" />
    </g>
  )
}

const INSTANT = { duration: 0 }

// Karakter pembeli bergaya anime (chibi) dari satu rangka SVG bersama, dengan
// dua tampak: depan dan samping (menghadap kanan; dicerminkan dengan
// scaleX(-1) untuk arah kiri, tanpa digambar dua kali).
// Bagian rangka tampak depan: rambut belakang, kaki, lengan kiri dan kanan,
// badan, kain bawah, kepala (wajah, rambut depan, penutup kepala). Tampak
// samping: kepala profil (satu mata, hidung, satu telinga), badan ramping,
// dan dua lengan bertumpuk; kaki tidak digambar karena tertutup meja kasir.
// Semua gerak memakai Motion dan hanya transform serta opacity:
// - saat muncul: tampak samping berjalan masuk dari kiri (lengan berayun,
//   badan naik turun), berputar ke depan, melambai, lalu diam (napas pelan,
//   rambut bergoyang, kedip acak)
// - talkKey/talkMs: mulut bergerak selama kalimat baru tampil
// - reaction: { id, tone } dari umpan balik; 'success' melompat dan senyum,
//   'error' menggeleng, alis turun, dan mulut cemberut
// - farewell: melambai setelah selesai dilayani
// - leaving + onLeft: berputar ke samping lalu berjalan keluar ke kanan
// - facing ('depan' atau 'samping') dan mirrored: memaksa satu tampak diam,
//   misalnya untuk galeri ilustrasi
// Dengan kurangi gerakan: tanpa berjalan dan berputar; hanya tampak depan
// yang memudar 150 ms, tanpa gerak diam, kedip, bicara, atau reaksi.
// Ilustrasi ini dekoratif (aria-hidden).
function AnimeCharacter({
  characterId,
  entrance = true,
  talkKey,
  talkMs = 1500,
  reaction,
  farewell = false,
  leaving = false,
  onArrived,
  onLeft,
  facing,
  mirrored = false,
  rng = Math.random,
  className = '',
}) {
  const look = CHARACTER_LOOKS[characterId]
  if (!look) throw new Error(`Unknown character look: ${characterId}`)
  const reduce = useReducedMotion()
  const rig = useAnimationControls()
  const [phase, setPhase] = useState('hidden')
  const phaseRef = useRef('hidden')
  const [view, setView] = useState(() => (reduce || !entrance ? 'depan' : 'samping'))
  const [talking, setTalking] = useState(false)
  const [blink, setBlink] = useState(false)
  // Jarak berjalan keluar: sampai lewat tepi kanan layar, paling jauh 600 px.
  const [leaveDistance] = useState(() => Math.min(typeof window === 'undefined' ? 600 : window.innerWidth, 600))
  const callbacks = useRef({ onArrived, onLeft })
  useEffect(() => {
    callbacks.current = { onArrived, onLeft }
  })

  const go = useCallback(
    (next) => {
      phaseRef.current = next
      setPhase(next)
      return rig.start(next)
    },
    [rig],
  )

  // Berputar: menyempit, ganti tampak tepat saat paling sempit (dalam satu
  // commit, jadi tidak ada frame kosong atau dua tampak sekaligus), lalu
  // melebar lagi.
  const turnTo = useCallback(
    async (next, isAlive) => {
      await rig.start('squeeze')
      if (!isAlive()) return
      flushSync(() => setView(next))
      await rig.start('unsqueeze')
    },
    [rig],
  )

  // Datang: berjalan masuk (tampak samping), berputar ke depan, melambai,
  // lalu diam.
  useEffect(() => {
    let alive = true
    const isAlive = () => alive
    const run = async () => {
      if (reduce || !entrance) {
        await go(reduce ? 'appear' : 'still')
        if (!alive) return
        callbacks.current.onArrived?.()
        if (!reduce) go('idle')
        return
      }
      await go('walk')
      if (!alive) return
      phaseRef.current = 'turn'
      setPhase('turn')
      await turnTo('depan', isAlive)
      if (!alive) return
      callbacks.current.onArrived?.()
      await go('greet')
      if (alive && phaseRef.current === 'greet') go('idle')
    }
    run()
    return () => {
      alive = false
    }
  }, [entrance, go, reduce, turnTo])

  // Pergi: berputar ke samping (menghadap kanan) lalu berjalan keluar ke kanan.
  useEffect(() => {
    if (!leaving) return undefined
    let alive = true
    const isAlive = () => alive
    phaseRef.current = 'leave'
    const run = async () => {
      if (reduce) {
        await rig.start('fadeOut')
      } else {
        await turnTo('samping', isAlive)
        if (!alive) return
        await rig.start('leave')
      }
      if (alive) callbacks.current.onLeft?.()
    }
    run()
    return () => {
      alive = false
    }
  }, [leaving, reduce, rig, turnTo])

  // Melambai setelah selesai dilayani.
  useEffect(() => {
    if (!farewell || reduce || phaseRef.current !== 'idle') return
    rig.start('farewell')
  }, [farewell, reduce, rig])

  // Gerak diam berhenti saat tab tidak aktif (varian 'rest' menggantikan
  // perulangannya), lalu lanjut lagi saat tab aktif.
  useEffect(() => {
    if (reduce) return undefined
    const update = () => {
      if (phaseRef.current !== 'idle') return
      rig.start(document.hidden ? 'rest' : 'idle')
    }
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [reduce, rig])

  // Kedip tiap 3 sampai 5 detik dengan jeda acak.
  useEffect(() => {
    if (reduce) return undefined
    let timer
    let openTimer
    const schedule = () => {
      timer = setTimeout(() => {
        if (!document.hidden && phaseRef.current !== 'leave') {
          setBlink(true)
          openTimer = setTimeout(() => setBlink(false), BLINK_MS)
        }
        schedule()
      }, 3000 + rng() * 2000)
    }
    schedule()
    return () => {
      clearTimeout(timer)
      clearTimeout(openTimer)
    }
  }, [reduce, rng])

  // Bicara setelah sampai di warung, selama kalimat baru tampil.
  const shownPhase = leaving ? 'leave' : phase
  const arrived = !['hidden', 'walk', 'turn', 'leave'].includes(shownPhase)
  useEffect(() => {
    if (talkKey === undefined || reduce || !arrived) return undefined
    const start = setTimeout(() => setTalking(true), 80)
    const stop = setTimeout(() => setTalking(false), 80 + talkMs)
    return () => {
      clearTimeout(start)
      clearTimeout(stop)
      setTalking(false)
    }
  }, [talkKey, talkMs, reduce, arrived])

  // Reaksi terhadap jawaban anak, selama REACTION_MS. Umpan balik yang sudah
  // ada saat karakter muncul (misalnya dari pembeli sebelumnya) tidak memicu
  // reaksi.
  const reactionId = reaction?.id
  const reactionTone = reaction?.tone
  const [finishedReactionId, setFinishedReactionId] = useState(reactionId)
  const mood =
    reduce || reactionId === finishedReactionId
      ? null
      : reactionTone === 'success'
        ? 'happy'
        : reactionTone === 'error'
          ? 'sad'
          : null
  useEffect(() => {
    if (!mood) return undefined
    rig.start(mood)
    const timer = setTimeout(() => setFinishedReactionId(reactionId), REACTION_MS)
    return () => clearTimeout(timer)
  }, [mood, reactionId, rig])

  const mouth =
    shownPhase === 'leave' ? 'smile' : mood === 'happy' ? 'grin' : mood === 'sad' ? 'frown' : talking ? 'talk' : 'smile'
  const covered = look.accessories.includes('selendang')
  const show = (on) => ({ opacity: on ? 1 : 0 })
  const shownView = facing ?? view

  return (
    <m.div
      className={`relative ${className}`}
      initial={reduce ? { opacity: 0 } : 'hidden'}
      animate={rig}
      variants={rootVariants(leaveDistance)}
      data-phase={shownPhase}
      data-view={shownView}
      data-mouth={mouth}
      data-blink={blink ? '' : undefined}
      aria-hidden="true"
    >
      <svg
        viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
        className="block h-full w-full overflow-visible"
      >
        <g stroke={paint('tinta')} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
          <m.g variants={VARIANTS.turn} style={pivot(JOINTS.neck)}>
            <m.g variants={VARIANTS.jump}>
              <m.g variants={VARIANTS.walkBob}>
                {/* Tampak depan: saat sampai di warung dan selama melayani. */}
                <g data-figure="depan" display={shownView === 'depan' ? undefined : 'none'}>
                  <m.g variants={VARIANTS.up}>
                    <m.g variants={VARIANTS.shake} style={pivot(JOINTS.neck)}>
                      <m.g variants={VARIANTS.hair} style={pivot(JOINTS.hairTop)}>
                        {headwearBack(look)}
                        {hairBack(look)}
                      </m.g>
                    </m.g>
                  </m.g>
                  <Leg x={JOINTS.hipBack[0]} look={look} />
                  <m.g variants={VARIANTS.up}>
                    <Arm x={JOINTS.shoulderBack[0]} look={look} />
                    <g>{torso(look)}</g>
                  </m.g>
                  <Leg x={JOINTS.hipFront[0]} look={look} />
                  {cloth(look)}
                  <m.g variants={VARIANTS.up}>
                    {shoulderDrape(look)}
                    <m.g variants={VARIANTS.shake} style={pivot(JOINTS.neck)}>
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
                      <g>
                        <m.g animate={show(!blink)} transition={INSTANT}>
                          <Eye cx={40} />
                          <Eye cx={60} />
                        </m.g>
                        <m.g animate={show(blink)} initial={false} transition={INSTANT} fill="none" strokeWidth="2.6">
                          <path d="M33.6 50 Q40 54.2 46.4 50" />
                          <path d="M53.6 50 Q60 54.2 66.4 50" />
                        </m.g>
                        <m.path
                          variants={VARIANTS.browL}
                          style={pivot(JOINTS.browBack)}
                          d="M33 38.5 Q39 35 45 37"
                          fill="none"
                          strokeWidth="2.2"
                        />
                        <m.path
                          variants={VARIANTS.browR}
                          style={pivot(JOINTS.browFront)}
                          d="M55 37 Q61 35 67 38.5"
                          fill="none"
                          strokeWidth="2.2"
                        />
                        <path d="M50.6 54.6 l-0.9 1.7" fill="none" strokeWidth="1.6" />
                        <m.path
                          animate={show(mouth === 'smile')}
                          transition={INSTANT}
                          d="M45.5 59 Q50 62.6 54.5 59"
                          fill="none"
                          strokeWidth="2.2"
                        />
                        <m.path
                          initial={false}
                          animate={show(mouth === 'frown')}
                          transition={INSTANT}
                          d="M46 61.5 Q50 58.6 54 61.5"
                          fill="none"
                          strokeWidth="2.2"
                        />
                        <m.g
                          initial={false}
                          style={pivot(JOINTS.mouth)}
                          animate={mouth === 'talk' ? { opacity: 1, scaleY: [0.3, 1] } : { opacity: 0, scaleY: 1 }}
                          transition={
                            mouth === 'talk'
                              ? { opacity: INSTANT, scaleY: { duration: 0.22, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' } }
                              : INSTANT
                          }
                        >
                          <ellipse cx="50" cy="60" rx="3.2" ry="2.8" fill={paint('tinta')} strokeWidth="1.4" />
                          <ellipse cx="50" cy="61.4" rx="1.8" ry="1" fill={paint('cabai')} stroke="none" />
                        </m.g>
                        <m.g initial={false} animate={show(mouth === 'grin')} transition={INSTANT}>
                          <path d="M43.5 57.5 Q50 67 56.5 57.5 Z" fill={paint('tinta')} strokeWidth="1.6" />
                          <path d="M46.5 62.4 Q50 64.6 53.5 62.4 Q50 60.7 46.5 62.4 Z" fill={paint('cabai')} stroke="none" />
                        </m.g>
                        {faceAccessories(look)}
                      </g>
                      {hairFront(look)}
                      {headwear(look)}
                    </m.g>
                    <m.g variants={VARIANTS.armF} style={pivot(JOINTS.shoulderFront)}>
                      <Arm x={JOINTS.shoulderFront[0]} look={look} />
                    </m.g>
                  </m.g>
                </g>

                {/* Tampak samping (menghadap kanan): saat berjalan masuk dan
                    keluar. mirrored mencerminkannya untuk arah kiri. */}
                <g data-figure="samping" display={shownView === 'samping' ? undefined : 'none'}>
                  <g transform={mirrored ? 'translate(100 0) scale(-1 1)' : undefined}>
                    <m.g variants={VARIANTS.trail} style={pivot(SIDE_JOINTS.veil)}>
                      {sideHeadwearBack(look)}
                    </m.g>
                    <m.g
                      variants={VARIANTS.trail}
                      style={pivot(look.side.hair === 'sanggul' ? SIDE_JOINTS.bun : SIDE_JOINTS.longHair)}
                    >
                      {sideHairBack(look)}
                    </m.g>
                    <m.g variants={VARIANTS.trail} style={pivot(SIDE_JOINTS.tails)}>
                      {sideHeadwearTails(look)}
                    </m.g>
                    <m.g variants={VARIANTS.sideArmB} style={pivot(SIDE_JOINTS.shoulder)}>
                      <Arm x={SIDE_JOINTS.shoulder[0]} look={look} />
                    </m.g>
                    <g>{sideTorso(look)}</g>
                    {sideShoulderDrape(look)}
                    <path d={sideFacePath(look)} fill={paint(look.skin)} />
                    <ellipse cx="66" cy="57.5" rx="3.4" ry="2.2" fill={paint('cabai')} opacity="0.28" stroke="none" />
                    <m.g animate={show(!blink)} transition={INSTANT}>
                      <SideEye />
                    </m.g>
                    <m.path
                      animate={show(blink)}
                      initial={false}
                      transition={INSTANT}
                      d="M60.5 50 Q65 53.8 69.5 50"
                      fill="none"
                      strokeWidth="2.6"
                    />
                    <path d="M60 38 Q65 35.4 70 37.4" fill="none" strokeWidth="2.2" />
                    <path d="M67.5 59.5 Q70.5 61.6 73.5 59" fill="none" strokeWidth="2.2" />
                    {sideHairFront(look)}
                    {!sideEarCovered(look) && (
                      <g>
                        <ellipse cx="47" cy="50" rx="4.2" ry="5.6" fill={paint(look.skin)} />
                        <path d="M48 47 Q45.5 50 48 53" fill="none" strokeWidth="1.6" />
                      </g>
                    )}
                    {sideFaceAccessories(look)}
                    {sideHeadwear(look)}
                    <m.g variants={VARIANTS.sideArmF} style={pivot(SIDE_JOINTS.shoulder)}>
                      <Arm x={SIDE_JOINTS.shoulder[0]} look={look} />
                    </m.g>
                  </g>
                </g>
              </m.g>
            </m.g>
          </m.g>
        </g>
      </svg>
    </m.div>
  )
}

export default AnimeCharacter
