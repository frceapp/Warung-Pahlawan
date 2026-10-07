import FeedbackMessage from './FeedbackMessage.jsx'

// Bar aksi yang selalu terlihat di bawah layar main: umpan balik dan
// tombol aksi utama langkah yang sedang aktif. mt-auto menjaganya tetap di
// bawah, juga saat pembeli berganti dan area kerja sedang tidak ada. Di layar
// lebar bar ini ada di kolom kanan, di bawah meja kerja, dan tombolnya
// memenuhi lebar kolom.
function ActionBar({ feedback, children }) {
  return (
    <div className="mt-auto shrink-0 border-t-4 border-tinta bg-kapur lg:col-start-2 lg:row-start-3 lg:mt-3 lg:rounded-2xl lg:border-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:px-4 md:py-2 lg:gap-3 lg:p-3">
        <FeedbackMessage feedback={feedback} />
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  )
}

export default ActionBar
