import AnimeCharacter from '../components/character/AnimeCharacter.jsx'
import CharacterAvatar from '../components/CharacterAvatar.jsx'
import FruitImage from '../components/FruitImage.jsx'
import MoneyImage from '../components/MoneyImage.jsx'
import { CHARACTERS } from '../data/characters.js'
import { FRUITS } from '../data/fruits.js'
import { DENOMINATIONS } from '../data/money.js'
import { formatRupiah } from '../game/format.js'

// Halaman sementara untuk mengecek ilustrasi pada 40 px dan 160 px.
// Hanya terbuka saat pengembangan lewat /?galeri, tidak ikut build produksi.
function GalleryScreen() {
  const sections = [
    {
      title: 'Buah',
      items: FRUITS.map((fruit) => ({
        key: fruit.id,
        name: fruit.name,
        render: (size) => <FruitImage fruitId={fruit.id} size={size} />,
      })),
    },
    {
      title: 'Uang',
      items: DENOMINATIONS.map((value) => ({
        key: value,
        name: formatRupiah(value),
        render: (size) => <MoneyImage value={value} size={size} />,
      })),
    },
    {
      title: 'Tokoh',
      items: CHARACTERS.map((character) => ({
        key: character.id,
        name: character.name,
        render: (size) => <CharacterAvatar characterId={character.id} size={size} />,
      })),
    },
    {
      title: 'Karakter anime',
      items: CHARACTERS.map((character) => ({
        key: `anime-${character.id}`,
        name: character.name,
        render: (size) => (
          <div style={{ height: size * 1.4, width: size }} data-anime={character.id}>
            <AnimeCharacter characterId={character.id} entrance={false} className="h-full w-full" />
          </div>
        ),
      })),
    },
    ...[
      ['wave', 'melambai'],
      ['hold', 'memegang bungkusan'],
    ].map(([pose, label]) => ({
      title: `Karakter anime, pose ${label}`,
      items: CHARACTERS.map((character) => ({
        key: `anime-${pose}-${character.id}`,
        name: character.name,
        render: (size) => (
          <div style={{ height: size * 1.4, width: size }} data-anime-pose={`${pose}-${character.id}`}>
            <AnimeCharacter characterId={character.id} entrance={false} pose={pose} className="h-full w-full" />
          </div>
        ),
      })),
    })),
    {
      title: 'Karakter anime, tampak samping membawa bungkusan',
      items: CHARACTERS.map((character) => ({
        key: `anime-carry-${character.id}`,
        name: character.name,
        render: (size) => (
          <div style={{ height: size * 1.4, width: size }} data-anime-carry={character.id}>
            <AnimeCharacter
              characterId={character.id}
              entrance={false}
              facing="samping"
              pose="hold"
              className="h-full w-full"
            />
          </div>
        ),
      })),
    },
    {
      title: 'Karakter anime di belakang meja kasir (tangan bertumpu di tepi meja)',
      items: CHARACTERS.map((character) => ({
        key: `anime-counter-${character.id}`,
        name: character.name,
        render: (size) => (
          <div
            style={{ height: size * 1.4, width: size }}
            className="relative"
            data-anime-counter={character.id}
          >
            <div
              className="scene-counter absolute inset-x-0 bottom-0 border-t-4 border-tinta"
              style={{ top: `${((94 - 4) / 132) * 100}%` }}
            />
            <AnimeCharacter characterId={character.id} entrance={false} behindCounter className="relative h-full w-full" />
          </div>
        ),
      })),
    },
    ...[false, true].map((mirrored) => ({
      title: mirrored
        ? 'Karakter anime, tampak samping dicerminkan (menghadap kiri)'
        : 'Karakter anime, tampak samping (menghadap kanan)',
      items: CHARACTERS.map((character) => ({
        key: `anime-side-${mirrored ? 'kiri' : 'kanan'}-${character.id}`,
        name: character.name,
        render: (size) => (
          <div style={{ height: size * 1.4, width: size }} data-anime-side={character.id}>
            <AnimeCharacter
              characterId={character.id}
              entrance={false}
              facing="samping"
              mirrored={mirrored}
              className="h-full w-full"
            />
          </div>
        ),
      })),
    })),
  ]

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-heading text-3xl">Galeri ilustrasi</h1>
      {sections.map((section) => (
        <section key={section.title} className="mt-8">
          <h2 className="font-heading text-2xl">{section.title}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {section.items.map((item) => (
              <li
                key={item.key}
                className="flex items-end gap-4 rounded-2xl border-4 border-tinta bg-kapur p-4"
              >
                {item.render(40)}
                {item.render(160)}
                <span className="sr-only">{item.name}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm">
            {section.items.map((item) => item.name).join(', ')}
          </p>
        </section>
      ))}
    </main>
  )
}

export default GalleryScreen
