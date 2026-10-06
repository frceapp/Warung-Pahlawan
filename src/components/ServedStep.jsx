// Setelah pembeli selesai dilayani. Tombol lanjut ada di bar aksi.
function ServedStep({ isLast }) {
  return (
    <p className="w-fit rounded-xl border-4 border-tinta bg-kapur px-3 py-1.5 text-base md:px-4 md:py-2 md:text-lg">
      {isLast ? 'Semua pembeli sudah dilayani.' : 'Pembeli berikutnya sudah menunggu.'}
    </p>
  )
}

export default ServedStep
