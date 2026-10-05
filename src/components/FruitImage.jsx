import { getFruit } from '../data/fruits.js'

// Rambutan: lingkaran berduri kecil, dihitung sekali saat modul dimuat.
const RAMBUTAN_PATH = (() => {
  const spikes = 16
  const points = []
  for (let i = 0; i < spikes * 2; i += 1) {
    const angle = (Math.PI * i) / spikes
    const radius = i % 2 === 0 ? 22 : 18
    points.push(
      `${(32 + radius * Math.cos(angle)).toFixed(1)} ${(34 + radius * Math.sin(angle)).toFixed(1)}`,
    )
  }
  return `M${points.join(' L')} Z`
})()

const ART = {
  banana: (
    <>
      <path
        className="fill-pisang"
        d="M10 28 C 12 46 32 58 52 46 C 56 43 56 38 53 37 C 44 45 26 42 18 28 C 16 24 10 24 10 28 Z"
      />
      <path className="fill-none" d="M20 36 C 28 44 40 46 50 42" strokeWidth="2" />
      <path className="fill-kayu" d="M52 38 L56 30 L59 32 L55 40 Z" />
      <circle className="fill-tinta" cx="11.5" cy="27.5" r="2" stroke="none" />
    </>
  ),
  apple: (
    <>
      <path className="fill-none" d="M32 20 C 32 14 34 10 37 7" strokeWidth="3.5" />
      <path
        className="fill-cabai"
        d="M32 20 C 24 13 10 17 10 32 C 10 46 21 57 32 54 C 43 57 54 46 54 32 C 54 17 40 13 32 20 Z"
      />
      <path className="fill-daun" d="M35 13 C 38 6 48 5 50 8 C 47 14 40 16 35 13 Z" />
      <ellipse className="fill-kapur" cx="21" cy="30" rx="3" ry="5" stroke="none" opacity="0.8" />
    </>
  ),
  mango: (
    <>
      <path className="fill-kayu" d="M17 21 L12 14 L15 12 L20 19 Z" />
      <path className="fill-daun" d="M16 15 C 18 7 28 5 31 8 C 27 14 21 16 16 15 Z" />
      <path
        className="fill-daun"
        d="M18 20 C 28 12 46 16 54 30 C 61 43 54 56 40 55 C 26 54 12 44 11 32 C 11 26 14 23 18 20 Z"
      />
      <path
        className="fill-pisang"
        d="M53 34 C 56 46 50 54 40 54 C 34 54 30 52 27 50 C 38 50 48 45 53 34 Z"
        stroke="none"
      />
      <ellipse className="fill-kapur" cx="22" cy="29" rx="3" ry="5" stroke="none" opacity="0.7" transform="rotate(-30 22 29)" />
    </>
  ),
  watermelon: (
    <>
      <path className="fill-daun" d="M6 24 A 26 26 0 0 0 58 24 Z" />
      <path className="fill-kapur" d="M11 24 A 21 21 0 0 0 53 24 Z" stroke="none" />
      <path className="fill-cabai" d="M14 24 A 18 18 0 0 0 50 24 Z" />
      <g className="fill-tinta" stroke="none">
        <ellipse cx="24" cy="30" rx="1.6" ry="2.6" />
        <ellipse cx="32" cy="35" rx="1.6" ry="2.6" />
        <ellipse cx="40" cy="30" rx="1.6" ry="2.6" />
        <ellipse cx="28" cy="27" rx="1.4" ry="2.2" />
        <ellipse cx="36" cy="27" rx="1.4" ry="2.2" />
      </g>
    </>
  ),
  rambutan: (
    <>
      <path className="fill-cabai" d={RAMBUTAN_PATH} />
      <circle className="fill-none" cx="32" cy="34" r="12" strokeWidth="2" opacity="0.5" />
      <path className="fill-daun" d="M32 12 L30 6 L34 6 Z" strokeWidth="2" />
      <ellipse className="fill-kapur" cx="25" cy="29" rx="2.5" ry="4" stroke="none" opacity="0.8" />
    </>
  ),
  orange: (
    <>
      <circle className="fill-jingga" cx="32" cy="35" r="21" />
      <path className="fill-daun" d="M33 14 C 36 7 46 6 49 9 C 45 15 38 17 33 14 Z" />
      <circle className="fill-tinta" cx="32" cy="14" r="2" stroke="none" />
      <g className="fill-tinta" stroke="none" opacity="0.35">
        <circle cx="40" cy="40" r="1.2" />
        <circle cx="45" cy="33" r="1.2" />
        <circle cx="36" cy="47" r="1.2" />
        <circle cx="25" cy="44" r="1.2" />
      </g>
      <ellipse className="fill-kapur" cx="23" cy="29" rx="3" ry="5" stroke="none" opacity="0.7" />
    </>
  ),
}

// Gambar buah gaya stiker. `size` dalam piksel.
// Tanpa `decorative`, gambar diberi role="img" dan aria-label nama buah.
function FruitImage({ fruitId, size = 40, label, decorative = false, className = '' }) {
  const a11y = decorative
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': label ?? getFruit(fruitId).name }

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      {...a11y}
    >
      <g className="stroke-tinta" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
        {ART[fruitId]}
      </g>
    </svg>
  )
}

export default FruitImage
