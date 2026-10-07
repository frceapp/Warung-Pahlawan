// Efek suara: rekaman pendek berlisensi CC0 (public/sfx/, lihat sfxFiles.js)
// yang diputar lewat Web Audio API (AudioBufferSourceNode), supaya tidak ada
// jeda. Bunyi hanya pelengkap: setiap bunyi selalu punya umpan balik yang
// terlihat di layar.
//
// Aturan autoplay (iOS, Chrome): AudioContext baru dibuat setelah sentuhan
// atau tombol keyboard pertama (lihat installAudioUnlock), lalu resume()
// kalau masih tertunda. Berkas suara juga baru dimuat saat itu, bukan saat
// halaman dibuka. Selama berkas belum siap, atau kalau gagal dimuat, bunyi
// sintetis lama (OscillatorNode) dipakai sebagai cadangan. Saat tab
// tersembunyi, bunyi berhenti dan tidak ada bunyi baru yang diputar.

import { SFX_FILES } from './sfxFiles.js'

export const SOUND_STORAGE_KEY = 'warungPahlawanSuara'
// Volume bunyi sintetis cadangan dan batas panjangnya (detik), lalu volume
// rekaman (semua berkas sudah disamakan kekerasannya).
export const MASTER_VOLUME = 0.2
export const MAX_SOUND_S = 0.4
export const SAMPLE_VOLUME = 0.7

let context = null
let master = null
let sampleBus = null
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
// mengizinkan bunyi.
export function unlockAudio() {
  if (!isSoundOn() || isHidden()) return null
  if (!context) {
    const AudioContextClass = globalThis.AudioContext ?? globalThis.webkitAudioContext
    if (!AudioContextClass) return null
    context = new AudioContextClass()
    master = context.createGain()
    master.gain.value = MASTER_VOLUME
    master.connect(context.destination)
    sampleBus = context.createGain()
    sampleBus.gain.value = SAMPLE_VOLUME
    sampleBus.connect(context.destination)
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

// Putar rekaman. Mengembalikan false kalau rekaman belum siap atau gagal
// dimuat (pemanggil lalu memakai bunyi cadangan).
function playSample(id, { when = 0, volume = 1, rate = 1 } = {}) {
  const audio = ready()
  const buffer = buffers.get(id)
  if (!audio || !buffer || !sampleBus) return false
  const source = audio.createBufferSource()
  source.buffer = buffer
  source.playbackRate.value = rate
  const gain = audio.createGain()
  gain.gain.value = volume
  source.connect(gain)
  gain.connect(sampleBus)
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
  if (!isSoundOn() || isHidden() || !context || !master) return null
  if (context.state === 'suspended') context.resume?.()
  return context
}

// Satu nada: frekuensi bisa meluncur dari `from` ke `to`, dengan selubung
// volume (naik cepat, turun eksponensial) supaya tidak berbunyi "klik".
function tone(audio, { from, to = from, start = 0, duration, type = 'sine', volume = 0.5 }) {
  const startAt = audio.currentTime + start
  const end = startAt + duration
  const oscillator = audio.createOscillator()
  const gain = audio.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(from, startAt)
  if (to !== from) oscillator.frequency.exponentialRampToValueAtTime(to, end)
  gain.gain.setValueAtTime(0.0001, startAt)
  gain.gain.exponentialRampToValueAtTime(volume, startAt + Math.min(0.012, duration / 4))
  gain.gain.exponentialRampToValueAtTime(0.0001, end)
  oscillator.connect(gain)
  gain.connect(master)
  oscillator.start(startAt)
  oscillator.stop(end + 0.01)
}

function play(notes, when = 0) {
  const audio = ready()
  if (!audio) return false
  notes.forEach((note) => tone(audio, { ...note, start: (note.start ?? 0) + when }))
  return true
}

// Rekaman kalau sudah siap, kalau belum bunyi sintetis cadangan.
function sound(id, fallback, options = {}) {
  if (!ready()) return false
  return playSample(id, options) || play(fallback, options.when ?? 0)
}

// --- Bunyi --------------------------------------------------------------------
// Tiap bunyi: rekaman (id di sfxFiles.js) dan nada sintetis cadangannya.

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
  correct: [
    { from: 523.3, start: 0, duration: 0.11, type: 'triangle', volume: 0.4 },
    { from: 659.3, start: 0.09, duration: 0.11, type: 'triangle', volume: 0.4 },
    { from: 784, start: 0.18, duration: 0.18, type: 'triangle', volume: 0.45 },
  ],
  wrong: [{ from: 392, to: 294, duration: 0.3, type: 'sine', volume: 0.35 }],
  click: [{ from: 1600, to: 1200, duration: 0.03, type: 'triangle', volume: 0.18 }],
}

const FANFARE = {
  3: [
    { from: 523.3, start: 0, duration: 0.09, type: 'square', volume: 0.18 },
    { from: 659.3, start: 0.08, duration: 0.09, type: 'square', volume: 0.18 },
    { from: 784, start: 0.16, duration: 0.09, type: 'square', volume: 0.18 },
    { from: 1046.5, start: 0.24, duration: 0.13, type: 'square', volume: 0.2 },
    { from: 784, start: 0.24, duration: 0.13, type: 'triangle', volume: 0.3 },
  ],
  2: [
    { from: 523.3, start: 0, duration: 0.1, type: 'triangle', volume: 0.35 },
    { from: 659.3, start: 0.09, duration: 0.1, type: 'triangle', volume: 0.35 },
    { from: 784, start: 0.18, duration: 0.18, type: 'triangle', volume: 0.35 },
  ],
  1: [
    { from: 523.3, start: 0, duration: 0.12, type: 'triangle', volume: 0.35 },
    { from: 784, start: 0.11, duration: 0.2, type: 'triangle', volume: 0.35 },
  ],
}

// Pintu gulung naik saat warung (atau layar hasil) dibuka.
export function playDoorRoll() {
  return sound('doorRoll', FALLBACK.doorRoll)
}

// Lonceng pintu saat pembeli masuk.
export function playCustomerBell() {
  return sound('doorBell', FALLBACK.doorBell)
}

// Langkah kaki pada waktu-waktu (detik dari sekarang) saat kaki menapak,
// bergantian dua rekaman, lebih pelan dari bunyi lain.
export function playFootsteps(times) {
  if (!ready()) return false
  times.forEach((when, index) => {
    sound(index % 2 === 0 ? 'step1' : 'step2', FALLBACK.step, { when, volume: 0.45 })
  })
  return times.length > 0
}

// Buah masuk kantong, dan buah dikeluarkan lagi.
export function playFruitIn() {
  return sound('fruitIn', FALLBACK.fruitIn)
}

export function playFruitOut() {
  return sound('fruitOut', FALLBACK.fruitOut, { volume: 0.8 })
}

// Pesanan dibungkus.
export function playWrap() {
  return sound('wrap', FALLBACK.wrap)
}

// Tombol mesin kasir ditekan bergantian (selaras dengan kedip tombolnya).
export function playRegisterKeys(when = 0) {
  return sound('registerKeys', FALLBACK.registerKeys, { when, volume: 0.6 })
}

// Laci mesin kasir terbuka ("ka-ching").
export function playDrawer(when = 0) {
  return sound('drawer', FALLBACK.drawer, { when })
}

// Uang ke nampan kembalian: uang kertas atau koin (di bawah Rp1.000).
export function playMoney(value) {
  return value < 1000 ? sound('coin', FALLBACK.coin) : sound('note', FALLBACK.note)
}

// Tombol ditekan: klik halus.
export function playClick() {
  return sound('click', FALLBACK.click, { volume: 0.5 })
}

// Jawaban benar.
export function playCorrect() {
  return sound('correct', FALLBACK.correct)
}

// Jawaban salah: lembut, bukan buzzer.
export function playWrong() {
  return sound('wrong', FALLBACK.wrong)
}

// Hasil akhir: fanfare. Cadangan sintetisnya lebih meriah untuk 3 bintang.
export function playFanfare(stars) {
  return sound('fanfare', FANFARE[Math.min(3, Math.max(1, stars ?? 1))])
}

// --- Halaman uji /?sfx -------------------------------------------------------

// Putar satu bunyi menurut id di sfxFiles.js; dengan fallback: true, putar
// bunyi sintetis cadangannya. Langkah kaki diputar sebagai satu kali berjalan
// masuk (enam tapak).
const PREVIEW_STEPS = [0, 0.18, 0.37, 0.55, 0.76, 1]

export function previewSound(id, { fallback = false } = {}) {
  if (!ready()) return false
  if (fallback) {
    if (id === 'fanfare') return play(FANFARE[3])
    if (id === 'step1' || id === 'step2') {
      PREVIEW_STEPS.forEach((when) => play(FALLBACK.step, when))
      return true
    }
    return play(FALLBACK[id] ?? [])
  }
  if (id === 'step1' || id === 'step2') {
    PREVIEW_STEPS.forEach((when) => playSample(id, { when, volume: 0.45 }) || play(FALLBACK.step, when))
    return true
  }
  return playSample(id) || play(id === 'fanfare' ? FANFARE[3] : (FALLBACK[id] ?? []))
}
