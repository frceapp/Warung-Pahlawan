// Pose melambai lengan kanan gambar (tampak depan), dihitung dari posisi
// sendi pose istirahat (FRONT_ARM: bahu, siku, tangan bertumpu di meja).
//
// Lengan chibi pendek: tangan paling jauh 26,8 satuan dari bahu, jadi tangan
// tidak bisa sampai setinggi telinga tanpa menimpa kepala. Di puncak
// lambaian tangan berada di samping rahang, di luar siluet kepala: siku
// terangkat ke samping kira-kira setinggi bahu, lengan bawah condong ke atas
// dan ke luar (50 derajat dari tegak), lalu berayun 15 derajat ke kiri dan
// ke kanan. Telapak tangan diputar balik supaya tetap tegak (jari ke atas).
import { FRONT_ARM } from './characterParts.jsx'

const deg = (rad) => (rad * 180) / Math.PI
const angleOf = ([x, y]) => deg(Math.atan2(y, x))
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]

// Arah (derajat, 0 = ke kanan, -90 = tegak ke atas) di pose istirahat.
const REST_UPPER = angleOf(sub(FRONT_ARM.elbow, FRONT_ARM.shoulder))
const REST_FORE = angleOf(sub(FRONT_ARM.hand, FRONT_ARM.elbow))
const UPPER_LENGTH = Math.hypot(...sub(FRONT_ARM.elbow, FRONT_ARM.shoulder))
const FORE_LENGTH = Math.hypot(...sub(FRONT_ARM.hand, FRONT_ARM.elbow))

// Arah yang dituju di puncak lambaian.
export const WAVE_UPPER_DIRECTION = REST_UPPER - 62
export const WAVE_FORE_DIRECTION = -40
export const WAVE_SWING = 15

const round = (value) => Math.round(value * 100) / 100

// Putaran lengan atas (di bahu), lengan bawah (di siku, relatif ke lengan
// atas), dan tangan (di pusat tangan, relatif ke lengan bawah) untuk arah
// lengan bawah tertentu, ditambah posisi siku dan tangan dalam satuan viewBox.
export function wavePose(foreDirection) {
  const upper = WAVE_UPPER_DIRECTION - REST_UPPER
  const fore = foreDirection - REST_FORE - upper
  // Tangan digambar menghadap ke bawah lalu diputar handAngle; jari ke atas
  // berarti arah dunia 180 derajat.
  let hand = 180 - (FRONT_ARM.handAngle + upper + fore)
  hand = ((((hand + 180) % 360) + 360) % 360) - 180
  const u = (WAVE_UPPER_DIRECTION * Math.PI) / 180
  const f = (foreDirection * Math.PI) / 180
  const elbow = [FRONT_ARM.shoulder[0] + UPPER_LENGTH * Math.cos(u), FRONT_ARM.shoulder[1] + UPPER_LENGTH * Math.sin(u)]
  const handAt = [elbow[0] + FORE_LENGTH * Math.cos(f), elbow[1] + FORE_LENGTH * Math.sin(f)]
  return {
    upper: round(upper),
    fore: round(fore),
    hand: round(hand),
    elbow: elbow.map(round),
    handAt: handAt.map(round),
  }
}

export const WAVE_PEAK = wavePose(WAVE_FORE_DIRECTION)
const OUT = wavePose(WAVE_FORE_DIRECTION + WAVE_SWING)
const IN = wavePose(WAVE_FORE_DIRECTION - WAVE_SWING)

// Urutan lambaian: naik ke puncak (0,3 s), dua kali ayunan luar-dalam
// (0,8 s), kembali ke puncak, lalu turun bertumpu di meja (0,35 s).
export const WAVE_S = 1.45
const AT = [0, 0.3, 0.4, 0.6, 0.8, 1.0, 1.1, 1.45]
export const WAVE_TIMES = AT.map((t) => round(t / WAVE_S))
const REST = { upper: 0, fore: 0, hand: 0 }
const FRAMES = [REST, WAVE_PEAK, OUT, IN, OUT, IN, WAVE_PEAK, REST]
export const WAVE_KEYFRAMES = {
  upper: FRAMES.map((f) => f.upper),
  fore: FRAMES.map((f) => f.fore),
  hand: FRAMES.map((f) => f.hand),
}
