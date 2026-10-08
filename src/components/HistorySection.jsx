import { useEffect, useRef, useState } from 'react'
import Button from './Button.jsx'
import ClearHistoryButton from './ClearHistoryButton.jsx'
import HistoryList from './HistoryList.jsx'
import { HISTORY_CLEARED_TEXT, HISTORY_EMPTY_TEXT } from '../lib/scoreHistory.js'

const PREVIEW_COUNT = 5

// Bagian "Riwayat main" di beranda: lima permainan terakhir, tombol
// "Lihat semua" (kalau lebih dari lima), dan tombol "Hapus riwayat".
// onShowHistory mengembalikan Promise (halaman riwayat dimuat dulu).
function HistorySection({ history, onShowHistory, onPrepareHistory, onClearHistory }) {
  const headingRef = useRef(null)
  const [status, setStatus] = useState('')
  // Setelah riwayat dihapus, tombol dan dialognya hilang dari halaman; fokus
  // dipindah ke judul sesudah halaman diperbarui.
  const [clearCount, setClearCount] = useState(0)
  useEffect(() => {
    if (clearCount > 0) headingRef.current?.focus()
  }, [clearCount])

  function showAll() {
    setStatus('')
    onShowHistory().catch(() => setStatus('Riwayat belum bisa dibuka. Coba lagi ya.'))
  }

  function clear() {
    onClearHistory()
    setStatus(HISTORY_CLEARED_TEXT)
    setClearCount((count) => count + 1)
  }

  return (
    <section aria-labelledby="history-title" data-history-section="">
      <h2
        id="history-title"
        ref={headingRef}
        tabIndex={-1}
        className="mb-3 font-heading text-2xl sm:mb-4 sm:text-3xl"
      >
        Riwayat main
      </h2>
      {history.length === 0 ? (
        <p className="rounded-2xl border-4 border-tinta bg-kapur px-4 py-3 text-base" data-history-empty="">
          {HISTORY_EMPTY_TEXT}
        </p>
      ) : (
        <>
          <HistoryList entries={history.slice(0, PREVIEW_COUNT)} />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            {history.length > PREVIEW_COUNT && (
              <Button
                variant="secondary"
                onClick={showAll}
                onPointerEnter={onPrepareHistory}
                onFocus={onPrepareHistory}
              >
                Lihat semua
              </Button>
            )}
            <ClearHistoryButton onClear={clear} />
          </div>
        </>
      )}
      <p role="status" aria-live="polite" className="mt-2 text-base font-bold empty:hidden">
        {status}
      </p>
    </section>
  )
}

export default HistorySection
