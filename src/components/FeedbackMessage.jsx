// Ikon kecil penanda jenis umpan balik. Artinya selalu juga ditulis.
const ICONS = {
  success: <path d="M6 12.5 L10 16.5 L18 7.5" />,
  error: <path d="M7.5 7.5 L16.5 16.5 M16.5 7.5 L7.5 16.5" />,
  info: <path d="M12 11 L12 17 M12 7.2 L12 7.4" />,
}

const TONES = {
  success: { label: 'Benar!', box: 'border-daun', icon: 'bg-daun', motion: 'motion-safe:animate-pop-soft' },
  error: { label: 'Belum pas.', box: 'border-cabai', icon: 'bg-cabai', motion: 'motion-safe:animate-shake' },
  info: { label: 'Petunjuk:', box: 'border-terpal', icon: 'bg-terpal', motion: '' },
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
          data-tone={feedback.tone}
          className={`flex items-start gap-2 rounded-xl border-4 bg-kapur px-3 py-2 text-base leading-snug ${tone.box} ${tone.motion}`}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`h-7 w-7 shrink-0 rounded-full border-2 border-tinta stroke-kapur ${tone.icon}`}
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {ICONS[feedback.tone]}
          </svg>
          <span className="min-w-0 flex-1">
            <span className="font-bold">{tone.label}</span> {feedback.text}
          </span>
        </p>
      )}
    </div>
  )
}

export default FeedbackMessage
