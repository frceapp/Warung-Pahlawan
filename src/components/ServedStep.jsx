import Button from './Button.jsx'

// Setelah pembeli selesai dilayani.
function ServedStep({ isLast, onNext }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-lg">
        {isLast ? 'Semua pembeli sudah dilayani.' : 'Pembeli berikutnya sudah menunggu.'}
      </p>
      <Button onClick={onNext}>{isLast ? 'Lihat hasil' : 'Layani pembeli berikutnya'}</Button>
    </div>
  )
}

export default ServedStep
