import { use } from 'react'
import { loadDecor } from './loadDecor.js'
import ScenePiece from './ScenePiece.jsx'

// Latar warung di belakang layar main: dinding, lantai, hiasan, dan meja
// kasir. Ketiga level memakai komponen ini dengan data dekorasi berbeda
// (decor/levelN.js). Latar hanya hiasan: aria-hidden, tidak bisa difokus,
// tidak menerima klik, dan diam (tanpa animasi yang berjalan terus).
//
// Data dekorasi:
// - wall: 'planks' | 'plain' | 'market', floor: 'planks' | 'tiles' | 'concrete'
// - wainscot: lis dinding di atas lantai
// - items: { piece, props, show, greet, pos }. `show` menentukan di lebar
//   layar mana hiasan tampil; `greet`: hanya di langkah Sapa (di langkah lain
//   tempatnya tertutup meja kasir); `pos` berisi l/r/t/w untuk HP dengan
//   akhiran -md dan -lg untuk layar lebih lebar (lihat utilitas scene-item).
const WALL = {
  planks: 'scene-wall-planks',
  plain: 'scene-wall-plain',
  market: 'scene-wall-market',
}
const FLOOR = {
  planks: 'scene-floor-planks',
  tiles: 'scene-floor-tiles',
  concrete: 'scene-floor-concrete',
}
const SHOW = {
  all: '',
  mobile: 'md:hidden',
  sm: 'hidden sm:block',
  md: 'hidden md:block',
  lg: 'hidden lg:block',
  xl: 'hidden xl:block',
}

// Garis lantai sedikit di atas kaki pembeli di langkah Sapa (karakter berdiri
// di lantai). Meja kasir di bawah, sebagian tertutup bar aksi.
const FLOOR_TOP = 'top-[236px] md:top-[396px]'
const WAINSCOT = 'top-[200px] h-9 md:top-[350px] md:h-11'
const COUNTER = 'h-[150px] md:h-[200px]'

function positionStyle(pos = {}) {
  return Object.fromEntries(Object.entries(pos).map(([key, value]) => [`--${key}`, value]))
}

function WarungScene({ levelId, greeting = false }) {
  const decor = use(loadDecor(levelId))

  return (
    <div
      aria-hidden="true"
      data-warung-scene={levelId}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
    >
      <div className={`absolute inset-0 ${WALL[decor.wall] ?? WALL.plain}`} />
      {decor.wainscot && (
        <div className={`absolute inset-x-0 border-y-4 border-tinta/25 scene-wainscot ${WAINSCOT}`} />
      )}
      <div
        className={`absolute inset-x-0 bottom-0 border-t-4 border-tinta/40 ${FLOOR_TOP} ${FLOOR[decor.floor] ?? FLOOR.tiles}`}
      />
      <div className="absolute inset-0 opacity-55">
        {decor.items.map((item, index) =>
          item.greet && !greeting ? null : (
            <div
              key={`${item.piece}-${index}`}
              className={`scene-item ${SHOW[item.show] ?? ''}`}
              style={positionStyle(item.pos)}
            >
              <ScenePiece piece={item.piece} {...item.props} />
            </div>
          ),
        )}
      </div>
      <div className={`scene-counter absolute inset-x-0 bottom-0 border-t-4 border-tinta ${COUNTER}`}>
        <div className="h-3 border-b-4 border-tinta/40 bg-kapur/25" />
      </div>
    </div>
  )
}

export default WarungScene
