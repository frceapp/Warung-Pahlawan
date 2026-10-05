// Terpal warung bergaris biru dan jingga dengan pinggiran bergelombang.
function Awning({ className = '' }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="awning-stripes h-12 border-b-4 border-tinta sm:h-16" />
      <div className="awning-scallops h-7" />
    </div>
  )
}

export default Awning
