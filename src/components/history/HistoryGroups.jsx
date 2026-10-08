import { getLevel } from '../../data/levels.js'
import { formatTime } from '../../lib/historyFilter.js'
import StarRating from '../StarRating.jsx'

function describeMistakes(mistakes) {
  return mistakes === 0 ? 'Semua langsung pas' : `${mistakes} kali belum pas`
}

// Daftar riwayat yang dikelompokkan per tanggal. Tiap baris bisa difokus
// lewat kode (tabIndex -1) supaya fokus pindah ke baris pertama yang baru
// muncul setelah "Muat lebih banyak".
function HistoryGroups({ groups }) {
  let index = 0
  return (
    <div className="flex flex-col gap-4" data-history-groups="">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`day-${group.id}`}>
          <h3 id={`day-${group.id}`} className="mb-2 font-heading text-xl">
            {group.label}
          </h3>
          <ol className="flex flex-col gap-2">
            {group.entries.map((entry) => {
              const position = index++
              return (
                <li
                  key={entry.id}
                  tabIndex={-1}
                  data-history-entry={entry.id}
                  data-entry-index={position}
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
                      {getLevel(entry.level).name}
                      <span aria-hidden="true"> · </span>
                      <span className="sr-only">, </span>
                      {describeMistakes(entry.mistakes)}
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-0.5">
                    <StarRating stars={entry.stars} size={20} />
                    <time dateTime={entry.finishedAt} className="text-sm font-bold">
                      <span className="sr-only">pukul </span>
                      {formatTime(entry.finishedAt)}
                    </time>
                  </span>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}

export default HistoryGroups
