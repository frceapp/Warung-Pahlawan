import { useEffect } from 'react'
import AnimeCharacter from '../components/character/AnimeCharacter.jsx'
import { CHARACTER_LOOKS } from '../components/character/characterLooks.js'
import { describeLook } from '../components/character/describeLook.js'
import { CHARACTERS } from '../data/characters.js'

// Halaman tersembunyi /?tokoh: kedelapan tokoh berdampingan (tampak depan
// dan tampak samping) di latar polos, dengan ciri yang sekarang digambar,
// supaya kemiripannya bisa dibandingkan dengan potret yang umum dikenal.
// Dimuat terpisah (React.lazy), tidak masuk bundel awal.

function Figure({ characterId, facing, label }) {
  return (
    <figure className="flex flex-col items-center">
      <div className="h-40 w-30">
        <AnimeCharacter characterId={characterId} entrance={false} facing={facing} className="h-full w-full" />
      </div>
      <figcaption className="text-xs">{label}</figcaption>
    </figure>
  )
}

function CharacterSheetScreen() {
  useEffect(() => {
    document.title = 'Lembar tokoh · Warung Pahlawan'
  }, [])

  return (
    <main className="min-h-dvh bg-kapur px-4 py-3 text-tinta">
      <h1 className="font-heading text-xl">Lembar tokoh</h1>
      <ul className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CHARACTERS.map((character) => (
          <li key={character.id} className="rounded-xl border-2 border-tinta px-3 py-2" data-sheet={character.id}>
            <div className="flex justify-center gap-2">
              <Figure characterId={character.id} facing="depan" label="Depan" />
              <Figure characterId={character.id} facing="samping" label="Samping" />
            </div>
            <h2 className="mt-1 text-center font-heading text-lg leading-tight">{character.name}</h2>
            <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-2 text-[13px] leading-snug">
              {describeLook(CHARACTER_LOOKS[character.id]).map(({ label, value }) => (
                <div key={label} className="contents">
                  <dt className="font-bold">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default CharacterSheetScreen
