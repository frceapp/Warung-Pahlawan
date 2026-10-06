import FeedbackMessage from './FeedbackMessage.jsx'

// Bar aksi yang selalu terlihat di bawah layar main: umpan balik dan
// tombol aksi utama langkah yang sedang aktif. mt-auto menjaganya tetap di
// bawah, juga saat pembeli berganti dan area kerja sedang tidak ada.
// Di layar lebar umpan balik ada di samping tombol (bukan di atasnya), supaya
// bar tidak bertambah tinggi dan meja kasir tidak perlu digeser.
function ActionBar({ feedback, children }) {
  return (
    <div className="mt-auto shrink-0 border-t-4 border-tinta bg-kapur">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:px-4 md:py-2 lg:flex-row-reverse lg:items-center lg:gap-3">
        <div className="lg:min-w-0 lg:flex-1">
          <FeedbackMessage feedback={feedback} />
        </div>
        <div className="flex flex-col lg:shrink-0">{children}</div>
      </div>
    </div>
  )
}

export default ActionBar
