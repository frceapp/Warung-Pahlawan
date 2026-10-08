import { useEffect, useRef } from 'react'
import { describeCount } from '../../lib/historyFilter.js'
import Button from '../Button.jsx'
import FilterControls from './FilterControls.jsx'

const FOCUSABLE = 'button, input, [href], select, textarea, [tabindex]:not([tabindex="-1"])'

// Panel "Filter" di HP: <dialog> modal dari bawah layar. Bagian lain halaman
// tidak bisa dipakai selama panel terbuka, Tab berputar di dalam panel, dan
// Esc menutup panel. Filter langsung berlaku; jumlah hasil diumumkan di panel.
function FilterSheet({ open, onClose, filters, onChange, onReset, isDefault, resultCount, todayKey }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal?.()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  function lockFocus(event) {
    if (event.key !== 'Tab') return
    const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)].filter(
      (element) => !element.disabled && element.getClientRects().length > 0,
    )
    // Radio dalam satu kelompok hanya satu yang bisa dicapai dengan Tab.
    const reachable = items.filter((element) => element.type !== 'radio' || element.checked)
    const first = reachable[0]
    const last = reachable.at(-1)
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="filter-sheet-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onKeyDown={lockFocus}
      data-filter-sheet=""
      className="fixed inset-x-0 top-auto bottom-0 m-0 max-h-[88dvh] w-full max-w-none rounded-t-2xl border-4 border-b-0 border-tinta bg-langit p-0 text-tinta backdrop:bg-tinta/60"
    >
      <div className="flex max-h-[calc(88dvh-4px)] flex-col">
        <div className="flex items-center justify-between gap-3 border-b-4 border-tinta bg-kapur px-4 py-2">
          <h2 id="filter-sheet-title" className="font-heading text-2xl">
            Filter
          </h2>
          <Button variant="quiet" onClick={onClose}>
            Tutup
          </Button>
        </div>
        <div className="overflow-y-auto px-4 py-4">
          <FilterControls filters={filters} onChange={onChange} todayKey={todayKey} />
        </div>
        <div className="flex gap-3 border-t-4 border-tinta bg-kapur px-4 py-3">
          <p role="status" aria-live="polite" className="sr-only">
            {describeCount(resultCount)}
          </p>
          {!isDefault && (
            <Button variant="quiet" onClick={onReset}>
              Reset filter
            </Button>
          )}
          <Button onClick={onClose} className="flex-1">
            Lihat {describeCount(resultCount)}
          </Button>
        </div>
      </div>
    </dialog>
  )
}

export default FilterSheet
