// Terpal warung bergaris biru dan jingga dengan pinggiran bergelombang.
// `thin`: di HP hanya garis tipis supaya layar main muat satu layar.
function Awning({ thin = false, className = '' }) {
  return (
    <div className={`shrink-0 ${className}`} aria-hidden="true">
      <div
        className={`awning-stripes border-b-4 border-tinta ${thin ? 'h-3 md:h-8' : 'h-12 sm:h-16'}`}
      />
      <div className={`awning-scallops h-7 ${thin ? 'hidden md:block' : ''}`} />
    </div>
  )
}

export default Awning
