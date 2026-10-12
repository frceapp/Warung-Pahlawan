// Bunyi menang buatan sendiri (Web Audio): jawaban benar dan fanfare layar
// hasil. Semua nada dari tangga nada C mayor, melodinya naik (do-mi-sol-do
// tinggi), tempo cepat, dan berakhir di akor do mayor supaya tidak
// menggantung. Tiap nada: { note, start, duration, voice, volume }, ditambah
// chord: true untuk akor penutup (dipetik naik berjarak 20 ms) dan hold
// (detik nada ditahan sebelum meluruh).
//   voice 'bright': segitiga dengan nada oktaf di atasnya (cerah)
//   voice 'warm':   sinus dengan sedikit segitiga (hangat, lembut)
//   voice 'chime':  dentingan tinggi, cepat meluruh
// Kekerasan tiap bunyi disamakan (sekitar -20 LUFS) lewat SYNTH_NORMALIZE di
// sfx.js, lalu diatur lagi lewat sfxGain.js; diukur di halaman /?sfx.

const NOTE_INDEX = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

// "C5" -> nomor MIDI (C4 = 60).
export function midiOf(note) {
  const match = /^([A-G])(\d)$/.exec(note)
  if (!match) throw new Error(`Unknown note: ${note}`)
  return 12 * (Number(match[2]) + 1) + NOTE_INDEX[match[1]]
}

export function frequencyOf(note) {
  return 440 * 2 ** ((midiOf(note) - 69) / 12)
}

const arpeggio = (notes, step, length, voice, volume, offset = 0) =>
  notes.map((note, index) => ({ note, start: offset + index * step, duration: length, voice, volume }))

const STRUM = 0.02
const chord = (notes, start, duration, voice, volume, hold) =>
  notes.map((note, index) => ({ note, start: start + index * STRUM, duration, voice, volume, chord: true, hold }))

// Jawaban benar: do-mi-sol-do tinggi, cepat (sekitar 0,5 detik).
export const CORRECT_TUNE = [
  ...arpeggio(['C5', 'E5', 'G5'], 0.07, 0.1, 'bright', 0.3),
  { note: 'C6', start: 0.21, duration: 0.28, voice: 'bright', volume: 0.32 },
]

// Fanfare layar hasil, 1 sampai 1,5 detik. 3 bintang: arpeggio cerah, akor,
// lalu lapisan dentingan naik. 2 bintang: arpeggio dan akor. 1 bintang:
// sedikit lebih pelan dan hangat, tetap naik dan berakhir di akor mayor.
export const FANFARE_TUNES = {
  3: [
    ...arpeggio(['C5', 'E5', 'G5', 'C6'], 0.1, 0.14, 'bright', 0.24),
    ...chord(['C5', 'E5', 'G5', 'C6'], 0.42, 0.85, 'bright', 0.13, 0.35),
    ...arpeggio(['C7', 'E7', 'G7', 'C8'], 0.1, 0.32, 'chime', 0.08, 0.48),
  ],
  2: [
    ...arpeggio(['C5', 'E5', 'G5', 'C6'], 0.11, 0.15, 'bright', 0.24),
    ...chord(['C5', 'E5', 'G5'], 0.46, 0.72, 'bright', 0.15, 0.32),
  ],
  1: [
    ...arpeggio(['G4', 'C5', 'E5', 'G5'], 0.13, 0.2, 'warm', 0.3),
    ...chord(['C4', 'E4', 'G4', 'C5'], 0.55, 0.5, 'warm', 0.2, 0.22),
  ],
}

export function fanfareTune(stars) {
  return FANFARE_TUNES[Math.min(3, Math.max(1, Math.round(stars ?? 1)))]
}

// Panjang bunyi dalam detik.
export function tuneLength(tune) {
  return Math.max(...tune.map((tone) => tone.start + tone.duration))
}
