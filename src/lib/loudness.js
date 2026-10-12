// Ukuran kekerasan bunyi (ITU-R BS.1770): LUFS dengan filter K-weighting,
// RMS, dan puncak sampel. Dipakai halaman uji /?sfx dan skrip pengukuran.
//
// Bunyi efek di game pendek (banyak yang di bawah 400 ms, lebih pendek dari
// satu blok pengukuran BS.1770), jadi kekerasannya diukur tanpa gating
// sepanjang seluruh bunyi (`lufs`). Untuk bunyi minimal 400 ms juga dihitung
// LUFS terintegrasi dengan gating (`integratedLufs`), sebagai pembanding.

const LOG10 = Math.log(10)
const toDb = (value) => (value > 0 ? (20 * Math.log(value)) / LOG10 : -Infinity)
const powerToLufs = (power) => (power > 0 ? -0.691 + (10 * Math.log(power)) / LOG10 : -Infinity)

// Koefisien dua tahap K-weighting (high shelf lalu high pass) untuk sample
// rate apa pun, diturunkan dari parameter analog BS.1770.
export function kWeightingCoefficients(sampleRate) {
  const shelf = (() => {
    const f0 = 1681.974450955533
    const gain = 3.999843853973347
    const q = 0.7071752369554196
    const k = Math.tan((Math.PI * f0) / sampleRate)
    const vh = 10 ** (gain / 20)
    const vb = vh ** 0.4996667741545416
    const a0 = 1 + k / q + k * k
    return {
      b: [(vh + (vb * k) / q + k * k) / a0, (2 * (k * k - vh)) / a0, (vh - (vb * k) / q + k * k) / a0],
      a: [(2 * (k * k - 1)) / a0, (1 - k / q + k * k) / a0],
    }
  })()
  const highPass = (() => {
    const f0 = 38.13547087602444
    const q = 0.5003270373238773
    const k = Math.tan((Math.PI * f0) / sampleRate)
    const a0 = 1 + k / q + k * k
    return { b: [1, -2, 1], a: [(2 * (k * k - 1)) / a0, (1 - k / q + k * k) / a0] }
  })()
  return [shelf, highPass]
}

function biquad(input, { b, a }) {
  const output = new Float64Array(input.length)
  let x1 = 0
  let x2 = 0
  let y1 = 0
  let y2 = 0
  for (let i = 0; i < input.length; i += 1) {
    const x = input[i]
    const y = b[0] * x + b[1] * x1 + b[2] * x2 - a[0] * y1 - a[1] * y2
    x2 = x1
    x1 = x
    y2 = y1
    y1 = y
    output[i] = y
  }
  return output
}

export function kWeight(samples, sampleRate) {
  return kWeightingCoefficients(sampleRate).reduce((signal, stage) => biquad(signal, stage), samples)
}

const meanSquare = (values, start = 0, end = values.length) => {
  let sum = 0
  for (let i = start; i < end; i += 1) sum += values[i] * values[i]
  return end > start ? sum / (end - start) : 0
}

// LUFS terintegrasi dengan gating (blok 400 ms, tumpang 75%, gerbang mutlak
// -70 LUFS, gerbang relatif -10 LU). null kalau bunyi lebih pendek dari satu blok.
function gatedLoudness(weighted, sampleRate) {
  const block = Math.round(sampleRate * 0.4)
  const step = Math.round(sampleRate * 0.1)
  if (weighted.length < block) return null
  const powers = []
  for (let start = 0; start + block <= weighted.length; start += step) powers.push(meanSquare(weighted, start, start + block))
  const loud = powers.filter((power) => powerToLufs(power) > -70)
  if (loud.length === 0) return -Infinity
  const relative = powerToLufs(loud.reduce((sum, power) => sum + power, 0) / loud.length) - 10
  const kept = loud.filter((power) => powerToLufs(power) > relative)
  return powerToLufs(kept.reduce((sum, power) => sum + power, 0) / kept.length)
}

// samples: Float32Array atau larik angka (mono, -1..1).
export function measureLoudness(samples, sampleRate) {
  const weighted = kWeight(samples, sampleRate)
  let peak = 0
  for (let i = 0; i < samples.length; i += 1) peak = Math.max(peak, Math.abs(samples[i]))
  const round = (value) => (Number.isFinite(value) ? Math.round(value * 10) / 10 : value)
  const integrated = gatedLoudness(weighted, sampleRate)
  return {
    lufs: round(powerToLufs(meanSquare(weighted))),
    integratedLufs: integrated === null ? null : round(integrated),
    rmsDb: round(toDb(Math.sqrt(meanSquare(samples)))),
    peakDb: round(toDb(peak)),
    seconds: Math.round((samples.length / sampleRate) * 1000) / 1000,
  }
}

// Gabungkan semua kanal AudioBuffer menjadi mono.
export function bufferToMono(buffer) {
  const mono = new Float32Array(buffer.length)
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel)
    for (let i = 0; i < data.length; i += 1) mono[i] += data[i] / buffer.numberOfChannels
  }
  return mono
}

export function gainToDb(gain) {
  return Math.round(toDb(gain) * 10) / 10
}
