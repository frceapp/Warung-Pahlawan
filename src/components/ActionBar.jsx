import FeedbackMessage from './FeedbackMessage.jsx'

// Bar aksi yang selalu terlihat di bawah layar main: umpan balik dan
// tombol aksi utama langkah yang sedang aktif.
function ActionBar({ feedback, children }) {
  return (
    <div className="shrink-0 border-t-4 border-tinta bg-kapur">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:px-4 md:py-2">
        <FeedbackMessage feedback={feedback} />
        {children}
      </div>
    </div>
  )
}

export default ActionBar
