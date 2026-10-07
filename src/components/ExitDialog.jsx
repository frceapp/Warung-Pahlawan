import { useEffect, useRef } from 'react'
import Button from './Button.jsx'

// Dialog sebelum menutup warung saat permainan sedang berjalan (tombol ←
// di layar main atau tombol kembali browser). Memakai <dialog> modal: bagian
// lain halaman tidak bisa dipakai selama dialog terbuka, fokus dikunci di
// antara kedua tombol, dan Esc menutup dialog (sama dengan "Lanjut main").
function ExitDialog({ open, onStay, onLeave }) {
  const dialogRef = useRef(null)
  const stayRef = useRef(null)
  const leaveRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal?.()
      stayRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Tab dan Shift+Tab berputar di antara kedua tombol saja.
  function lockFocus(event) {
    if (event.key !== 'Tab') return
    const first = stayRef.current
    const last = leaveRef.current
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
      aria-labelledby="exit-title"
      aria-describedby="exit-text"
      onCancel={(event) => {
        event.preventDefault()
        onStay()
      }}
      onKeyDown={lockFocus}
      className="m-auto w-[calc(100%-32px)] max-w-sm rounded-2xl border-4 border-tinta bg-kapur p-5 text-tinta shadow-[0_6px_0_var(--color-tinta)] backdrop:bg-tinta/60"
    >
      <h2 id="exit-title" className="font-heading text-2xl leading-tight">
        Tutup warung sekarang?
      </h2>
      <p id="exit-text" className="mt-2 text-lg">
        Skor level ini belum tersimpan.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button ref={stayRef} onClick={onStay} className="sm:flex-1">
          Lanjut main
        </Button>
        <Button ref={leaveRef} variant="secondary" onClick={onLeave} className="sm:flex-1">
          Tutup warung
        </Button>
      </div>
    </dialog>
  )
}

export default ExitDialog
