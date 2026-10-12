// Efek suara: rekaman pendek berlisensi CC0 (public/sfx/, lihat sfxFiles.js)
// dan bunyi menang buatan sendiri (sfxTunes.js), semuanya diputar lewat Web
// Audio API supaya tidak ada jeda. Bunyi hanya pelengkap: setiap bunyi selalu
// punya umpan balik yang terlihat di layar. Volume tiap bunyi diatur di
// sfxGain.js; semua bunyi sudah disamakan kekerasannya (sekitar -20 LUFS).
//
// Aturan autoplay (iOS, Chrome): AudioContext baru dibuat setelah sentuhan
// atau tombol keyboard pertama (lihat installAudioUnlock), lalu resume()
// kalau masih tertunda. Berkas suara juga baru dimuat saat itu, bukan saat
// halaman dibuka. Selama berkas belum siap, atau kalau gagal dimuat, bunyi
// sintetis (OscillatorNode) dipakai sebagai cadangan. Saat tab tersembunyi,
// bunyi berhenti dan tidak ada bunyi baru yang diputar.

import { gainFor, LEVEL, MASTER_GAIN, sampleTrim } from './sfxGain.js'
import { SFX_FILES } from './sfxFiles.js'
import { CORRECT_TUNE, fanfareTune, frequencyOf } from './sfxTunes.js'

export const SOUND_STORAGE_KEY = 'warungPahlawanSuara'
// Bunyi cadangan Web Audio paling panjang (detik).
export const MAX_FALLBACK_S = 0.4

let context = null
let output = null
let bus = null
let soundOn = null
// id bunyi -> AudioBuffer; status pemuatan tiap berkas: 'loading', 'ready',
// atau 'failed'.
const buffers = new Map()
const loadStatus = new Map()
let loadStarted = false
const listeners = new Set()

function storage() {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

function isHidden() {
  return Boolean(globalThis.document?.hidden)
}

// --- Pengaturan suara (tombol Suara) ----------------------------------------

export function isSoundOn() {
  if (soundOn === null) {
    try {
      soundOn = storage()?.getItem(SOUND_STORAGE_KEY) !== 'off'
    } catch {
      soundOn = true
    }
  }
  return soundOn
}

export function setSoundOn(on) {
  soundOn = Boolean(on)
  try {
    storage()?.setItem(SOUND_STORAGE_KEY, soundOn ? 'on' : 'off')
  } catch {
    // Penyimpanan tidak tersedia; pilihan tetap berlaku sampai halaman ditutup.
  }
  if (soundOn) unlockAudio()
  else context?.suspend?.()
  listeners.forEach((listener) => listener())
}

// Untuk useSyncExternalStore di tombol Suara.
export function subscribeSound(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// --- AudioContext -------------------------------------------------------------

// Dipanggil dari sentuhan atau tombol keyboard anak (gesture), supaya browser
// mengizinkan bunyi. Rantai bunyi: tiap bunyi -> gain bunyi itu (sfxGain.js)
// -> LEVEL -> MASTER_GAIN -> speaker.
export function unlockAudio() {
  if (!isSoundOn() || isHidden()) return null
  if (!context) {
    const AudioContextClass = globalThis.AudioContext ?? globalThis.webkitAudioContext
    if (!AudioContextClass) return null
    context = new AudioContextClass()
    output = context.createGain()
    output.gain.value = MASTER_GAIN
    output.connect(context.destination)
    bus = context.createGain()
    bus.gain.value = LEVEL
    bus.connect(output)
  }
  if (context.state === 'suspended') context.resume?.()
  loadSamples()
  return context
}

// --- Berkas suara ---------------------------------------------------------------

function sfxUrl(file) {
  const base = import.meta.env?.BASE_URL ?? '/'
  return `${base}sfx/${file}`
}

// decodeAudioData versi lama (Safari) hanya memakai callback.
function decode(audio, data) {
  return new Promise((resolve, reject) => {
    const result = audio.decodeAudioData(data, resolve, reject)
    result?.then?.(resolve, reject)
  })
}

async function loadOne(audio, { id, file }) {
  loadStatus.set(id, 'loading')
  try {
    const response = await globalThis.fetch(sfxUrl(file))
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    buffers.set(id, await decode(audio, await response.arrayBuffer()))
    loadStatus.set(id, 'ready')
  } catch {
    loadStatus.set(id, 'failed')
  }
}

// Dimuat sekali, setelah AudioContext dibuat (sentuhan pertama). Mengembalikan
// janji yang selesai setelah semua berkas siap atau gagal.
let loading = null
export function loadSamples() {
  if (loadStarted || !context || typeof globalThis.fetch !== 'function') return loading
  loadStarted = true
  loading = Promise.all(SFX_FILES.map((entry) => loadOne(context, entry)))
  return loading
}

// Status pemuatan untuk halaman uji /?sfx: 'idle', 'loading', 'ready', 'failed'.
export function sampleStatus(id) {
  return loadStatus.get(id) ?? 'idle'
}

// Rekaman yang sudah di-decode (untuk mengukur kekerasannya di /?sfx).
export function sampleBuffer(id) {
  return buffers.get(id) ?? null
}

function gainNode(audio, value) {
  const gain = audio.createGain()
  gain.gain.value = value
  gain.connect(bus)
  return gain
}

// Putar rekaman. Mengembalikan false kalau rekaman belum siap atau gagal
// dimuat (pemanggil lalu memakai bunyi cadangan).
function playSample(id, { when = 0, rate = 1 } = {}) {
  const audio = ready()
  const buffer = buffers.get(id)
  if (!audio || !buffer || !bus) return false
  const source = audio.createBufferSource()
  source.buffer = buffer
  source.playbackRate.value = rate
  source.connect(gainNode(audio, gainFor(id) * sampleTrim(id)))
  source.start(audio.currentTime + when)
  return true
}

let unlockInstalled = false

// Pasang sekali di main.jsx: sentuhan atau tombol pertama membuat AudioContext.
// Juga menghentikan bunyi saat tab tersembunyi.
export function installAudioUnlock() {
  if (unlockInstalled || !globalThis.document) return
  unlockInstalled = true
  const unlock = () => unlockAudio()
  for (const type of ['pointerdown', 'touchstart', 'keydown']) {
    globalThis.document.addEventListener(type, unlock, { capture: true, passive: true })
  }
  globalThis.document.addEventListener('visibilitychange', () => {
    if (isHidden()) context?.suspend?.()
    else if (isSoundOn()) context?.resume?.()
  })
}

function ready() {
  if (!isSoundOn() || isHidden() || !context || !bus) return null
  if (context.state === 'suspended') context.resume?.()
  return context
}

// Satu nada: frekuensi bisa meluncur dari `from` ke `to`, dengan selubung
// volume (naik cepat, turun eksponensial) supaya tidak berbunyi "klik".
function scheduleTone(audio, destination, { from, to = from, start = 0, duration, type = 'sine', volume = 0.5, attack = 0.012, hold = 0 }, when = 0) {
  const startAt = audio.currentTime + when + start
  const end = startAt + duration
  const oscillator = audio.createOscillator()
  const gain = audio.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(from, startAt)
  if (to !== from) oscillator.frequency.exponentialRampToValueAtTime(to, end)
  gain.gain.setValueAtTime(0.0001, startAt)
  const peakAt = startAt + Math.min(attack, duration / 4)
  gain.gain.exponentialRampToValueAtTime(volume, peakAt)
  // hold: nada ditahan sebentar (akor penutup) sebelum meluruh.
  if (hold > 0) gain.gain.setValueAtTime(volume, Math.min(peakAt + hold, end - 0.05))
  gain.gain.exponentialRampToValueAtTime(0.0001, end)
  oscillator.connect(gain)
  gain.connect(destination)
  oscillator.start(startAt)
  oscillator.stop(end + 0.01)
}

// --- Bunyi --------------------------------------------------------------------

// Bunyi cadangan untuk tiap rekaman (dipakai selama berkas belum siap atau
// kalau gagal dimuat). Bentuknya sama dengan sebelumnya; kekerasannya
// disamakan lewat SYNTH_NORMALIZE.
export const FALLBACK = {
  doorRoll: [
    { from: 90, to: 140, duration: 0.36, type: 'triangle', volume: 0.35 },
    { from: 180, to: 260, start: 0.02, duration: 0.34, type: 'sine', volume: 0.2 },
  ],
  doorBell: [
    { from: 1318.5, start: 0, duration: 0.17, type: 'triangle', volume: 0.45 },
    { from: 1046.5, start: 0.14, duration: 0.22, type: 'triangle', volume: 0.45 },
  ],
  step: [{ from: 150, to: 90, duration: 0.06, type: 'sine', volume: 0.25 }],
  fruitIn: [{ from: 420, to: 900, duration: 0.08, type: 'sine', volume: 0.5 }],
  fruitOut: [{ from: 900, to: 420, duration: 0.08, type: 'sine', volume: 0.4 }],
  wrap: [
    { from: 2400, to: 1800, duration: 0.06, type: 'triangle', volume: 0.12 },
    { from: 2000, to: 1500, start: 0.08, duration: 0.08, type: 'triangle', volume: 0.12 },
  ],
  registerKeys: [0, 0.12, 0.24, 0.36].map((start) => ({ from: 1500, to: 1300, start, duration: 0.03, type: 'square', volume: 0.08 })),
  drawer: [
    { from: 1568, start: 0, duration: 0.12, type: 'triangle', volume: 0.35 },
    { from: 2093, start: 0.1, duration: 0.25, type: 'triangle', volume: 0.35 },
  ],
  note: [{ from: 1800, to: 1200, duration: 0.07, type: 'triangle', volume: 0.15 }],
  coin: [
    { from: 1568, start: 0, duration: 0.12, type: 'triangle', volume: 0.3 },
    { from: 2093, start: 0.09, duration: 0.16, type: 'triangle', volume: 0.3 },
  ],
  wrong: [{ from: 392, to: 294, duration: 0.3, type: 'sine', volume: 0.35 }],
  click: [{ from: 1600, to: 1200, duration: 0.03, type: 'triangle', volume: 0.18 }],
}

// Warna suara bunyi menang (sfxTunes.js): tiap nada dimainkan beberapa
// osilator (kelipatan frekuensi dan campurannya).
const VOICES = {
  bright: { attack: 0.006, partials: [{ type: 'triangle', ratio: 1, mix: 1 }, { type: 'sine', ratio: 2, mix: 0.35 }] },
  warm: { attack: 0.02, partials: [{ type: 'sine', ratio: 1, mix: 1 }, { type: 'triangle', ratio: 1, mix: 0.3 }] },
  chime: { attack: 0.003, partials: [{ type: 'sine', ratio: 1, mix: 1 }, { type: 'sine', ratio: 2, mix: 0.25 }] },
}

function tuneTones(tune) {
  return tune.flatMap(({ note, start, duration, voice, volume, hold = 0 }) => {
    const { attack, partials } = VOICES[voice]
    return partials.map(({ type, ratio, mix }) => ({
      from: frequencyOf(note) * ratio,
      start,
      duration,
      type,
      volume: volume * mix,
      attack,
      hold,
    }))
  })
}

// Bunyi Web Audio per kunci: cadangan rekaman, jawaban benar, dan fanfare
// untuk 1, 2, dan 3 bintang.
export function synthTones(key) {
  if (key === 'correct') return tuneTones(CORRECT_TUNE)
  const fanfare = /^fanfare([123])$/.exec(key)
  if (fanfare) return tuneTones(fanfareTune(Number(fanfare[1])))
  return FALLBACK[key] ?? []
}

// Penyama kekerasan bunyi Web Audio: tiap bunyi dikali faktor ini supaya
// terdengar sekitar -20 LUFS dengan puncak paling tinggi -3 dB, sama dengan
// rekaman. Diukur dengan OfflineAudioContext (angkanya tampil di /?sfx).
export const SYNTH_NORMALIZE = {
  doorRoll: 2.07,
  doorBell: 1.46,
  step: 2.85,
  fruitIn: 1.41,
  fruitOut: 1.68,
  wrap: 4.68,
  registerKeys: 8.41,
  drawer: 1.55,
  note: 4.07,
  coin: 1.78,
  wrong: 1.82,
  click: 4.12,
  correct: 1.84,
  fanfare1: 0.63,
  fanfare2: 1.12,
  fanfare3: 0.99,
}

// Putar bunyi Web Audio untuk bunyi `id` (gain dari sfxGain.js).
function playSynth(id, key, { when = 0 } = {}) {
  const audio = ready()
  if (!audio) return false
  const tones = synthTones(key)
  if (tones.length === 0) return false
  const gain = gainNode(audio, gainFor(id) * (SYNTH_NORMALIZE[key] ?? 1))
  tones.forEach((tone) => scheduleTone(audio, gain, tone, when))
  return true
}

// Kunci bunyi cadangan Web Audio untuk rekaman `id`.
export const fallbackKey = (id) => (id === 'step1' || id === 'step2' ? 'step' : id)

// Rekaman kalau sudah siap, kalau belum bunyi cadangannya.
function sound(id, options = {}) {
  if (!ready()) return false
  return playSample(id, options) || playSynth(id, fallbackKey(id), options)
}

// Render bunyi Web Audio tanpa memutarnya (untuk mengukur kekerasannya di
// /?sfx), pada level normal (sebelum gain per bunyi).
export function renderSynth(key, sampleRate = 44100) {
  const OfflineContext = globalThis.OfflineAudioContext ?? globalThis.webkitOfflineAudioContext
  const tones = synthTones(key)
  if (!OfflineContext || tones.length === 0) return Promise.resolve(null)
  const seconds = Math.max(...tones.map((tone) => (tone.start ?? 0) + tone.duration)) + 0.02
  const offline = new OfflineContext(1, Math.ceil(sampleRate * seconds), sampleRate)
  const gain = offline.createGain()
  gain.gain.value = SYNTH_NORMALIZE[key] ?? 1
  gain.connect(offline.destination)
  tones.forEach((tone) => scheduleTone(offline, gain, tone))
  return offline.startRendering()
}

// Pintu gulung naik saat warung (atau layar hasil) dibuka.
export function playDoorRoll() {
  return sound('doorRoll')
}

// Lonceng pintu saat pembeli masuk.
export function playCustomerBell() {
  return sound('doorBell')
}

// Langkah kaki pada waktu-waktu (detik dari sekarang) saat kaki menapak,
// bergantian dua rekaman.
export function playFootsteps(times) {
  if (!ready()) return false
  times.forEach((when, index) => {
    sound(index % 2 === 0 ? 'step1' : 'step2', { when })
  })
  return times.length > 0
}

// Buah masuk kantong, dan buah dikeluarkan lagi.
export function playFruitIn() {
  return sound('fruitIn')
}

export function playFruitOut() {
  return sound('fruitOut')
}

// Pesanan dibungkus.
export function playWrap() {
  return sound('wrap')
}

// Tombol mesin kasir ditekan bergantian (selaras dengan kedip tombolnya).
export function playRegisterKeys(when = 0) {
  return sound('registerKeys', { when })
}

// Laci mesin kasir terbuka ("ka-ching").
export function playDrawer(when = 0) {
  return sound('drawer', { when })
}

// Uang ke nampan kembalian: uang kertas atau koin (di bawah Rp1.000).
export function playMoney(value) {
  return value < 1000 ? sound('coin') : sound('note')
}

// Tombol ditekan: klik halus.
export function playClick() {
  return sound('click')
}

// Jawaban benar: do-mi-sol-do naik, buatan sendiri (sfxTunes.js).
export function playCorrect() {
  return playSynth('correct', 'correct')
}

// Jawaban salah: lembut, bukan buzzer.
export function playWrong() {
  return sound('wrong')
}

// Hasil akhir: fanfare buatan sendiri. 3 bintang dengan lapisan dentingan;
// 1 bintang tetap hangat dan menyemangati.
export function playFanfare(stars) {
  const count = Math.min(3, Math.max(1, Math.round(stars ?? 1)))
  return playSynth('fanfare', `fanfare${count}`)
}

// --- Halaman uji /?sfx -------------------------------------------------------

// Putar satu bunyi menurut id di sfxFiles.js (atau 'correct', 'fanfare');
// dengan fallback: true, putar bunyi cadangannya. Langkah kaki diputar
// sebagai satu kali berjalan masuk (enam tapak).
const PREVIEW_STEPS = [0, 0.18, 0.37, 0.55, 0.76, 1]

export function previewSound(id, { fallback = false, stars = 3 } = {}) {
  if (!ready()) return false
  if (id === 'correct') return playCorrect()
  if (id === 'fanfare') return playFanfare(stars)
  const once = (when) => (fallback ? playSynth(id, fallbackKey(id), { when }) : sound(id, { when }))
  if (id === 'step1' || id === 'step2') {
    PREVIEW_STEPS.forEach(once)
    return true
  }
  return once(0)
}
