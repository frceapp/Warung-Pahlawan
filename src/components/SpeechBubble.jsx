// Balon bicara pembeli. Ekor balon menunjuk ke kepala pembeli: ke kiri
// (bawaan, balon di samping kepala) atau ke bawah di HP (tail="bottom", balon
// di atas kepala; di layar lebar tetap ke kiri).
function SpeechBubble({ children, tail = 'left', compact = false, className = '' }) {
  const tailClass =
    tail === 'bottom'
      ? '-bottom-[13px] left-1/2 -translate-x-1/2 -rotate-45 md:top-6 md:bottom-auto md:-left-[13px] md:translate-x-0 md:rotate-45'
      : `${compact ? 'top-4 md:top-6' : 'top-6'} -left-[13px] rotate-45`
  return (
    <div
      className={`relative rounded-2xl border-4 border-tinta bg-kapur ${
        compact
          ? 'px-3 py-1.5 text-sm leading-snug md:px-5 md:py-3 md:text-lg md:leading-relaxed'
          : 'px-3 py-2 text-[15px] leading-snug md:px-5 md:py-4 md:text-xl md:leading-relaxed'
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
