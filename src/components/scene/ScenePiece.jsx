// Satu potongan latar warung (rak, toples, lampu, lapak, dan lain-lain),
// digambar sebagai SVG bergaris tepi tebal seperti stiker. Dipakai oleh
// WarungScene; isi tiap level ada di decor/levelN.js. Semua potongan diam
// (tanpa animasi) dan hanya hiasan.

const INK = 'var(--color-tinta)'
const C = {
  terpal: 'var(--color-terpal)',
  jingga: 'var(--color-jingga)',
  pisang: 'var(--color-pisang)',
  kapur: 'var(--color-kapur)',
  langit: 'var(--color-langit)',
  daun: 'var(--color-daun)',
  kayu: 'var(--color-kayu)',
}
const LINE = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' }
const THIN = { ...LINE, strokeWidth: 1.5 }
const HEADING = { fontFamily: 'var(--font-heading)' }
const LIDS = [C.jingga, C.terpal, C.daun, C.pisang]

// Barang di rak. x: kiri barang, b: garis bawah (permukaan papan rak).
function good(kind, x, b, index) {
  const key = `${kind}-${index}`
  switch (kind) {
    case 'jar':
      return (
        <g key={key}>
          <rect x={x + 3} y={b - 30} width={24} height={30} rx={6} fill={C.kapur} {...LINE} />
          <rect x={x + 5} y={b - 36} width={20} height={7} rx={2} fill={LIDS[index % 4]} {...LINE} />
          <circle cx={x + 11} cy={b - 11} r={4} fill={C.pisang} {...THIN} />
          <circle cx={x + 19} cy={b - 17} r={4} fill={C.jingga} {...THIN} />
          <circle cx={x + 18} cy={b - 7} r={3} fill={C.daun} {...THIN} />
        </g>
      )
    case 'box':
      return (
        <g key={key}>
          <rect x={x} y={b - 26} width={30} height={26} fill={C.kayu} {...LINE} />
          <path d={`M${x + 15} ${b - 26}v10`} {...LINE} />
        </g>
      )
    case 'sack':
      return (
        <path
          key={key}
          d={`M${x + 4} ${b}C${x} ${b - 16} ${x + 5} ${b - 28} ${x + 10} ${b - 32}H${x + 20}C${x + 25} ${b - 28} ${x + 30} ${b - 16} ${x + 26} ${b}Z`}
          fill={C.kapur}
          {...LINE}
        />
      )
    case 'bottle':
      return (
        <g key={key}>
          <rect x={x + 11} y={b - 38} width={8} height={10} fill={C.kapur} {...LINE} />
          <rect x={x + 7} y={b - 30} width={16} height={30} rx={4} fill={C.daun} {...LINE} />
          <rect x={x + 7} y={b - 20} width={16} height={8} fill={C.kapur} {...THIN} />
        </g>
      )
    case 'can':
      return (
        <g key={key}>
          <rect x={x + 5} y={b - 24} width={20} height={24} rx={3} fill={C.terpal} {...LINE} />
          <rect x={x + 5} y={b - 17} width={20} height={8} fill={C.pisang} {...THIN} />
        </g>
      )
    default:
      return (
        <g key={key}>
          <circle cx={x + 8} cy={b - 8} r={7} fill={C.jingga} {...LINE} />
          <circle cx={x + 22} cy={b - 8} r={7} fill={C.jingga} {...LINE} />
          <circle cx={x + 15} cy={b - 19} r={7} fill={C.jingga} {...LINE} />
        </g>
      )
  }
}

// Rak dinding bertingkat. tiers: daftar barang per tingkat, dari atas.
function drawShelf({ tiers }) {
  const width = Math.max(...tiers.map((tier) => tier.length)) * 34 + 20
  const height = tiers.length * 48 + 6
  return {
    width,
    height,
    content: (
      <>
        {tiers.map((tier, row) => {
          const base = 48 * (row + 1) - 8
          return (
            <g key={row}>
              {tier.map((kind, index) => good(kind, 10 + index * 34, base, index + row))}
              <rect x={2} y={base} width={width - 4} height={8} rx={2} fill={C.kayu} {...LINE} />
              <path d={`M14 ${base + 8}v8l10-8M${width - 14} ${base + 8}v8l-10-8`} fill={C.kayu} {...LINE} />
            </g>
          )
        })}
      </>
    ),
  }
}

// Tandan pisang yang digantung dengan tali.
function drawBananas() {
  return {
    width: 60,
    height: 96,
    content: (
      <>
        <path d="M30 0v26" {...LINE} />
        <rect x={26} y={22} width={8} height={12} rx={2} fill={C.kayu} {...LINE} />
        {[-34, -16, 2, 20, 38].map((angle) => (
          <path
            key={angle}
            transform={`rotate(${angle} 30 34)`}
            d="M29 34C23 46 20 64 26 82C31 77 34 58 34 36Z"
            fill={C.pisang}
            {...LINE}
          />
        ))}
      </>
    ),
  }
}

// Lampu gantung. lit: menyala hangat (cahaya diam, tanpa kedip).
function drawLamp({ lit = false }) {
  return {
    width: 100,
    height: 110,
    content: (
      <>
        {lit && <circle cx={50} cy={72} r={42} fill={C.pisang} opacity={0.45} />}
        <path d="M50 0v42" {...LINE} />
        <circle cx={50} cy={66} r={9} fill={lit ? C.pisang : C.kapur} {...LINE} />
        <path d="M28 64L38 40H62L72 64Z" fill={C.jingga} {...LINE} />
      </>
    ),
  }
}

function drawCalendar() {
  const cells = []
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const marked = row === 1 && col === 2
      cells.push(
        <rect
          key={`${row}-${col}`}
          x={11 + col * 10}
          y={36 + row * 10}
          width={7}
          height={7}
          fill={marked ? C.jingga : 'none'}
          {...THIN}
        />,
      )
    }
  }
  return {
    width: 60,
    height: 74,
    content: (
      <>
        <path d="M30 5L14 16M30 5L46 16" {...THIN} />
        <circle cx={30} cy={5} r={3} fill={INK} />
        <rect x={6} y={14} width={48} height={56} rx={3} fill={C.kapur} {...LINE} />
        <rect x={6} y={14} width={48} height={14} fill={C.terpal} {...LINE} />
        {cells}
      </>
    ),
  }
}

// Poster kecil bergambar jeruk.
function drawPoster() {
  return {
    width: 56,
    height: 72,
    content: (
      <>
        <rect x={4} y={4} width={48} height={64} rx={2} fill={C.kapur} {...LINE} />
        <circle cx={28} cy={30} r={12} fill={C.jingga} {...LINE} />
        <path d="M28 18c2-6 8-8 12-6c-2 5-7 7-12 6Z" fill={C.daun} {...THIN} />
        <path d="M14 52H42M18 60H38" {...LINE} />
      </>
    ),
  }
}

// Spanduk kecil bertali.
function drawBanner({ text }) {
  return {
    width: 240,
    height: 64,
    content: (
      <>
        <path d="M4 6Q120 18 236 6" fill="none" {...THIN} />
        <rect x={14} y={12} width={212} height={44} rx={4} fill={C.pisang} {...LINE} />
        <text x={120} y={44} textAnchor="middle" fontSize={24} fill={INK} style={HEADING}>
          {text}
        </text>
      </>
    ),
  }
}

// Papan nama warung, dicat tangan. lines: satu atau dua baris teks.
function drawSign({ lines }) {
  const twoLines = lines.length > 1
  const width = twoLines ? 150 : 280
  const height = twoLines ? 92 : 76
  return {
    width,
    height,
    content: (
      <>
        <path d={`M${width * 0.2} 0v12M${width * 0.8} 0v12`} {...LINE} />
        <g transform={`rotate(-2 ${width / 2} ${height / 2})`}>
          <rect x={6} y={10} width={width - 12} height={height - 14} rx={12} fill={C.terpal} {...LINE} strokeWidth={4} />
          {lines.map((line, index) => (
            <text
              key={line}
              x={width / 2}
              y={twoLines ? 44 + index * 32 : 52}
              textAnchor="middle"
              fontSize={twoLines ? 26 : 30}
              fill={C.kapur}
              style={HEADING}
            >
              {line}
            </text>
          ))}
        </g>
      </>
    ),
  }
}

// Lapak pasar kecil: atap bergaris, tiang, meja dengan tumpukan buah.
function drawStall() {
  const stripes = [0, 1, 2, 3, 4].map((index) => {
    const top = 6 + index * 29.6
    const bottom = index * 32
    return (
      <path
        key={index}
        d={`M${top} 8H${top + 29.6}L${bottom + 32} 36H${bottom}Z`}
        fill={index % 2 ? C.jingga : C.terpal}
      />
    )
  })
  return {
    width: 160,
    height: 124,
    content: (
      <>
        <rect x={14} y={34} width={8} height={86} fill={C.kayu} {...LINE} />
        <rect x={138} y={34} width={8} height={86} fill={C.kayu} {...LINE} />
        {stripes}
        <path d="M6 8H154L160 36H0Z" fill="none" {...LINE} />
        <circle cx={42} cy={76} r={8} fill={C.jingga} {...LINE} />
        <circle cx={56} cy={76} r={8} fill={C.jingga} {...LINE} />
        <circle cx={49} cy={64} r={8} fill={C.jingga} {...LINE} />
        <circle cx={96} cy={76} r={8} fill={C.daun} {...LINE} />
        <circle cx={110} cy={76} r={8} fill={C.daun} {...LINE} />
        <path d="M70 84C72 70 82 66 88 70C82 72 78 78 78 84Z" fill={C.pisang} {...LINE} />
        <rect x={6} y={84} width={148} height={14} rx={2} fill={C.kayu} {...LINE} />
        <rect x={30} y={98} width={40} height={22} fill={C.kayu} {...LINE} />
      </>
    ),
  }
}

// Bendera kecil warna-warni sepanjang lebar layar (pola yang diulang).
function drawFlags() {
  const colors = [C.jingga, C.pisang, C.daun, C.terpal]
  return {
    stretch: true,
    content: (
      <>
        <defs>
          <pattern id="scene-flags" width="96" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 4H96" {...THIN} />
            {colors.map((color, index) => (
              <path
                key={color}
                d={`M${4 + index * 24} 4H${22 + index * 24}L${13 + index * 24} 28Z`}
                fill={color}
                {...THIN}
              />
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="40" fill="url(#scene-flags)" />
      </>
    ),
  }
}

// Karung beras di lantai.
function drawSacks() {
  return {
    width: 100,
    height: 66,
    content: (
      <>
        {[0, 48].map((x) => (
          <g key={x}>
            <path
              d={`M${x + 6} 62C${x + 1} 42 ${x + 4} 20 ${x + 12} 12H${x + 38}C${x + 46} 20 ${x + 49} 42 ${x + 44} 62Z`}
              fill={C.kapur}
              {...LINE}
            />
            <path d={`M${x + 12} 12C${x + 20} 18 ${x + 30} 18 ${x + 38} 12`} fill="none" {...THIN} />
            <rect x={x + 15} y={32} width={20} height={14} fill={C.langit} {...THIN} />
          </g>
        ))}
      </>
    ),
  }
}

// Tumpukan kardus.
function drawCrates() {
  return {
    width: 84,
    height: 76,
    content: (
      <>
        <rect x={4} y={40} width={38} height={34} fill={C.kayu} {...LINE} />
        <rect x={42} y={40} width={38} height={34} fill={C.kayu} {...LINE} />
        <rect x={20} y={8} width={44} height={32} fill={C.kayu} {...LINE} />
        <path d="M23 40v10M61 40v10M42 8v10" {...LINE} />
      </>
    ),
  }
}

const DRAW = {
  shelf: drawShelf,
  bananas: drawBananas,
  lamp: drawLamp,
  calendar: drawCalendar,
  poster: drawPoster,
  banner: drawBanner,
  sign: drawSign,
  stall: drawStall,
  flags: drawFlags,
  sacks: drawSacks,
  crates: drawCrates,
}

function ScenePiece({ piece, ...props }) {
  const draw = DRAW[piece]
  if (!draw) return null
  const { width, height, stretch = false, content } = draw(props)
  if (stretch) {
    return (
      <svg className="block h-8 w-full md:h-10" focusable="false">
        {content}
      </svg>
    )
  }
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="block h-auto w-full overflow-visible"
      focusable="false"
    >
      {content}
    </svg>
  )
}

export default ScenePiece
