import { useEffect, useId, useRef } from 'react'
import Button from './Button.jsx'

// Dialog konfirmasi buatan sendiri (bukan window.confirm), memakai <dialog>
// modal: bagian lain halaman tidak bisa dipakai selama dialog terbuka, fokus
// dikunci di antara kedua tombol, dan Esc menutup dialog (sama dengan tombol
// batal). Saat dibuka, fokus ada di tombol batal supaya pilihan yang aman
// yang terpilih lebih dulu.
function ConfirmDialog({ open, title, text, cancelLabel, confirmLabel, onCancel, onConfirm }) {
  const dialogRef = useRef(null)
  const cancelRef = useRef(null)
  const confirmRef = useRef(null)
  const id = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal?.()
      cancelRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Tab dan Shift+Tab berputar di antara kedua tombol saja.
  function lockFocus(event) {
    if (event.key !== 'Tab') return
    const first = cancelRef.current
    const last = confirmRef.current
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
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-text`}
      onCancel={(event) => {
        event.preventDefault()
        onCancel()
      }}
      onKeyDown={lockFocus}
      className="m-auto w-[calc(100%-32px)] max-w-sm rounded-2xl border-4 border-tinta bg-kapur p-5 text-tinta shadow-[0_6px_0_var(--color-tinta)] backdrop:bg-tinta/60"
    >
      <h2 id={`${id}-title`} className="font-heading text-2xl leading-tight">
        {title}
      </h2>
      <p id={`${id}-text`} className="mt-2 text-lg">
        {text}
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button ref={cancelRef} onClick={onCancel} className="sm:flex-1">
          {cancelLabel}
        </Button>
        <Button ref={confirmRef} variant="secondary" onClick={onConfirm} className="sm:flex-1">
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  )
}

export default ConfirmDialog
