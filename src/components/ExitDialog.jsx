import ConfirmDialog from './ConfirmDialog.jsx'

// Dialog sebelum menutup warung saat permainan sedang berjalan (tombol ←
// di layar main atau tombol kembali browser). Esc sama dengan "Lanjut main".
function ExitDialog({ open, onStay, onLeave }) {
  return (
    <ConfirmDialog
      open={open}
      title="Tutup warung sekarang?"
      text="Skor level ini belum tersimpan."
      cancelLabel="Lanjut main"
      confirmLabel="Tutup warung"
      onCancel={onStay}
      onConfirm={onLeave}
    />
  )
}

export default ExitDialog
