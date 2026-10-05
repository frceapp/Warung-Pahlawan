// Setelah pembeli selesai dilayani. Tombol lanjut ada di bar aksi.
function ServedStep({ isLast }) {
  return (
    <p className="text-base md:text-lg">
      {isLast ? 'Semua pembeli sudah dilayani.' : 'Pembeli berikutnya sudah menunggu.'}
    </p>
  )
}

export default ServedStep
