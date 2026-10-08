// Satu kelompok pilihan filter berupa tombol radio bergaya stiker. Radio asli
// tetap dipakai (panah kiri/kanan berpindah pilihan, Tab ke kelompok
// berikutnya); pilihan yang aktif ditandai warna dan tanda centang.
function ChoiceGroup({ legend, name, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 font-heading text-lg leading-tight">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = value === option.value
          return (
            <label key={option.value} className="relative">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-12 cursor-pointer items-center gap-1.5 rounded-xl border-4 border-tinta bg-kapur px-3 py-1 text-base font-bold leading-tight peer-checked:bg-pisang peer-focus-visible:outline-4 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-tinta">
                {checked && (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
                    <path d="M5 12.5 L10 17 L19 7" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {option.label}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default ChoiceGroup
