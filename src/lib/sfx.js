// Efek suara sederhana dengan Web Audio API (OscillatorNode dan GainNode),
// tanpa berkas audio dan tanpa library. Semua bunyi pendek (di bawah 400 ms)
// dan pelan. Bunyi hanya pelengkap: setiap bunyi selalu punya umpan balik
// yang terlihat di layar.
//
// Aturan autoplay (iOS, Chrome): AudioContext baru dibuat setelah sentuhan
// atau tombol keyboard pertama (lihat installAudioUnlock), lalu resume()
// kalau masih tertunda. Saat tab tersembunyi, bunyi berhenti dan tidak ada
// bunyi baru yang diputar.

export const SOUND_STORAGE_KEY = 'warungPahlawanSuara'
// Volume keseluruhan dan batas panjang tiap bunyi (detik).
export const MASTER_VOLUME = 0.2
export const MAX_SOUND_S = 0.4

let context = null
let master = null
let soundOn = null
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
  }
  if (context.state === 'suspended') context.resume?.()
  return context
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

function play(notes) {
  const audio = ready()
  if (!audio) return false
  notes.forEach((note) => tone(audio, note))
  return true
}

// --- Bunyi --------------------------------------------------------------------

// Pembeli datang: lonceng warung dua nada (ting-tung).
export function playCustomerBell() {
  return play([
    { from: 1318.5, start: 0, duration: 0.17, type: 'triangle', volume: 0.45 },
    { from: 1046.5, start: 0.14, duration: 0.22, type: 'triangle', volume: 0.45 },
  ])
}

// Buah masuk kantong: "pop" pendek.
export function playPop() {
  return play([{ from: 420, to: 900, duration: 0.08, type: 'sine', volume: 0.5 }])
}

// Tombol ditekan: klik halus.
export function playClick() {
  return play([{ from: 1600, to: 1200, duration: 0.03, type: 'triangle', volume: 0.18 }])
}

// Jawaban benar: nada naik ceria (do-mi-sol).
export function playCorrect() {
  return play([
    { from: 523.3, start: 0, duration: 0.11, type: 'triangle', volume: 0.4 },
    { from: 659.3, start: 0.09, duration: 0.11, type: 'triangle', volume: 0.4 },
    { from: 784, start: 0.18, duration: 0.18, type: 'triangle', volume: 0.45 },
  ])
}

// Jawaban salah: nada turun yang lembut, bukan buzzer.
export function playWrong() {
  return play([{ from: 392, to: 294, duration: 0.3, type: 'sine', volume: 0.35 }])
}

// Uang diberikan: dua dentingan koin.
export function playCoins() {
  return play([
    { from: 1568, start: 0, duration: 0.12, type: 'triangle', volume: 0.3 },
    { from: 2093, start: 0.09, duration: 0.16, type: 'triangle', volume: 0.3 },
  ])
}

// Hasil akhir: fanfare pendek, lebih meriah untuk 3 bintang.
export function playFanfare(stars) {
  if (stars >= 3) {
    return play([
      { from: 523.3, start: 0, duration: 0.09, type: 'square', volume: 0.18 },
      { from: 659.3, start: 0.08, duration: 0.09, type: 'square', volume: 0.18 },
      { from: 784, start: 0.16, duration: 0.09, type: 'square', volume: 0.18 },
      { from: 1046.5, start: 0.24, duration: 0.13, type: 'square', volume: 0.2 },
      { from: 784, start: 0.24, duration: 0.13, type: 'triangle', volume: 0.3 },
    ])
  }
  if (stars === 2) {
    return play([
      { from: 523.3, start: 0, duration: 0.1, type: 'triangle', volume: 0.35 },
      { from: 659.3, start: 0.09, duration: 0.1, type: 'triangle', volume: 0.35 },
      { from: 784, start: 0.18, duration: 0.18, type: 'triangle', volume: 0.35 },
    ])
  }
  return play([
    { from: 523.3, start: 0, duration: 0.12, type: 'triangle', volume: 0.35 },
    { from: 784, start: 0.11, duration: 0.2, type: 'triangle', volume: 0.35 },
  ])
}
