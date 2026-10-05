// Balon bicara pembeli. Ekor balon menunjuk ke avatar di sebelah kiri.
function SpeechBubble({ children, className = '' }) {
  return (
    <div
      className={`relative rounded-2xl border-4 border-tinta bg-kapur px-4 py-3 text-base leading-relaxed sm:px-5 sm:py-4 sm:text-lg ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute top-6 -left-[13px] h-5 w-5 rotate-45 border-b-4 border-l-4 border-tinta bg-kapur"
      />
      <div className="relative">{children}</div>
    </div>
  )
}

export default SpeechBubble
