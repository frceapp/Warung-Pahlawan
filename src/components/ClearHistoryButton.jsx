import { useState } from 'react'
import Button from './Button.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'

// Tombol "Hapus riwayat" dengan dialog konfirmasi. Bintang terbaik di kartu
// level tidak ikut terhapus, dan itu dikatakan di dialog.
function ClearHistoryButton({ onClear, className = '' }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="quiet" onClick={() => setOpen(true)} className={className}>
        Hapus riwayat
      </Button>
      <ConfirmDialog
        open={open}
        title="Hapus semua riwayat main?"
        text="Daftar skor akan kosong. Bintang terbaik di kartu level tetap ada."
        cancelLabel="Jangan hapus"
        confirmLabel="Hapus riwayat"
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false)
          onClear()
        }}
      />
    </>
  )
}

export default ClearHistoryButton
