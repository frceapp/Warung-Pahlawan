import { describeLevel } from '../data/guide.js'
import StarRating from './StarRating.jsx'

// Kartu pilihan level di beranda. Seluruh kartu adalah tombol.
function LevelCard({ level, bestStars, onPlay }) {
  return (
    <button
      type="button"
      data-level-id={level.id}
      onClick={() => onPlay(level.id)}
      className="group flex h-full w-full flex-col gap-3 rounded-2xl border-4 border-tinta bg-kapur p-4 text-left shadow-[0_6px_0_var(--color-tinta)] transition-transform duration-150 hover:-translate-y-1 active:translate-y-1 active:shadow-none"
    >
      <span className="flex items-center justify-between gap-2">
        <span className="rounded-lg border-4 border-tinta bg-terpal px-2 py-0.5 font-heading text-base text-kapur">
          Level {level.id}
        </span>
        {bestStars ? (
          <StarRating stars={bestStars} label={`Bintang terbaik: ${bestStars} dari 3`} />
        ) : (
          <span className="text-sm">Belum dimainkan</span>
        )}
      </span>
      <span className="font-heading text-3xl leading-tight">{level.name}</span>
      <span className="flex flex-col gap-0.5 text-base">
        {describeLevel(level).map((line) => (
          <span key={line}>{line}</span>
        ))}
      </span>
      <span className="mt-auto inline-flex min-h-12 items-center justify-center rounded-xl border-4 border-tinta bg-pisang px-4 font-heading text-lg transition-colors group-hover:bg-jingga">
        Buka warung
      </span>
    </button>
  )
}

export default LevelCard
