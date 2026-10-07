import { useAnimationControls, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { playFootsteps } from '../../lib/sfx.js'
import { CHARACTER_LOOKS } from './characterLooks.js'
import {
  ARM_JOINTS,
  cloth,
  COUNTER_Y,
  forearm,
  FACE_PATH,
  FRONT_ARM,
  faceAccessories,
  hairBack,
  hairFront,
  headwear,
  headwearBack,
  hand,
  JOINTS,
  legColor,
  paint,
  shoulderDrape,
  SIDE_ARM,
  sideForearm,
  sideHand,
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
  sideUpperArm,
  torso,
  upperArm,
  VIEW_BOX,
} from './characterParts.jsx'
import { shoppingBag } from './shoppingBag.jsx'
import {
  LEAVE_BOB,
  LEAVE_STEPS,
  STEP_S,
  STEP_TIMES,
  WALK_BOB,
  WALK_IN_STEPS,
  WALK_OUT_STEPS,
  WALK_S,
  WALK_TIMES,
} from './walkCycle.js'
import { WAVE_KEYFRAMES, WAVE_PEAK, WAVE_S, WAVE_TIMES } from './wavePose.js'

const BLINK_MS = 160
const REACTION_MS = 900
const WALK_IN_PX = 240

// Titik putar bagian rangka dalam koordinat gambar. Untuk transform-box
// view-box, browser berbeda dalam mengukur transform-origin: dari titik
// (0, 0) atau dari pojok kiri atas viewBox (minX, minY). viewBox svg karena
// itu dimulai di (0, 0) dan gambarnya digeser (SVG_SHIFT), supaya titik putar
// selalu tepat di sendi.
const SVG_VIEW_BOX = `0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`
const SVG_SHIFT = `translate(${-VIEW_BOX.x} ${-VIEW_BOX.y})`
function pivot([x, y]) {
  return { transformBox: 'view-box', originX: `${x}px`, originY: `${y}px` }
}

// Berputar antara tampak samping dan tampak depan dalam sekitar 180 ms:
// badan menyempit paling jauh sampai 60% lalu melebar lagi, sementara tampak
// lama memudar dan tampak baru muncul (crossfade).
const TURN_S = 0.18
const TURN_NARROW = 0.6

const INSTANT_T = { duration: 0 }

// Lengan tampak samping berayun bergantian (kaki tertutup meja kasir).
const ARM_SWING = [0, 28, 0, -28, 0, 26, 0, -26, 0, 16, 0, -10, 0]
const negate = (values) => values.map((v) => (v === 0 ? 0 : -v))


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

// Melambai: siku terangkat ke samping setinggi bahu, lengan bawah condong ke
// atas dan berayun di siku, telapak tangan tetap tegak (sudutnya dihitung di
// wavePose.js dari pose istirahat).
function wave(delay) {
  const transition = { duration: WAVE_S, times: WAVE_TIMES, ease: 'easeInOut', delay }
  return {
    upper: { rotate: WAVE_KEYFRAMES.upper, transition },
    fore: { rotate: WAVE_KEYFRAMES.fore, transition },
    hand: { rotate: WAVE_KEYFRAMES.hand, transition },
  }
}
const GREET_WAVE = wave(0.05)
const FAREWELL_WAVE = wave(0.15)

// Menerima bungkusan: kedua tangan terangkat ke depan dada. Setelah
// diterima, lengan kiri gambar memegang bungkusan dan lengan kanan kembali
// bertumpu (lalu melambai).
const REACH = { upper: -6, fore: 42 }
const HOLD = { upper: -6, fore: 64 }
const ARM_MOVE = { duration: 0.32, ease: 'easeOut' }

function frontArmVariants(isFront) {
  const upper = {
    rest: { rotate: 0, transition: ARM_MOVE },
    reach: { rotate: REACH.upper, transition: ARM_MOVE },
    hold: { rotate: isFront ? 0 : HOLD.upper, transition: ARM_MOVE },
  }
  const fore = {
    rest: { rotate: 0, transition: ARM_MOVE },
    reach: { rotate: REACH.fore, transition: ARM_MOVE },
    hold: { rotate: isFront ? 0 : HOLD.fore, transition: ARM_MOVE },
  }
  const hand = {
    rest: { rotate: 0, transition: ARM_MOVE },
    reach: { rotate: 0, transition: ARM_MOVE },
    hold: { rotate: 0, transition: ARM_MOVE },
  }
  if (isFront) {
    upper.wavePeak = { rotate: WAVE_PEAK.upper }
    fore.wavePeak = { rotate: WAVE_PEAK.fore }
    hand.wavePeak = { rotate: WAVE_PEAK.hand }
    upper.greet = GREET_WAVE.upper
    upper.farewell = FAREWELL_WAVE.upper
    fore.greet = GREET_WAVE.fore
    fore.farewell = FAREWELL_WAVE.fore
    hand.greet = GREET_WAVE.hand
    hand.farewell = FAREWELL_WAVE.hand
  }
  return { upper, fore, hand }
}
const ARM_FRONT = frontArmVariants(true)
const ARM_BACK = frontArmVariants(false)

// Bungkusan selalu menggantung tegak: diputar balik sebesar putaran lengan.
const BAG_GRIP = FRONT_ARM.hand
const BAG_HANG = {
  rest: { rotate: 0, transition: ARM_MOVE },
  reach: { rotate: -(REACH.upper + REACH.fore), transition: ARM_MOVE },
  hold: { rotate: -(HOLD.upper + HOLD.fore), transition: ARM_MOVE },
}
const CLIP_TOP = -40

// Tampak samping saat pergi sambil membawa bungkusan: lengan depan menekuk,
// tangan di depan dada.
const CARRY = { upper: -14, fore: -76 }
const SIDE_GRIP = SIDE_ARM.hand

const VARIANTS = {
  turn: {
    toFront: { scaleX: [1, TURN_NARROW, 1], transition: { duration: TURN_S, times: [0, 0.5, 1], ease: 'easeInOut' } },
    toSide: { scaleX: [1, TURN_NARROW, 1], transition: { duration: TURN_S, times: [0, 0.5, 1], ease: 'easeInOut' } },
  },
  // Crossfade tampak depan dan samping saat berputar.
  front: {
    hidden: { opacity: 0 },
    still: { opacity: 1, transition: INSTANT_T },
    appear: { opacity: 1, transition: INSTANT_T },
    toFront: { opacity: 1, transition: { duration: TURN_S, ease: 'linear' } },
    toSide: { opacity: 0, transition: { duration: TURN_S, ease: 'linear' } },
  },
  side: {
    hidden: { opacity: 1 },
    still: { opacity: 0, transition: INSTANT_T },
    appear: { opacity: 0, transition: INSTANT_T },
    toFront: { opacity: 0, transition: { duration: TURN_S, ease: 'linear' } },
    toSide: { opacity: 1, transition: { duration: TURN_S, ease: 'linear' } },
  },
  walkBob: {
    walk: { y: WALK_BOB, transition: { duration: WALK_S, times: WALK_TIMES, ease: 'linear' } },
    leave: {
      y: LEAVE_BOB,
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

// Lengan tampak depan: lengan atas berputar di bahu, lengan bawah (dengan
// manset dan tangan) berputar di siku. Lengan kiri gambar adalah cerminan
// lengan kanan. Bungkusan menggantung di tangan lengan kiri gambar.
function FrontArm({ look, variants, bag = false, target = false }) {
  return (
    <m.g variants={variants.upper} style={pivot(ARM_JOINTS.shoulder)}>
      {upperArm(look)}
      <m.g variants={variants.fore} style={pivot(ARM_JOINTS.elbow)}>
        {forearm(look)}
        {target && <circle data-hand-target="" cx={BAG_GRIP[0]} cy={BAG_GRIP[1]} r="0.1" fill="none" stroke="none" />}
        {bag && (
          <m.g variants={BAG_HANG} style={pivot(BAG_GRIP)}>
            <g transform={`translate(${BAG_GRIP[0]} ${BAG_GRIP[1]})`} data-bag="">
              {shoppingBag()}
            </g>
          </m.g>
        )}
        <m.g variants={variants.hand} style={pivot(FRONT_ARM.hand)}>
          {hand(look)}
        </m.g>
      </m.g>
    </m.g>
  )
}

// Lengan tampak samping. Lengan depan yang membawa bungkusan menekuk ke depan
// dada dan tidak berayun.
function SideArm({ look, variants, carry = false }) {
  return (
    <m.g
      variants={carry ? undefined : variants}
      style={carry ? { ...pivot(ARM_JOINTS.sideShoulder), rotate: CARRY.upper } : pivot(ARM_JOINTS.sideShoulder)}
    >
      {sideUpperArm(look)}
      <g transform={carry ? `rotate(${CARRY.fore} ${ARM_JOINTS.sideElbow[0]} ${ARM_JOINTS.sideElbow[1]})` : undefined}>
        {sideForearm(look)}
        {carry && (
          <g transform={`rotate(${-(CARRY.upper + CARRY.fore)} ${SIDE_GRIP[0]} ${SIDE_GRIP[1]}) translate(${SIDE_GRIP[0]} ${SIDE_GRIP[1]})`} data-bag="">
            {shoppingBag()}
          </g>
        )}
        {sideHand(look)}
      </g>
    </m.g>
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
// - handover: 'reach' (kedua tangan terangkat menyambut bungkusan) lalu
//   'hold' (memegang bungkusan); bungkusan ikut dibawa saat pergi
// - farewell: melambai setelah selesai dilayani (setelah bungkusan dipegang)
// - leaving + onLeft: berputar ke samping lalu berjalan keluar ke kanan
// - behindCounter: berdiri di belakang meja kasir; badan dipotong di tepi
//   meja (COUNTER_Y), lengan dan tangan tampak depan tetap di depan meja
// - facing ('depan' atau 'samping') dan mirrored: memaksa satu tampak diam,
//   misalnya untuk galeri ilustrasi; pose ('rest', 'wave', 'reach', 'hold')
//   memaksa pose lengan diam
// Dengan kurangi gerakan: tanpa berjalan dan berputar; hanya tampak depan
// yang memudar 150 ms, tanpa gerak diam, kedip, bicara, reaksi, atau gerak
// lengan (bungkusan langsung tampak di tangan).
// Ilustrasi ini dekoratif (aria-hidden).
function AnimeCharacter({
  characterId,
  entrance = true,
  talkKey,
  talkMs = 1500,
  reaction,
  handover,
  farewell = false,
  leaving = false,
  behindCounter = false,
  onArrived,
  onLeft,
  facing,
  pose,
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

  // Berputar: kedua tampak digambar selama putaran (tampak lama memudar,
  // tampak baru muncul, badan menyempit sampai 60% lalu melebar lagi), lalu
  // hanya tampak baru yang tersisa.
  const turnTo = useCallback(
    async (next, isAlive) => {
      flushSync(() => setView('putar'))
      await rig.start(next === 'depan' ? 'toFront' : 'toSide')
      if (!isAlive()) return
      setView(next)
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
      // Bunyi langkah dijadwalkan sekaligus pada titik kaki menapak.
      playFootsteps(WALK_IN_STEPS)
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
        playFootsteps(WALK_OUT_STEPS)
        await rig.start('leave')
      }
      if (alive) callbacks.current.onLeft?.()
    }
    run()
    return () => {
      alive = false
    }
  }, [leaving, reduce, rig, turnTo])

  // Menerima bungkusan: tangan terangkat, lalu memegang bungkusan. Setelah
  // itu melambai (kalau sudah selesai dilayani).
  const holding = handover === 'hold' || pose === 'hold'
  useEffect(() => {
    if (!handover) return
    if (reduce) rig.set(handover)
    else rig.start(handover)
  }, [handover, reduce, rig])

  useEffect(() => {
    if (!farewell || reduce || phaseRef.current !== 'idle') return
    if (handover && handover !== 'hold') return
    rig.start('farewell')
  }, [farewell, handover, reduce, rig])

  // Pose diam untuk galeri.
  useEffect(() => {
    if (!pose) return
    rig.set(pose === 'wave' ? 'wavePeak' : pose)
  }, [pose, rig])

  // Gerak diam berhenti saat tab tidak aktif (varian 'rest' menggantikan
  // gerak berulangnya), lalu lanjut lagi saat tab aktif.
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
  const showFront = shownView === 'depan' || shownView === 'putar'
  const showSide = shownView === 'samping' || shownView === 'putar'
  // Tanpa facing, opacity tampak diatur varian (crossfade saat berputar).
  const viewVariants = (variants) => (facing ? undefined : variants)
  const clipId = `badan-${useId().replace(/:/g, '')}`

  // Rantai transform bersama (putar, lompat, naik turun saat berjalan).
  // Dipakai dua kali: untuk lapisan badan (dipotong di tepi meja) dan untuk
  // lapisan lengan tampak depan (di depan meja); keduanya digerakkan varian
  // yang sama sehingga selalu bergerak bersama.
  const chain = (children) => (
    <m.g data-turn="" variants={VARIANTS.turn} style={pivot(JOINTS.neck)}>
      <m.g variants={VARIANTS.jump}>
        <m.g variants={VARIANTS.walkBob}>{children}</m.g>
      </m.g>
    </m.g>
  )

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
      data-holding={holding ? '' : undefined}
      aria-hidden="true"
    >
      <svg
        viewBox={SVG_VIEW_BOX}
        className="block h-full w-full overflow-visible"
      >
        {behindCounter && (
          <defs>
            <clipPath id={clipId}>
              <rect x="-60" y={CLIP_TOP} width="220" height={COUNTER_Y - CLIP_TOP} />
            </clipPath>
          </defs>
        )}
        <g
          transform={SVG_SHIFT}
          stroke={paint('tinta')}
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          {/* Lapisan badan: di belakang meja kasir, dipotong di tepi meja. */}
          <g clipPath={behindCounter ? `url(#${clipId})` : undefined}>
            {chain(
              <>
                {/* Tampak depan: saat sampai di warung dan selama melayani. */}
                <m.g
                  data-figure="depan"
                  variants={viewVariants(VARIANTS.front)}
                  display={showFront ? undefined : 'none'}
                >
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
                  </m.g>
                </m.g>

                {/* Tampak samping (menghadap kanan): saat berjalan masuk dan
                    keluar. mirrored mencerminkannya untuk arah kiri. Lengan
                    tampak samping ikut di lapisan ini (di belakang meja). */}
                <m.g
                  data-figure="samping"
                  variants={viewVariants(VARIANTS.side)}
                  display={showSide ? undefined : 'none'}
                >
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
                    <SideArm look={look} variants={VARIANTS.sideArmB} />
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
                    <SideArm look={look} variants={VARIANTS.sideArmF} carry={holding} />
                  </g>
                </m.g>
              </>,
            )}
          </g>

          {/* Lapisan lengan tampak depan: di depan meja kasir, jadi tangan
              yang bertumpu di tepi meja tidak terpotong. */}
          {chain(
            <m.g
              data-figure-arms=""
              variants={viewVariants(VARIANTS.front)}
              display={showFront ? undefined : 'none'}
            >
              <m.g variants={VARIANTS.up}>
                <g transform="translate(100 0) scale(-1 1)">
                  <FrontArm look={look} variants={ARM_BACK} bag={holding} target />
                </g>
                <FrontArm look={look} variants={ARM_FRONT} />
              </m.g>
            </m.g>,
          )}
        </g>
      </svg>
    </m.div>
  )
}

export default AnimeCharacter
