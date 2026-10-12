// Pengaturan volume efek suara di satu tempat. Semua rekaman (public/sfx/)
// dan bunyi Web Audio sudah disamakan kekerasannya: sekitar -20 LUFS dengan
// puncak paling tinggi -3 dB. Angka di bawah hanya mengatur keseimbangan
// antarbunyi, tanpa perlu mengolah ulang berkas.
//
// Rantai bunyi: sumber -> SFX_GAIN[id] -> LEVEL -> MASTER_GAIN -> speaker.

// Volume utama: 0,7 dari volume sebelumnya.
export const MASTER_GAIN = 0.7

// Level bersama semua bunyi (sama dengan level rekaman sebelumnya).
export const LEVEL = 0.7

// Gain tiap bunyi (1 = kekerasan normal). Id sama dengan sfxFiles.js, ditambah
// bunyi buatan sendiri: correct (jawaban benar) dan fanfare.
export const SFX_GAIN = {
  // Pintu gulung: 40 sampai 50% dari bunyi lain, dan tidak lebih keras dari
  // lonceng pintu.
  doorRoll: 0.45,
  doorBell: 0.9,
  // Bunyi yang sering atau berulang dibuat lebih pelan.
  step1: 0.4,
  step2: 0.4,
  fruitIn: 0.8,
  fruitOut: 0.65,
  wrap: 0.75,
  registerKeys: 0.45,
  drawer: 0.75,
  note: 0.7,
  coin: 0.7,
  click: 0.4,
  // Umpan balik jawaban dan hasil.
  correct: 1,
  wrong: 0.85,
  fanfare: 1,
}

// Dua rekaman berpuncak sangat tajam (klik tombol kasir, gesekan uang kertas)
// hanya sampai sekitar -25,5 LUFS walau sudah diredam limiter 16 dB; meredam
// lebih jauh merusak bunyinya. Selisihnya ke -20 LUFS diimbangi di sini (dB),
// hanya untuk rekamannya (bunyi cadangannya sudah -20 LUFS).
export const SAMPLE_TRIM_DB = {
  registerKeys: 5.4,
  note: 5.7,
}

export function gainFor(id) {
  return SFX_GAIN[id] ?? 1
}

export function sampleTrim(id) {
  return 10 ** ((SAMPLE_TRIM_DB[id] ?? 0) / 20)
}

// Gain total satu bunyi sampai ke speaker (rekaman atau bunyi Web Audio).
export function playbackGain(id, { sample = true } = {}) {
  return gainFor(id) * (sample ? sampleTrim(id) : 1) * LEVEL * MASTER_GAIN
}
