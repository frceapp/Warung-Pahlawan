import Button from '../components/Button.jsx'

function HomeScreen({ onPlay }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div
        className="awning-stripes h-16 border-b-4 border-tinta sm:h-24"
        aria-hidden="true"
      />

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-10 sm:gap-8">
        <h1 className="-rotate-1 rounded-2xl border-4 border-tinta bg-terpal px-6 py-3 text-center font-heading text-4xl leading-tight text-kapur sm:px-10 sm:py-5 sm:text-6xl">
          Warung Pahlawan
        </h1>

        <p className="max-w-xl rounded-2xl border-4 border-tinta bg-kapur px-5 py-4 text-center text-lg leading-relaxed sm:px-8 sm:text-xl">
          Jadi penjaga warung buah, layani para pahlawan Indonesia, dan belajar
          berpikir runtut seperti programmer.
        </p>

        <Button onClick={() => onPlay(1)}>Mulai main</Button>
      </main>

      <div
        className="h-10 border-t-4 border-tinta bg-kayu sm:h-14"
        aria-hidden="true"
      />
    </div>
  )
}

export default HomeScreen
