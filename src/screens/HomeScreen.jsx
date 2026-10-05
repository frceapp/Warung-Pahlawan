import { useEffect, useRef } from 'react'
import Awning from '../components/Awning.jsx'
import FruitImage from '../components/FruitImage.jsx'
import LevelCard from '../components/LevelCard.jsx'
import { CODING_CONCEPTS, HOW_TO_PLAY } from '../data/guide.js'
import { LEVELS } from '../data/levels.js'

function HomeScreen({ bestStars, onPlay, focusHeading = false }) {
  const headingRef = useRef(null)
  useEffect(() => {
    if (focusHeading) headingRef.current?.focus()
  }, [focusHeading])

  return (
    <div className="flex min-h-dvh flex-col">
      <Awning />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 pt-6 pb-12">
        <header className="flex flex-col items-center gap-5 text-center">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="-rotate-1 rounded-2xl border-4 border-tinta bg-terpal px-6 py-3 font-heading text-4xl leading-tight text-kapur shadow-[0_6px_0_var(--color-tinta)] sm:px-10 sm:py-5 sm:text-6xl"
          >
            Warung Pahlawan
          </h1>
          <p className="max-w-xl rounded-2xl border-4 border-tinta bg-kapur px-5 py-4 text-lg leading-relaxed sm:px-8 sm:text-xl">
            Jadi penjaga warung buah, layani para pahlawan Indonesia, dan belajar berpikir runtut
            seperti programmer.
          </p>
        </header>

        <section aria-labelledby="levels-title">
          <h2 id="levels-title" className="mb-4 font-heading text-3xl">
            Pilih warungmu
          </h2>
          <ul className="grid gap-5 md:grid-cols-3">
            {LEVELS.map((level) => (
              <li key={level.id}>
                <LevelCard level={level} bestStars={bestStars[level.id]} onPlay={onPlay} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="howto-title">
          <h2 id="howto-title" className="mb-4 font-heading text-3xl">
            Cara main
          </h2>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_TO_PLAY.map((step, index) => (
              <li
                key={step.title}
                className="flex items-start gap-3 rounded-2xl border-4 border-tinta bg-kapur p-3"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-tinta bg-pisang font-heading text-xl"
                >
                  {index + 1}
                </span>
                <span>
                  <span className="block font-heading text-xl">{step.title}</span>
                  <span className="text-base">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-base">
            Tiap pembeli bernilai 10 poin. Kalau ada yang belum pas, kamu boleh mencoba lagi.
          </p>
        </section>

        <section aria-labelledby="coding-title">
          <h2 id="coding-title" className="mb-2 font-heading text-3xl">
            Belajar coding di warung
          </h2>
          <p className="mb-4 text-base">
            Saat menjaga warung, kamu memakai cara berpikir yang sama dengan programmer.
          </p>
          <div className="overflow-hidden rounded-2xl border-4 border-tinta bg-kapur">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Konsep coding dan wujudnya di warung</caption>
              <thead className="bg-terpal-tua text-kapur">
                <tr>
                  <th scope="col" className="w-1/3 px-3 py-2 font-heading text-lg">
                    Konsep coding
                  </th>
                  <th scope="col" className="px-3 py-2 font-heading text-lg">
                    Di warung
                  </th>
                </tr>
              </thead>
              <tbody>
                {CODING_CONCEPTS.map((concept) => (
                  <tr key={concept.name} className="border-t-4 border-tinta align-top">
                    <th scope="row" className="px-3 py-3">
                      <span className="block font-heading text-xl">{concept.name}</span>
                      <span className="text-sm font-normal">({concept.term})</span>
                    </th>
                    <td className="px-3 py-3 text-base">{concept.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="border-t-4 border-tinta bg-kayu px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2" aria-hidden="true">
          {['banana', 'apple', 'mango', 'watermelon', 'rambutan', 'orange'].map((id) => (
            <FruitImage key={id} fruitId={id} size={40} decorative />
          ))}
        </div>
      </footer>
    </div>
  )
}

export default HomeScreen
