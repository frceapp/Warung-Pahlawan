import { useId } from 'react'
import { CHARACTERS } from '../data/characters.js'

// Avatar tokoh: ilustrasi kartun sederhana buatan sendiri, dikenali lewat
// ciri di tabel tokoh AGENTS.md. Wajah dibuat ramah dan tidak dilebih-lebihkan.

const PECI = (
  <path className="fill-tinta" d="M32 36 L34 19 C 42 15 58 15 66 19 L68 36 C 56 32 44 32 32 36 Z" />
)

const ROUND_GLASSES = (
  <g className="fill-none" strokeWidth="2.2">
    <circle cx="42" cy="46" r="6" />
    <circle cx="58" cy="46" r="6" />
    <path d="M48 45 Q50 43 52 45" />
  </g>
)

const SUIT_LAPELS = (
  <g className="fill-none" strokeWidth="2.5">
    <path d="M42 72 L50 90 L58 72" />
    <path d="M36 76 L46 96" />
    <path d="M64 76 L54 96" />
  </g>
)

const TIE = <path className="fill-tinta" d="M48 74 L52 74 L54 92 L50 96 L46 92 Z" strokeWidth="2" />

// Tiap tokoh: `back` digambar di belakang kepala, `body` pakaian,
// `front` di depan wajah (rambut, penutup kepala, kacamata, kumis).
const LOOKS = {
  kartini: {
    back: (
      <>
        <ellipse className="fill-tinta" cx="50" cy="24" rx="10" ry="7" />
        <ellipse className="fill-tinta" cx="50" cy="42" rx="20" ry="18" />
      </>
    ),
    body: (
      <>
        <path className="fill-kapur" d="M14 100 C 14 78 30 70 50 70 C 70 70 86 78 86 100 Z" />
        <path className="fill-kayu" d="M42 70 L50 84 L58 70 Z" strokeWidth="2.5" />
        <g className="fill-pisang" strokeWidth="1.8">
          <circle cx="50" cy="88" r="2.6" />
          <circle cx="50" cy="96" r="2.6" />
        </g>
      </>
    ),
    front: (
      <path
        className="fill-tinta"
        d="M33 44 C 32 30 40 25 50 25 C 60 25 68 30 67 44 C 63 36 57 32 50 33 C 43 32 37 36 33 44 Z"
      />
    ),
  },
  soekarno: {
    back: null,
    body: (
      <>
        <path className="fill-kapur" d="M14 100 C 14 78 30 70 50 70 C 70 70 86 78 86 100 Z" />
        {TIE}
        {SUIT_LAPELS}
      </>
    ),
    front: (
      <>
        <path className="fill-tinta" d="M33 36 L33 44 L36 44 L36 35 Z" strokeWidth="2" />
        <path className="fill-tinta" d="M67 36 L67 44 L64 44 L64 35 Z" strokeWidth="2" />
        {PECI}
      </>
    ),
  },
  hatta: {
    back: null,
    body: (
      <>
        <path className="fill-terpal" d="M14 100 C 14 78 30 70 50 70 C 70 70 86 78 86 100 Z" />
        <path className="fill-kapur" d="M42 70 L50 88 L58 70 Z" strokeWidth="2.5" />
        {TIE}
        {SUIT_LAPELS}
      </>
    ),
    front: (
      <>
        <path
          className="fill-tinta"
          d="M33 42 C 32 28 42 25 52 26 C 62 26 68 31 67 42 C 63 35 54 31 44 33 C 39 34 35 37 33 42 Z"
        />
        {ROUND_GLASSES}
      </>
    ),
  },
  dewantara: {
    back: null,
    body: (
      <>
        <path className="fill-terpal-tua" d="M14 100 C 14 78 30 70 50 70 C 70 70 86 78 86 100 Z" />
        <path className="fill-none" d="M50 72 L50 100" strokeWidth="2.5" />
        <g className="fill-kapur" strokeWidth="1.5">
          <circle cx="54" cy="80" r="1.8" />
          <circle cx="54" cy="89" r="1.8" />
        </g>
      </>
    ),
    front: (
      <>
        {PECI}
        {ROUND_GLASSES}
        <path
          className="fill-tinta"
          d="M42 56 C 45 52 48 52 50 54 C 52 52 55 52 58 56 C 54 57 52 57 50 56 C 48 57 46 57 42 56 Z"
          strokeWidth="1.5"
        />
      </>
    ),
    mouthY: 60,
  },
  'cut-nyak-dhien': {
    back: (
      <>
        <circle className="fill-daun" cx="50" cy="22" r="9" />
        <path className="fill-daun" d="M30 50 C 27 28 39 19 50 19 C 61 19 73 28 70 50 L78 100 L22 100 Z" />
      </>
    ),
    body: (
      <>
        <path className="fill-tinta" d="M18 100 C 18 80 32 72 50 72 C 68 72 82 80 82 100 Z" />
        <path className="fill-daun" d="M30 72 C 36 80 38 90 36 100 L26 100 C 26 88 26 80 30 72 Z" />
        <path className="fill-daun" d="M70 72 C 64 80 62 90 64 100 L74 100 C 74 88 74 80 70 72 Z" />
      </>
    ),
    front: (
      <>
        <path className="fill-tinta" d="M34 40 C 38 33 62 33 66 40 L66 36 C 60 30 40 30 34 36 Z" strokeWidth="2" />
        <path className="fill-daun" d="M33 38 C 33 25 41 21 50 21 C 59 21 67 25 67 38 C 60 31 40 31 33 38 Z" />
      </>
    ),
  },
  diponegoro: {
    back: null,
    body: (
      <>
        <path className="fill-kapur" d="M14 100 C 14 78 30 70 50 70 C 70 70 86 78 86 100 Z" />
        <path className="fill-none" d="M43 70 L50 80 L57 70" strokeWidth="2.5" />
        <path className="fill-daun" d="M24 80 L32 76 L74 100 L60 100 Z" strokeWidth="2.5" />
      </>
    ),
    front: (
      <>
        <path
          className="fill-kapur"
          d="M30 38 C 27 20 40 12 50 12 C 60 12 73 20 70 38 C 62 33 38 33 30 38 Z"
        />
        <g className="fill-none" strokeWidth="2">
          <path d="M33 30 C 42 22 58 20 67 26" />
          <path d="M32 22 C 42 18 56 16 64 19" />
        </g>
      </>
    ),
  },
  sudirman: {
    back: null,
    body: (
      <>
        <path className="fill-daun" d="M12 100 C 12 78 30 69 50 69 C 70 69 88 78 88 100 Z" />
        <path className="fill-daun" d="M38 70 L50 84 L44 92 L32 74 Z" strokeWidth="2.5" />
        <path className="fill-daun" d="M62 70 L50 84 L56 92 L68 74 Z" strokeWidth="2.5" />
        <g className="fill-pisang" strokeWidth="1.5">
          <circle cx="44" cy="96" r="2" />
          <circle cx="56" cy="96" r="2" />
        </g>
      </>
    ),
    front: (
      <>
        <circle className="fill-tinta" cx="68" cy="38" r="5" />
        <path
          className="fill-tinta"
          d="M32 40 C 31 25 40 20 50 20 C 60 20 69 25 68 40 C 60 35 40 35 32 40 Z"
        />
        <g className="fill-kayu" stroke="none">
          <circle cx="42" cy="28" r="1.6" />
          <circle cx="50" cy="25" r="1.6" />
          <circle cx="58" cy="28" r="1.6" />
          <circle cx="46" cy="33" r="1.6" />
          <circle cx="54" cy="33" r="1.6" />
        </g>
      </>
    ),
  },
  pattimura: {
    back: <ellipse className="fill-tinta" cx="50" cy="40" rx="21" ry="19" />,
    body: (
      <>
        <path className="fill-kapur" d="M14 100 C 14 78 30 70 50 70 C 70 70 86 78 86 100 Z" />
        <path className="fill-kayu" d="M44 70 L50 82 L56 70 Z" strokeWidth="2.5" />
      </>
    ),
    front: (
      <>
        <path
          className="fill-tinta"
          d="M33 40 C 31 27 40 22 50 22 C 60 22 69 27 67 40 C 64 36 58 34 50 34 C 42 34 36 36 33 40 Z"
        />
        <path className="fill-cabai" d="M32 36 C 40 31 60 31 68 36 L68 42 C 60 37 40 37 32 42 Z" />
        <path className="fill-cabai" d="M67 38 L78 34 L76 42 Z" strokeWidth="2.5" />
        <path className="fill-cabai" d="M67 40 L77 48 L70 50 Z" strokeWidth="2.5" />
      </>
    ),
  },
}

// `size` dalam piksel. Tanpa `decorative`, gambar diberi role="img" dan
// aria-label nama tokoh.
function CharacterAvatar({ characterId, size = 40, label, decorative = false, className = '' }) {
  // Hanya huruf, angka, - dan _ supaya aman dipakai di url(#...).
  const clipId = `avatar-clip-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const look = LOOKS[characterId]
  const character = CHARACTERS.find((item) => item.id === characterId)
  if (!look || !character) throw new Error(`Unknown character: ${characterId}`)
  const mouthY = look.mouthY ?? 55

  const a11y = decorative
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': label ?? character.name }

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} {...a11y}>
      <defs>
        <clipPath id={clipId}>
          <circle cx="50" cy="50" r="46" />
        </clipPath>
      </defs>
      <circle className="fill-langit" cx="50" cy="50" r="46" />
      <g
        className="stroke-tinta"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        clipPath={`url(#${clipId})`}
      >
        {look.back}
        <rect className="fill-kayu" x="44" y="58" width="12" height="14" />
        {look.body}
        <ellipse className="fill-kayu" cx="50" cy="46" rx="17" ry="19" />
        <g className="fill-tinta" stroke="none">
          <circle cx="42" cy="46" r="2.3" />
          <circle cx="58" cy="46" r="2.3" />
        </g>
        <path
          className="fill-none"
          d={`M44 ${mouthY} Q50 ${mouthY + 4} 56 ${mouthY}`}
          strokeWidth="2.2"
        />
        {look.front}
      </g>
      <circle className="fill-none stroke-tinta" cx="50" cy="50" r="46" strokeWidth="4" />
    </svg>
  )
}

export default CharacterAvatar
