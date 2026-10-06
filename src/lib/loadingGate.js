// Menunggu pemuatan sebuah layar dengan batas waktu bawah dan atas.
// - Hasil 'ready' paling cepat setelah minMs, supaya layar loading tidak
//   berkedip saat koneksi cepat.
// - Hasil 'timeout' kalau pemuatan belum selesai setelah timeoutMs.
// - Hasil 'error' kalau pemuatan gagal (setelah minMs juga).
// `wait(ms)` dikirim lewat parameter supaya bisa dites tanpa jam sungguhan.
export function waitForReady(task, { minMs, timeoutMs, wait }) {
  const outcome = Promise.resolve(task).then(
    () => 'ready',
    () => 'error',
  )
  const settled = Promise.all([outcome, wait(minMs)]).then(([result]) => result)
  const timedOut = wait(timeoutMs).then(() => 'timeout')
  return Promise.race([settled, timedOut])
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
