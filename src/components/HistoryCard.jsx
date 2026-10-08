import { useState } from 'react'
import { getLevel } from '../data/levels.js'
import { formatPlayedAt, HISTORY_EMPTY_TEXT, summarizeForHome } from '../lib/scoreHistory.js'
import StarRating from './StarRating.jsx'

// Kartu "Riwayat main" di beranda: jumlah permainan, skor tertinggi, dan
// permainan terakhir. Seluruh kartu adalah satu tombol yang membuka halaman
// riwayat; "Lihat riwayat" di dalamnya penanda tombolnya.
// onShowHistory mengembalikan Promise (halaman riwayat dimuat dulu).
function HistoryCard({ history, onShowHistory, onPrepareHistory }) {
  const [status, setStatus] = useState('')
  const summary = summarizeForHome(history)

  function open() {
    setStatus('')
    onShowHistory().catch(() => setStatus('Riwayat belum bisa dibuka. Coba lagi ya.'))
  }

  return (
    <section aria-labelledby="history-title" data-history-section="">
      <h2 id="history-title" className="mb-3 font-heading text-2xl sm:mb-4 sm:text-3xl">
        Riwayat main
      </h2>
      {summary ? (
        <button
          type="button"
          onClick={open}
          onPointerDown={onPrepareHistory}
          onPointerEnter={onPrepareHistory}
          onFocus={onPrepareHistory}
          data-history-card=""
          className="group flex w-full flex-col gap-4 rounded-2xl border-4 border-tinta bg-kapur p-4 text-left shadow-[0_6px_0_var(--color-tinta)] transition-transform duration-150 motion-safe:hover:-translate-y-1 active:translate-y-1 active:shadow-none md:flex-row md:items-center"
        >
          <span className="grid flex-1 grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-3">
            <span>
              <span className="block text-sm font-bold">Jumlah permainan</span>
              <span className="block font-heading text-2xl leading-tight">{summary.count}</span>
            </span>
            <span>
              <span className="block text-sm font-bold">Skor tertinggi</span>
              <span className="block font-heading text-2xl leading-tight">
                {summary.best.score} dari {summary.best.maxScore}
              </span>
              <span className="block text-sm">{getLevel(summary.best.level).name}</span>
            </span>
            <span className="col-span-2 md:col-span-1">
              <span className="block text-sm font-bold">Terakhir main</span>
              <span className="flex flex-wrap items-center gap-x-2">
                <span className="font-heading text-xl leading-tight">
                  {summary.last.score} dari {summary.last.maxScore}
                </span>
                <StarRating stars={summary.last.stars} size={20} />
              </span>
              <span className="block text-sm">
                {getLevel(summary.last.level).name}, {formatPlayedAt(summary.last.finishedAt)}
              </span>
            </span>
          </span>
          <span className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl border-4 border-tinta bg-terpal px-5 font-heading text-lg text-kapur transition-colors group-hover:bg-terpal-tua">
            Lihat riwayat
          </span>
        </button>
      ) : (
        <p className="rounded-2xl border-4 border-tinta bg-kapur px-4 py-3 text-base" data-history-empty="">
          {HISTORY_EMPTY_TEXT}
        </p>
      )}
      <p role="status" aria-live="polite" className="mt-2 text-base font-bold empty:hidden">
        {status}
      </p>
    </section>
  )
}

export default HistoryCard
