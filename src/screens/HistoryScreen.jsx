import { useEffect, useRef, useState } from 'react'
import Awning from '../components/Awning.jsx'
import Button from '../components/Button.jsx'
import ClearHistoryButton from '../components/ClearHistoryButton.jsx'
import FilterControls from '../components/history/FilterControls.jsx'
import FilterSheet from '../components/history/FilterSheet.jsx'
import HistoryGroups from '../components/history/HistoryGroups.jsx'
import StarRating from '../components/StarRating.jsx'
import { getLevel } from '../data/levels.js'
import {
  applyHistoryFilters,
  DEFAULT_FILTERS,
  describeCount,
  getActiveChips,
  groupByDay,
  isDefaultFilters,
  loadFilters,
  NO_MATCH_TEXT,
  PAGE_SIZE,
  removeFilter,
  saveFilters,
  toDayKey,
} from '../lib/historyFilter.js'
import { HISTORY_CLEARED_TEXT, HISTORY_EMPTY_TEXT, summarizeHistory } from '../lib/scoreHistory.js'
import { useMediaQuery } from '../lib/useMediaQuery.js'

// Pilihan filter hanya disimpan selama sesi (sessionStorage).
function getSessionStorage() {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage
  } catch {
    return null
  }
}
const sessionStore = getSessionStorage()

function currentTime() {
  return new Date()
}

// Halaman riwayat: ringkasan (jumlah permainan, skor tertinggi dan bintang
// terbaik tiap level), filter, lalu daftar yang dikelompokkan per tanggal,
// sepuluh entri dulu. Di layar lebar filter ada di samping daftar; di HP
// filter dibuka lewat tombol "Filter".
function HistoryScreen({ history, onClearHistory, onHome }) {
  const headingRef = useRef(null)
  const countRef = useRef(null)
  const filterButtonRef = useRef(null)
  const [now] = useState(currentTime)
  const [filters, setFilters] = useState(() => loadFilters(sessionStore))
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [clearCount, setClearCount] = useState(0)
  const [focusRequest, setFocusRequest] = useState(null)
  const wide = useMediaQuery('(min-width: 768px)')

  // Fokus di judul saat halaman dibuka, dan lagi setelah riwayat dihapus
  // (tombol dan dialognya hilang dari halaman).
  useEffect(() => {
    headingRef.current?.focus()
  }, [clearCount])

  useEffect(() => {
    saveFilters(sessionStore, filters)
  }, [filters])

  // Fokus setelah aksi yang menghapus tombolnya sendiri (chip, "Muat lebih
  // banyak" terakhir) atau menambah baris baru.
  useEffect(() => {
    if (!focusRequest) return
    if (focusRequest.type === 'count') countRef.current?.focus()
    if (focusRequest.type === 'entry') {
      document.querySelector(`[data-entry-index="${focusRequest.index}"]`)?.focus()
    }
  }, [focusRequest])

  const summary = summarizeHistory(history)
  const results = applyHistoryFilters(history, filters, now)
  const groups = groupByDay(results.slice(0, visible), now)
  const chips = getActiveChips(filters)
  const isDefault = isDefaultFilters(filters)
  const todayKey = toDayKey(now)

  function updateFilters(next) {
    setFilters(next)
    setVisible(PAGE_SIZE)
  }

  function resetFilters() {
    updateFilters(DEFAULT_FILTERS)
    setFocusRequest({ type: 'count' })
  }

  function removeChip(key) {
    updateFilters(removeFilter(filters, key))
    setFocusRequest({ type: 'count' })
  }

  function loadMore() {
    setFocusRequest({ type: 'entry', index: visible })
    setVisible((count) => count + PAGE_SIZE)
  }

  function closeSheet() {
    setSheetOpen(false)
    filterButtonRef.current?.focus()
  }

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
            Riwayat main
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
                {describeCount(summary.count)}
              </p>
              {/* Di HP satu baris per level supaya daftar cepat terlihat; di
                  layar lebih lebar tiga kartu berjajar. */}
              <ul className="grid gap-2 sm:grid-cols-3 sm:gap-3">
                {summary.levels.map((level) => (
                  <li
                    key={level.levelId}
                    className="flex items-center gap-3 rounded-2xl border-4 border-tinta bg-kapur px-3 py-2 sm:flex-col sm:items-start sm:gap-1 sm:p-3"
                  >
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="rounded-lg border-4 border-tinta bg-terpal px-2 py-0.5 font-heading text-base whitespace-nowrap text-kapur">
                        Level {level.levelId}
                      </span>
                      <span className="sr-only font-heading text-lg leading-tight sm:not-sr-only">
                        {getLevel(level.levelId).name}
                      </span>
                    </span>
                    {level.plays === 0 ? (
                      <span className="text-base">Belum ada di riwayat</span>
                    ) : (
                      <>
                        <span className="text-sm whitespace-nowrap sm:text-base">
                          <span className="sm:hidden">Tertinggi</span>
                          <span className="hidden sm:inline">Skor tertinggi</span>{' '}
                          <span className="font-bold">{level.bestScore}</span> dari {level.maxScore}
                        </span>
                        <span className="ml-auto flex items-center gap-2 text-base sm:ml-0">
                          <span className="hidden sm:inline">Bintang terbaik</span>
                          <StarRating
                            stars={level.bestStars}
                            size={20}
                            label={`Bintang terbaik: ${level.bestStars} dari 3`}
                          />
                        </span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <div className="grid gap-6 md:grid-cols-[16rem_1fr] md:items-start">
              {wide && (
                <aside
                  aria-labelledby="filter-title"
                  className="flex flex-col gap-4 rounded-2xl border-4 border-tinta bg-kapur p-4"
                  data-filter-panel=""
                >
                  <h2 id="filter-title" className="font-heading text-2xl">
                    Filter
                  </h2>
                  <FilterControls filters={filters} onChange={updateFilters} todayKey={todayKey} />
                </aside>
              )}

              <section aria-labelledby="list-title" className="flex min-w-0 flex-col gap-4">
                <h2 id="list-title" className="sr-only">
                  Daftar permainan
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                  <p
                    ref={countRef}
                    tabIndex={-1}
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    className="mr-auto font-heading text-2xl"
                    data-result-count=""
                  >
                    {describeCount(results.length)}
                  </p>
                  {!wide && (
                    <Button ref={filterButtonRef} variant="secondary" onClick={() => setSheetOpen(true)}>
                      Filter{chips.length > 0 ? ` (${chips.length})` : ''}
                    </Button>
                  )}
                  {!isDefault && (
                    <Button variant="quiet" onClick={resetFilters}>
                      Reset filter
                    </Button>
                  )}
                </div>

                {chips.length > 0 && (
                  <ul aria-label="Filter yang aktif" className="flex flex-wrap gap-2" data-filter-chips="">
                    {chips.map((chip) => (
                      <li key={chip.key}>
                        <button
                          type="button"
                          onClick={() => removeChip(chip.key)}
                          aria-label={`Hapus filter ${chip.label}`}
                          className="inline-flex min-h-12 items-center gap-2 rounded-full border-4 border-tinta bg-pisang px-3 font-bold"
                        >
                          {chip.label}
                          <span aria-hidden="true" className="font-heading text-xl leading-none">
                            ×
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {results.length === 0 ? (
                  <div className="flex flex-col items-start gap-3" data-no-match="">
                    <p className="rounded-2xl border-4 border-tinta bg-kapur px-4 py-3 text-lg">{NO_MATCH_TEXT}</p>
                    <Button onClick={resetFilters}>Reset filter</Button>
                  </div>
                ) : (
                  <>
                    <HistoryGroups groups={groups} />
                    <div className="flex flex-col items-start gap-2">
                      <p className="text-sm">
                        {Math.min(visible, results.length)} dari {results.length} ditampilkan
                      </p>
                      {visible < results.length && (
                        <Button variant="secondary" onClick={loadMore}>
                          Muat lebih banyak
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </section>
            </div>

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
      {!wide && history.length > 0 && (
        <FilterSheet
          open={sheetOpen}
          onClose={closeSheet}
          filters={filters}
          onChange={updateFilters}
          onReset={() => updateFilters(DEFAULT_FILTERS)}
          isDefault={isDefault}
          resultCount={results.length}
          todayKey={todayKey}
        />
      )}
    </div>
  )
}

export default HistoryScreen
