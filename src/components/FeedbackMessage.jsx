const TONES = {
  success: { label: 'Benar!', box: 'border-daun', badge: 'bg-daun text-kapur' },
  error: { label: 'Belum pas.', box: 'border-cabai', badge: 'bg-cabai text-kapur' },
  info: { label: 'Petunjuk:', box: 'border-terpal', badge: 'bg-terpal text-kapur' },
}

// Umpan balik selalu berupa teks (bukan warna saja) dan diumumkan lewat
// aria-live. Wadahnya selalu ada supaya pembaca layar menangkap perubahan.
function FeedbackMessage({ feedback }) {
  const tone = feedback ? TONES[feedback.tone] : null
  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      {feedback && (
        <p
          key={feedback.id}
          className={`flex flex-wrap items-start gap-2 rounded-xl border-4 bg-kapur px-3 py-2 text-base leading-snug ${tone.box}`}
        >
          <span className={`rounded-md px-2 py-0.5 font-bold ${tone.badge}`}>{tone.label}</span>
          <span className="min-w-0 flex-1">{feedback.text}</span>
        </p>
      )}
    </div>
  )
}

export default FeedbackMessage
