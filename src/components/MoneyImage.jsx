import { formatRupiah } from '../game/format.js'

// Desain uang sendiri: warna polos, pita warna di sisi kiri, dan angka besar.
// Sengaja tidak meniru desain uang rupiah asli. Tiap pecahan punya pasangan
// warna dasar dan pita yang berbeda, dan tidak ada yang berwarna kayu supaya
// tidak menyatu dengan meja warung. Rp500 digambar sebagai koin.
const STYLES = {
  500: { fill: 'fill-kapur', ink: 'fill-tinta' },
  1000: { fill: 'fill-daun', band: 'fill-pisang', ink: 'fill-kapur' },
  2000: { fill: 'fill-pisang', band: 'fill-daun', ink: 'fill-tinta' },
  5000: { fill: 'fill-jingga', band: 'fill-terpal-tua', ink: 'fill-tinta' },
  10000: { fill: 'fill-terpal', band: 'fill-pisang', ink: 'fill-kapur' },
  20000: { fill: 'fill-langit', band: 'fill-cabai', ink: 'fill-tinta' },
  50000: { fill: 'fill-cabai', band: 'fill-kapur', ink: 'fill-kapur' },
  100000: { fill: 'fill-tinta', band: 'fill-pisang', ink: 'fill-kapur' },
}

// Pita kiri mengikuti sudut membulat lembaran.
const BAND_PATH = 'M10 2 H22 V58 H10 A8 8 0 0 1 2 50 V10 A8 8 0 0 1 10 2 Z'

function shortNumber(value) {
  return formatRupiah(value).replace('Rp', '')
}

// `size` adalah lebar gambar dalam piksel; tingginya 60% dari lebar.
function MoneyImage({ value, size = 40, label, decorative = false, className = '' }) {
  const style = STYLES[value]
  if (!style) throw new Error(`Unknown money value: ${value}`)
  const isCoin = value === 500
  const number = shortNumber(value)

  const a11y = decorative
    ? { 'aria-hidden': true }
    : {
        role: 'img',
        'aria-label': label ?? `${isCoin ? 'Koin' : 'Uang'} ${formatRupiah(value)}`,
      }

  return (
    <svg
      viewBox="0 0 100 60"
      width={size}
      height={size * 0.6}
      className={className}
      {...a11y}
    >
      <g className="stroke-tinta" strokeWidth="3.5" strokeLinejoin="round">
        {isCoin ? (
          <>
            <circle className={style.fill} cx="50" cy="30" r="27" />
            <circle className="fill-none" cx="50" cy="30" r="20" strokeWidth="2" opacity="0.5" />
          </>
        ) : (
          <>
            <rect className={style.fill} x="2" y="2" width="96" height="56" rx="8" />
            <path className={style.band} d={BAND_PATH} stroke="none" />
            <path className="fill-none" d="M22 2 V58" strokeWidth="2.5" />
            <rect className="fill-none" x="2" y="2" width="96" height="56" rx="8" />
          </>
        )}
      </g>
      <text
        className={`${style.ink} font-heading`}
        x={isCoin ? 50 : 60}
        y="31"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={isCoin ? 22 : { 5: 26, 6: 22, 7: 19 }[number.length]}
      >
        {number}
      </text>
    </svg>
  )
}

export default MoneyImage
