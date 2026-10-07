import { paint } from './character/paint.js'
import { shoppingBag } from './character/shoppingBag.jsx'

// Bungkusan belanja (kantong kertas berisi buah) di atas meja kasir, sama
// dengan yang nanti dipegang pembeli.
function BagImage({ className = '', size = 48 }) {
  return (
    <svg
      viewBox="-12 -4 24 27"
      width={size}
      height={(size * 27) / 24}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g stroke={paint('tinta')} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        {shoppingBag()}
      </g>
    </svg>
  )
}

export default BagImage
