import Awning from '../components/Awning.jsx'
import CharacterAvatar from '../components/CharacterAvatar.jsx'
import FruitImage from '../components/FruitImage.jsx'
import { CHARACTERS } from '../data/characters.js'
import { FRUITS } from '../data/fruits.js'

// Komposisi gambar pratinjau tautan (og:image) berukuran 1200 × 630 px dari
// ilustrasi game sendiri. Hanya terbuka saat pengembangan lewat /?og, lalu
// di-screenshot menjadi public/og-image.png. Tidak ikut build produksi.
function OgImageScreen() {
  return (
    <div className="flex h-[630px] w-[1200px] flex-col overflow-hidden bg-langit">
      <Awning />
      <div className="flex flex-1 flex-col items-center gap-6 pt-3">
        <p className="-rotate-1 rounded-2xl border-4 border-tinta bg-terpal px-12 py-4 font-heading text-7xl leading-tight text-kapur shadow-[0_6px_0_var(--color-tinta)]">
          Warung Pahlawan
        </p>
        <p className="rounded-2xl border-4 border-tinta bg-kapur px-8 py-3 text-3xl font-bold">
          Layani para pahlawan, hitung uang, dan berpikir runtut
        </p>
        <ul className="flex gap-4">
          {CHARACTERS.map((character) => (
            <li key={character.id} className="rounded-full border-4 border-tinta bg-kapur p-1">
              <CharacterAvatar characterId={character.id} size={104} decorative />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex h-[118px] items-center justify-center gap-10 border-t-4 border-tinta bg-kayu">
        {FRUITS.map((fruit) => (
          <FruitImage key={fruit.id} fruitId={fruit.id} size={88} decorative />
        ))}
      </div>
    </div>
  )
}

export default OgImageScreen
