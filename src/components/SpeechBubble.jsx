// Balon bicara pembeli. Ekor balon menunjuk ke kepala pembeli: ke kiri
// (bawaan, balon di samping kepala) atau ke bawah di HP (tail="bottom", balon
// di atas kepala; di tablet tetap ke kiri). Di layar lebar (dua kolom) balon
// selalu di atas kepala, jadi ekornya ke bawah dan teksnya lebih rapat.
const TAIL_DOWN_LG = 'lg:top-auto lg:-bottom-[13px] lg:left-1/2 lg:-translate-x-1/2 lg:-rotate-45'

function SpeechBubble({ children, tail = 'left', compact = false, className = '' }) {
  const tailClass =
    tail === 'bottom'
      ? `-bottom-[13px] left-1/2 -translate-x-1/2 -rotate-45 md:top-6 md:bottom-auto md:-left-[13px] md:translate-x-0 md:rotate-45 ${TAIL_DOWN_LG}`
      : `${compact ? 'top-4 md:top-6' : 'top-6'} -left-[13px] rotate-45 ${TAIL_DOWN_LG}`
  return (
    <div
      className={`relative rounded-2xl border-4 border-tinta bg-kapur ${
        compact
          ? 'px-2.5 py-1.5 text-sm leading-snug md:px-5 md:py-3 md:text-lg md:leading-relaxed lg:px-4 lg:py-2 lg:text-base lg:leading-snug'
          : 'px-3 py-2 text-[15px] leading-snug md:px-5 md:py-4 md:text-xl md:leading-relaxed lg:px-4 lg:py-2.5 lg:text-lg lg:leading-snug'
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
