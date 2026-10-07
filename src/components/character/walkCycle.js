// Irama berjalan pembeli (dipakai AnimeCharacter untuk gerak dan untuk bunyi
// langkah kaki). Badan turun (nilai bob positif, ke bawah) saat kaki
// menapak, jadi bunyi langkah diputar tepat pada titik-titik itu.

export const WALK_S = 1.2
export const STEP_S = 0.4

// Tiga langkah dalam 1,2 s; langkah terakhir lebih lambat dan kecil.
export const WALK_TIMES = [0, 0.075, 0.15, 0.225, 0.3, 0.38, 0.458, 0.537, 0.617, 0.71, 0.808, 0.905, 1]
// Badan turun saat kaki terbuka, naik saat kaki berpapasan.
export const WALK_BOB = [0, 1.5, -2, 1.5, -2, 1.5, -2, 1.5, -2, 1.5, -2, 1, 0]

// Satu langkah 0,4 s untuk berjalan keluar (diulang).
export const STEP_TIMES = [0, 0.25, 0.5, 0.75, 1]
export const LEAVE_BOB = [0, 1.5, -2, 1.5, 0]
export const LEAVE_STEPS = 2

// Waktu (detik dari awal gerak) saat kaki menapak: titik-titik dengan bob
// positif, untuk satu putaran sepanjang `duration`, diulang `repeat` kali.
export function footstepTimes(times, bob, duration, repeat = 1) {
  const one = times.filter((_, index) => bob[index] > 0).map((t) => t * duration)
  const all = []
  for (let n = 0; n < repeat; n += 1) one.forEach((t) => all.push(Math.round((n * duration + t) * 1000) / 1000))
  return all
}

export const WALK_IN_STEPS = footstepTimes(WALK_TIMES, WALK_BOB, WALK_S)
export const WALK_OUT_STEPS = footstepTimes(STEP_TIMES, LEAVE_BOB, STEP_S, LEAVE_STEPS)
