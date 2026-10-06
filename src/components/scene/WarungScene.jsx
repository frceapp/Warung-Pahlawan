import { use } from 'react'
import { loadDecor } from './loadDecor.js'
import ScenePiece from './ScenePiece.jsx'

// Latar warung di belakang layar main: dinding dan hiasan, difoto dari dekat
// (hiasan besar dan terpotong di tepi layar). Meja kasir adalah bagian layar
// main sendiri (PlayScreen), jadi tidak ada lantai atau meja di sini. Ketiga
// level memakai komponen ini dengan data dekorasi berbeda (decor/levelN.js).
// Latar hanya hiasan: aria-hidden, tidak bisa difokus, tidak menerima klik,
// dan diam (tanpa animasi yang berjalan terus).
//
// Data dekorasi:
// - wall: 'planks' | 'plain' | 'market'
// - items: { piece, props, show, pos }. `show` menentukan di lebar layar mana
//   hiasan tampil; `pos` berisi l/r/t/w untuk HP dengan akhiran -md dan -lg
//   untuk layar lebih lebar (lihat utilitas scene-item).
const WALL = {
  planks: 'scene-wall-planks',
  plain: 'scene-wall-plain',
  market: 'scene-wall-market',
}
const SHOW = {
  all: '',
  mobile: 'md:hidden',
  sm: 'hidden sm:block',
  md: 'hidden md:block',
  mdOnly: 'hidden md:block lg:hidden',
  lg: 'hidden lg:block',
  xl: 'hidden xl:block',
}

function positionStyle(pos = {}) {
  return Object.fromEntries(Object.entries(pos).map(([key, value]) => [`--${key}`, value]))
}

function WarungScene({ levelId }) {
  const decor = use(loadDecor(levelId))

  return (
    <div
      aria-hidden="true"
      data-warung-scene={levelId}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
    >
      <div className={`absolute inset-0 ${WALL[decor.wall] ?? WALL.plain}`} />
      <div className="absolute inset-0 opacity-55">
        {decor.items.map((item, index) => (
          <div
            key={`${item.piece}-${index}`}
            className={`scene-item ${SHOW[item.show] ?? ''}`}
            style={positionStyle(item.pos)}
          >
            <ScenePiece piece={item.piece} {...item.props} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default WarungScene
