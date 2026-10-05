import { formatRupiah } from '../game/format.js'

// Desain uang sendiri: warna polos dan angka besar. Sengaja tidak meniru
// desain uang rupiah asli. Rp500 digambar sebagai koin, sisanya lembaran.
const STYLES = {
  500: { fill: 'fill-langit', ink: 'fill-tinta' },
  1000: { fill: 'fill-daun', ink: 'fill-kapur' },
  2000: { fill: 'fill-pisang', ink: 'fill-tinta' },
  5000: { fill: 'fill-jingga', ink: 'fill-tinta' },
  10000: { fill: 'fill-terpal', ink: 'fill-kapur' },
  20000: { fill: 'fill-kayu', ink: 'fill-tinta' },
  50000: { fill: 'fill-cabai', ink: 'fill-kapur' },
  100000: { fill: 'fill-terpal-tua', ink: 'fill-kapur' },
}

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
            <rect
              className="fill-none"
              x="9"
              y="9"
              width="82"
              height="42"
              rx="4"
              strokeWidth="2"
              opacity="0.35"
            />
          </>
        )}
      </g>
      <text
        className={`${style.ink} font-heading`}
        x="50"
        y="31"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={isCoin ? 22 : { 5: 28, 6: 24, 7: 20 }[number.length]}
      >
        {number}
      </text>
    </svg>
  )
}

export default MoneyImage
