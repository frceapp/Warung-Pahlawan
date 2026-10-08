import { DATE_OPTIONS, LEVEL_OPTIONS, SORT_OPTIONS, STAR_OPTIONS } from '../../lib/historyFilter.js'
import ChoiceGroup from './ChoiceGroup.jsx'

const DATE_INPUT =
  'min-h-12 w-full rounded-xl border-4 border-tinta bg-kapur px-3 text-base font-bold text-tinta'

// Semua kontrol filter riwayat. Dipakai di panel samping (layar lebar) dan
// di panel "Filter" (HP). Rentang sendiri memakai <input type="date">, yang
// di HP membuka pemilih tanggal bawaan.
function FilterControls({ filters, onChange, todayKey }) {
  const set = (key) => (value) => onChange({ ...filters, [key]: value })
  return (
    <div className="flex flex-col gap-5">
      <ChoiceGroup
        legend="Tingkat kesulitan"
        name="filter-level"
        options={LEVEL_OPTIONS}
        value={filters.level}
        onChange={set('level')}
      />
      <div className="flex flex-col gap-3">
        <ChoiceGroup
          legend="Tanggal"
          name="filter-date"
          options={DATE_OPTIONS}
          value={filters.date}
          onChange={(date) => onChange({ ...filters, date, ...(date === 'custom' ? {} : { from: '', to: '' }) })}
        />
        {filters.date === 'custom' && (
          <div className="grid grid-cols-2 gap-3" data-date-range="">
            <label className="flex flex-col gap-1 text-base font-bold">
              Dari
              <input
                type="date"
                value={filters.from}
                max={filters.to || todayKey}
                onChange={(event) => onChange({ ...filters, from: event.target.value })}
                className={DATE_INPUT}
              />
            </label>
            <label className="flex flex-col gap-1 text-base font-bold">
              Sampai
              <input
                type="date"
                value={filters.to}
                min={filters.from || undefined}
                max={todayKey}
                onChange={(event) => onChange({ ...filters, to: event.target.value })}
                className={DATE_INPUT}
              />
            </label>
          </div>
        )}
      </div>
      <ChoiceGroup
        legend="Bintang"
        name="filter-stars"
        options={STAR_OPTIONS}
        value={filters.stars}
        onChange={set('stars')}
      />
      <ChoiceGroup legend="Urutan" name="filter-sort" options={SORT_OPTIONS} value={filters.sort} onChange={set('sort')} />
    </div>
  )
}

export default FilterControls
