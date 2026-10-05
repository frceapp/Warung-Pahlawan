// Potongan bentuk untuk rangka karakter anime (viewBox 0 0 100 140).
// Tiap fungsi menerima data penampilan dari characterLooks.js dan
// mengembalikan bentuk SVG untuk satu lapisan rangka. Garis tepi (tinta,
// tebal) diatur sekali di AnimeCharacter.

// Nama token desain menjadi warna CSS; kode hex dipakai apa adanya.
export function paint(color) {
  return color.startsWith('#') ? color : `var(--color-${color})`
}

const has = (look, accessory) => look.accessories.includes(accessory)

// viewBox karakter: sedikit dipotong di atas dan bawah supaya gambar mengisi
// kotaknya (bagian yang lewat batas tetap tampil, overflow visible).
export const VIEW_BOX = { x: 0, y: 4, width: 100, height: 132 }

// Titik sendi dan titik putar bagian rangka, dalam koordinat gambar. Dipakai
// AnimeCharacter sebagai transform-origin animasi Motion.
export const JOINTS = {
  hipBack: [44, 100],
  hipFront: [56, 100],
  shoulderBack: [32, 77],
  shoulderFront: [68, 77],
  neck: [50, 70],
  hairTop: [50, 24],
  waist: [50, 101],
  browBack: [39, 37],
  browFront: [61, 37],
  mouth: [50, 58],
}

// --- Kepala ---------------------------------------------------------------

export const FACE_PATH =
  'M24 46 C24 29 36 21 50 21 C64 21 76 29 76 46 C76 60 66 70 50 70 C34 70 24 60 24 46 Z'

export function hairBack(look) {
  const fill = paint('tinta')
  switch (look.hair) {
    case 'sanggul':
      return (
        <>
          <circle cx="50" cy="16" r="9" fill={fill} />
          <ellipse cx="50" cy="42" rx="28" ry="25" fill={fill} />
        </>
      )
    case 'panjang':
      return (
        <path
          fill={fill}
          d="M23 42 C21 24 35 16 50 16 C65 16 79 24 77 42 L80 80 C70 84 30 84 20 80 Z"
        />
      )
    case 'tertutup':
      return null
    default:
      return <ellipse cx="50" cy="42" rx="27" ry="24" fill={fill} />
  }
}

export function hairFront(look) {
  const fill = paint('tinta')
  switch (look.hair) {
    case 'sanggul':
      return (
        <>
          <path
            fill={fill}
            d="M23 48 C21 27 35 18 50 19 C65 18 79 27 77 48 C73 37 63 30 51 31 L50 25 L49 31 C37 30 27 37 23 48 Z"
          />
        </>
      )
    case 'belah-samping':
      return (
        <path
          fill={fill}
          d="M23 45 C21 26 36 18 53 19 C67 19 79 27 77 45 C73 35 60 29 41 34 C33 36 27 39 23 45 Z"
        />
      )
    case 'panjang':
      return (
        <path
          fill={fill}
          d="M23 46 C21 27 35 18 50 18 C65 18 79 27 77 46 C73 37 66 32 58 31 L54 36 L50 31 L46 36 L42 31 C34 32 27 37 23 46 Z"
        />
      )
    case 'tertutup':
      return null
    default:
      return (
        <path
          fill={fill}
          d="M24 43 C23 26 36 19 50 19 C64 19 77 26 76 43 C70 34 61 30 50 31 C39 30 30 34 24 43 Z"
        />
      )
  }
}

// Penutup kepala dan kain di belakang kepala (di belakang badan).
export function headwearBack(look) {
  if (has(look, 'selendang')) {
    return (
      <path
        fill={paint('daun')}
        d="M20 48 C17 23 35 12 50 12 C65 12 83 23 80 48 L84 94 C68 98 32 98 16 94 Z"
      />
    )
  }
  return null
}

// Penutup kepala di depan rambut.
export function headwear(look) {
  if (has(look, 'peci')) {
    return (
      <path
        fill={paint('tinta')}
        d="M26 31 L28 13 C37 8 63 8 72 13 L74 31 C61 27 39 27 26 31 Z"
      />
    )
  }
  if (has(look, 'sorban')) {
    return (
      <>
        <path
          fill={paint('kapur')}
          d="M21 36 C16 13 36 4 50 4 C64 4 84 13 79 36 C66 29 34 29 21 36 Z"
        />
        <g fill="none" strokeWidth="2">
          <path d="M25 26 C38 16 62 14 76 22" />
          <path d="M28 15 C40 9 58 8 70 13" />
        </g>
      </>
    )
  }
  if (has(look, 'blangkon')) {
    return (
      <>
        <circle cx="75" cy="38" r="6" fill={paint('tinta')} />
        <path
          fill={paint('tinta')}
          d="M22 38 C20 18 36 10 50 10 C64 10 80 18 78 38 C66 31 34 31 22 38 Z"
        />
        <g fill={paint('kayu')} stroke="none">
          <circle cx="38" cy="22" r="1.8" />
          <circle cx="50" cy="18" r="1.8" />
          <circle cx="62" cy="22" r="1.8" />
          <circle cx="44" cy="28" r="1.8" />
          <circle cx="56" cy="28" r="1.8" />
        </g>
      </>
    )
  }
  if (has(look, 'ikat-kepala')) {
    return (
      <>
        <path fill={paint('cabai')} d="M76 32 L88 28 L85 37 Z" strokeWidth="2.4" />
        <path fill={paint('cabai')} d="M76 34 L87 42 L79 44 Z" strokeWidth="2.4" />
        <path
          fill={paint('cabai')}
          d="M22 33 C36 25 64 25 78 33 L78 40 C64 32 36 32 22 40 Z"
        />
      </>
    )
  }
  if (has(look, 'selendang')) {
    return (
      <path
        fill={paint('daun')}
        d="M23 48 C21 27 35 17 50 17 C65 17 79 27 77 48 C73 35 63 28 50 28 C37 28 27 35 23 48 Z"
      />
    )
  }
  return null
}

// Aksesori yang menempel di wajah (ikut bergeser saat menoleh).
export function faceAccessories(look) {
  return (
    <>
      {has(look, 'kumis') && (
        <path
          fill={paint('tinta')}
          d="M42 57 C45 53 48 53 50 55 C52 53 55 53 58 57 C54 58 52 58 50 57 C48 58 46 58 42 57 Z"
          strokeWidth="1.5"
        />
      )}
      {has(look, 'kacamata') && (
        <g fill="none" strokeWidth="2.2">
          <circle cx="40" cy="49" r="8" />
          <circle cx="60" cy="49" r="8" />
          <path d="M48 48 Q50 46 52 48" />
        </g>
      )}
    </>
  )
}

// --- Badan ----------------------------------------------------------------

const TORSO_PATH = 'M34 80 C34 73 41 71 50 71 C59 71 66 73 66 80 L68 104 L32 104 Z'

export function torso(look) {
  const { style, top, accent } = look.outfit
  const neck = <rect x="45" y="64" width="10" height="10" fill={paint(look.skin)} />
  const base = <path d={TORSO_PATH} fill={paint(top)} />
  switch (style) {
    case 'kebaya':
      return (
        <>
          {neck}
          <path d="M34 80 C34 73 41 71 50 71 C59 71 66 73 66 80 L69 108 C60 104 40 104 31 108 Z" fill={paint(top)} />
          <path d="M44 72 L50 88 L56 72 Z" fill={paint(accent)} strokeWidth="2.2" />
          {has(look, 'bros') && (
            <g fill={paint('pisang')} strokeWidth="1.6">
              <circle cx="50" cy="92" r="2.6" />
              <circle cx="50" cy="99" r="2" />
            </g>
          )}
        </>
      )
    case 'jas':
      return (
        <>
          {neck}
          {base}
          <path d="M45 72 L50 83 L55 72 Z" fill={paint('kapur')} strokeWidth="2" />
          <path d="M48.5 75 L51.5 75 L53 89 L50 92 L47 89 Z" fill={paint(accent)} strokeWidth="1.6" />
          <g fill="none" strokeWidth="2">
            <path d="M43 72 L49 92" />
            <path d="M57 72 L51 92" />
          </g>
        </>
      )
    case 'beskap':
      return (
        <>
          {neck}
          {base}
          <path d="M50 72 L57 104" fill="none" strokeWidth="2" />
          <g fill={paint(accent)} strokeWidth="1.4">
            <circle cx="56" cy="82" r="1.8" />
            <circle cx="57.5" cy="90" r="1.8" />
            <circle cx="59" cy="98" r="1.8" />
          </g>
        </>
      )
    case 'kurung':
      return (
        <>
          {neck}
          {base}
          <path d="M45 72 Q50 77 55 72" fill="none" strokeWidth="2" />
        </>
      )
    case 'jubah':
      return (
        <>
          {neck}
          {base}
          <path d="M44 72 L50 81 L56 72" fill="none" strokeWidth="2" />
          <path d="M35 77 L41 74 L67 101 L60 104 Z" fill={paint(accent)} strokeWidth="2.2" />
        </>
      )
    case 'mantel':
      return (
        <>
          {neck}
          {base}
          <path d="M41 72 L50 83 L59 72" fill="none" strokeWidth="2.2" />
          <g fill={paint(accent)} strokeWidth="1.4">
            <circle cx="45" cy="88" r="1.8" />
            <circle cx="55" cy="88" r="1.8" />
            <circle cx="45" cy="97" r="1.8" />
            <circle cx="55" cy="97" r="1.8" />
          </g>
        </>
      )
    default:
      return (
        <>
          {neck}
          {base}
          <path d="M44 72 L50 79 L56 72" fill="none" strokeWidth="2" />
          <path d="M32 95 L68 95 L68 102 L32 102 Z" fill={paint(accent)} strokeWidth="2" />
        </>
      )
  }
}

// Kain yang menjuntai di depan pundak (selendang).
export function shoulderDrape(look) {
  if (!has(look, 'selendang')) return null
  return (
    <path
      fill={paint('daun')}
      d="M29 74 C35 66 65 66 71 74 L74 90 C63 82 37 82 26 90 Z"
    />
  )
}

// Bagian bawah baju yang panjang (kain, rok, jubah, mantel). Digambar di
// depan kaki dan bergoyang mengikuti langkah.
export function cloth(look) {
  const { style, bottom, top, accent } = look.outfit
  switch (style) {
    case 'kebaya':
      return (
        <>
          <path d="M33 102 L67 102 L69 131 L31 131 Z" fill={paint(bottom)} />
          <g fill="none" strokeWidth="1.6">
            <path d="M35 111 Q42 107 50 111 Q58 115 65 111" />
            <path d="M34 121 Q42 117 50 121 Q58 125 66 121" />
            <path d="M52 102 L54 131" />
          </g>
        </>
      )
    case 'kurung':
      return (
        <>
          <path d="M33 101 L67 101 L69 131 L31 131 Z" fill={paint(bottom)} />
          <path d="M31 126 L69 126" fill="none" stroke={paint(accent)} strokeWidth="2.4" />
        </>
      )
    case 'jubah':
      return <path d="M32 100 L68 100 L71 131 L29 131 Z" fill={paint(top)} />
    case 'mantel':
      return (
        <>
          <path d="M32 100 L68 100 L70 117 L30 117 Z" fill={paint(top)} />
          <path d="M50 100 L50 117" fill="none" strokeWidth="2" />
        </>
      )
    default:
      return null
  }
}

export function sleeveColor(look) {
  return paint(look.outfit.top)
}

export function legColor(look) {
  return paint(look.outfit.bottom)
}
