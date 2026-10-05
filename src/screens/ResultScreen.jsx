import { useEffect, useRef } from 'react'
import Awning from '../components/Awning.jsx'
import Button from '../components/Button.jsx'
import CharacterAvatar from '../components/CharacterAvatar.jsx'
import StarRating from '../components/StarRating.jsx'
import { getLevel } from '../data/levels.js'

const PRAISE = {
  3: 'Hebat! Kamu melayani semua pembeli dengan teliti.',
  2: 'Bagus! Terus berlatih supaya makin teliti.',
  1: 'Kamu sudah melayani semua pembeli. Ayo main lagi supaya makin lancar!',
}

function ResultScreen({ summary, isNewBest, onPlayAgain, onHome }) {
  const level = getLevel(summary.levelId)
  const headingRef = useRef(null)
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="flex min-h-dvh flex-col">
      <Awning />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pt-6 pb-12">
        <header className="flex flex-col items-center gap-4 text-center">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="-rotate-1 rounded-2xl border-4 border-tinta bg-terpal px-6 py-3 font-heading text-4xl leading-tight text-kapur shadow-[0_6px_0_var(--color-tinta)] sm:text-5xl"
          >
            Warung tutup!
          </h1>
          <p className="font-heading text-2xl">{level.name}</p>
          <div className="flex flex-col items-center gap-2 rounded-2xl border-4 border-tinta bg-kapur px-6 py-4">
            <StarRating stars={summary.stars} size={56} />
            <p className="font-heading text-3xl" data-result-score={summary.score}>
              Skor {summary.score} dari {summary.maxScore}
            </p>
            <p className="text-base font-bold">{summary.stars} dari 3 bintang</p>
            {isNewBest && (
              <p className="rounded-lg border-4 border-tinta bg-pisang px-3 py-1 font-bold">
                Bintang terbaik baru!
              </p>
            )}
            <p className="max-w-md text-lg">{PRAISE[summary.stars]}</p>
          </div>
          <div className="flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center">
            <Button onClick={onPlayAgain}>Main lagi</Button>
            <Button variant="secondary" onClick={onHome}>
              Kembali ke beranda
            </Button>
          </div>
        </header>

        <section aria-labelledby="served-title">
          <h2 id="served-title" className="mb-4 font-heading text-3xl">
            Tokoh yang kamu layani
          </h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {summary.results.map(({ character, fact, score }) => (
              <li
                key={character.id}
                className="flex items-start gap-3 rounded-2xl border-4 border-tinta bg-kapur p-3"
              >
                <CharacterAvatar characterId={character.id} size={72} decorative />
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-xl leading-tight">{character.name}</p>
                  <p className="text-sm">{character.origin}</p>
                  <blockquote className="mt-2 border-l-4 border-jingga pl-3 text-base">
                    “{fact}”
                  </blockquote>
                  <p className="mt-2 text-sm font-bold">{score} poin</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <div className="h-10 border-t-4 border-tinta bg-kayu" aria-hidden="true" />
    </div>
  )
}

export default ResultScreen
