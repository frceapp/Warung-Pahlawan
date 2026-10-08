import { getLevel } from '../data/levels.js'
import { formatPlayedAt } from '../lib/scoreHistory.js'
import StarRating from './StarRating.jsx'

function describeMistakes(mistakes) {
  return mistakes === 0 ? 'Semua langsung pas' : `${mistakes} kali belum pas`
}

// Daftar permainan dari riwayat skor (terbaru di atas). Baris hanya untuk
// dibaca, bukan tombol. showMistakes: tampilkan juga jumlah salah.
function HistoryList({ entries, showMistakes = false }) {
  return (
    <ol className="flex flex-col gap-2" data-history-list="">
      {entries.map((entry) => (
        <li
          key={entry.id}
          data-history-entry={entry.id}
          className="flex items-center gap-3 rounded-2xl border-4 border-tinta bg-kapur px-3 py-2"
        >
          <span className="shrink-0 rounded-lg border-4 border-tinta bg-terpal px-2 py-0.5 font-heading text-base text-kapur">
            Level {entry.level}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-heading text-lg leading-tight">
              Skor {entry.score} dari {entry.maxScore}
            </span>
            <span className="block text-sm leading-snug">
              <time dateTime={entry.finishedAt}>{formatPlayedAt(entry.finishedAt)}</time>
              <span aria-hidden="true"> · </span>
              <span className="sr-only">, </span>
              {getLevel(entry.level).name}
              {showMistakes && (
                <>
                  <span aria-hidden="true"> · </span>
                  <span className="sr-only">, </span>
                  {describeMistakes(entry.mistakes)}
                </>
              )}
            </span>
          </span>
          <StarRating stars={entry.stars} size={22} />
        </li>
      ))}
    </ol>
  )
}

export default HistoryList
