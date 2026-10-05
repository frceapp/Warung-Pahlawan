// Balon bicara pembeli. Ekor balon menunjuk ke pembeli: ke kiri (bawaan,
// sejajar kepala) atau ke atas di HP (tail="top", pembeli di atas balon).
function SpeechBubble({ children, tail = 'left', compact = false, className = '' }) {
  const tailClass =
    tail === 'top'
      ? '-top-[13px] left-1/2 -translate-x-1/2 rotate-[135deg] md:top-6 md:-left-[13px] md:translate-x-0 md:rotate-45'
      : `${compact ? 'top-4' : 'top-6'} -left-[13px] rotate-45`
  return (
    <div
      className={`relative rounded-2xl border-4 border-tinta bg-kapur leading-relaxed ${
        compact ? 'px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-base' : 'px-4 py-3 text-base sm:px-5 sm:py-4 sm:text-lg'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute h-5 w-5 border-b-4 border-l-4 border-tinta bg-kapur ${tailClass}`}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

export default SpeechBubble
