import { useEffect, useRef, useState } from 'react'
import Awning from '../components/Awning.jsx'
import Button from '../components/Button.jsx'
import ClearHistoryButton from '../components/ClearHistoryButton.jsx'
import HistoryList from '../components/HistoryList.jsx'
import StarRating from '../components/StarRating.jsx'
import { getLevel } from '../data/levels.js'
import { HISTORY_CLEARED_TEXT, HISTORY_EMPTY_TEXT, summarizeHistory } from '../lib/scoreHistory.js'

// Halaman "Semua riwayat": ringkasan (jumlah permainan, skor tertinggi dan
// bintang terbaik tiap level) lalu daftar lengkap. Ringkasan dihitung dari
// riwayat ini saja.
function HistoryScreen({ history, onClearHistory, onHome }) {
  const headingRef = useRef(null)
  const [status, setStatus] = useState('')
  // Fokus di judul saat halaman dibuka, dan lagi setelah riwayat dihapus
  // (tombol dan dialognya hilang dari halaman).
  const [clearCount, setClearCount] = useState(0)
  useEffect(() => {
    headingRef.current?.focus()
  }, [clearCount])

  const summary = summarizeHistory(history)

  function clear() {
    onClearHistory()
    setStatus(HISTORY_CLEARED_TEXT)
    setClearCount((count) => count + 1)
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Awning />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pt-4 pb-12">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="quiet" onClick={onHome}>
            <span aria-hidden="true">←</span> Beranda
          </Button>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="-rotate-1 rounded-2xl border-4 border-tinta bg-terpal px-4 py-2 font-heading text-3xl leading-tight text-kapur shadow-[0_6px_0_var(--color-tinta)] sm:px-6 sm:text-5xl"
          >
            Semua riwayat
          </h1>
        </div>

        <p role="status" aria-live="polite" className="text-base font-bold empty:hidden">
          {status}
        </p>

        {history.length === 0 ? (
          <div className="flex flex-col items-start gap-4">
            <p className="rounded-2xl border-4 border-tinta bg-kapur px-4 py-3 text-lg" data-history-empty="">
              {HISTORY_EMPTY_TEXT}
            </p>
            <Button onClick={onHome}>Kembali ke beranda</Button>
          </div>
        ) : (
          <>
            <section aria-labelledby="summary-title" data-history-summary="">
              <h2 id="summary-title" className="mb-3 font-heading text-2xl sm:text-3xl">
                Ringkasan
              </h2>
              <p className="mb-3 inline-block rounded-xl border-4 border-tinta bg-pisang px-3 py-1 font-heading text-xl">
                {summary.count} permainan
              </p>
              <ul className="grid gap-3 sm:grid-cols-3">
                {summary.levels.map((level) => (
                  <li
                    key={level.levelId}
                    className="flex flex-col gap-1 rounded-2xl border-4 border-tinta bg-kapur p-3"
                  >
                    <span className="flex items-center gap-2">
                      <span className="rounded-lg border-4 border-tinta bg-terpal px-2 py-0.5 font-heading text-base text-kapur">
                        Level {level.levelId}
                      </span>
                      <span className="font-heading text-lg leading-tight">{getLevel(level.levelId).name}</span>
                    </span>
                    {level.plays === 0 ? (
                      <span className="text-base">Belum ada di riwayat</span>
                    ) : (
                      <>
                        <span className="text-base">
                          Skor tertinggi <span className="font-bold">{level.bestScore}</span> dari {level.maxScore}
                        </span>
                        <span className="flex items-center gap-2 text-base">
                          Bintang terbaik
                          <StarRating stars={level.bestStars} size={22} />
                        </span>
                        <span className="text-sm">Dimainkan {level.plays} kali</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="all-title">
              <h2 id="all-title" className="mb-3 font-heading text-2xl sm:text-3xl">
                Daftar permainan
              </h2>
              <HistoryList entries={history} showMistakes />
            </section>

            <div className="flex flex-col gap-3 sm:flex-row">
              <ClearHistoryButton onClear={clear} />
              <Button variant="secondary" onClick={onHome}>
                Kembali ke beranda
              </Button>
            </div>
          </>
        )}
      </main>
      <div className="h-10 border-t-4 border-tinta bg-kayu" aria-hidden="true" />
    </div>
  )
}

export default HistoryScreen
