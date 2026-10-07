import CashRegister from './CashRegister.jsx'

// Barang di atas meja kasir: mesin kasir, kalkulator, timbangan, dan kucing
// warung yang duduk diam. Diletakkan tepat di atas area kerja (meja kasir),
// di bawah balon bicara. Hanya hiasan untuk pembaca layar (aria-hidden):
// total belanja juga tertulis di nota atau balon bicara. Di layar lebar
// mesin kasir ada di panggung pembeli (PlayScreen), jadi bagian ini hanya
// untuk HP dan tablet.
// - register: props untuk CashRegister (screen, ringing, paperOut,
//   drawerOpen)

const INK = 'var(--color-tinta)'
const LINE = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' }
const THIN = { ...LINE, strokeWidth: 1.5 }

const CALCULATOR = (
  <>
    <rect x={2} y={2} width={36} height={48} rx={5} fill="var(--color-kapur)" {...LINE} />
    <rect x={7} y={7} width={26} height={10} rx={2} fill="var(--color-langit)" {...THIN} />
    {[0, 1, 2].map((row) =>
      [0, 1, 2].map((col) => (
        <rect
          key={`${row}-${col}`}
          x={8 + col * 9}
          y={22 + row * 9}
          width={6}
          height={6}
          rx={1}
          fill={row === 2 && col === 2 ? 'var(--color-jingga)' : 'var(--color-pisang)'}
          {...THIN}
        />
      )),
    )}
  </>
)

const SCALE = (
  <>
    <rect x={29} y={14} width={6} height={12} fill="var(--color-kapur)" {...LINE} />
    <ellipse cx={32} cy={12} rx={26} ry={6} fill="var(--color-kapur)" {...LINE} />
    <rect x={6} y={26} width={52} height={28} rx={6} fill="var(--color-daun)" {...LINE} />
    <circle cx={32} cy={40} r={9} fill="var(--color-kapur)" {...LINE} />
    <path d="M32 40L37 35" {...THIN} />
  </>
)

const CAT = (
  <>
    <path d="M44 58C60 58 60 38 52 34" fill="none" {...LINE} strokeWidth={8} />
    <path d="M44 58C60 58 60 38 52 34" fill="none" stroke="var(--color-jingga)" strokeWidth={3} strokeLinecap="round" />
    <ellipse cx={30} cy={46} rx={18} ry={16} fill="var(--color-jingga)" {...LINE} />
    <path d="M19 18L20 4L29 12ZM41 18L40 4L31 12Z" fill="var(--color-jingga)" {...LINE} />
    <circle cx={30} cy={24} r={13} fill="var(--color-jingga)" {...LINE} />
    <path d="M23 24q3 3 6 0M31 24q3 3 6 0M28 30h4" fill="none" {...THIN} />
    <path d="M24 60v-6M36 60v-6" {...THIN} />
  </>
)

function CashCounter({ register }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-full z-10 select-none">
      <div className="relative mx-auto h-0 w-full max-w-5xl">
        <div className="absolute right-2 bottom-0 flex items-end gap-1.5 md:right-4 md:gap-3">
          <svg viewBox="0 0 64 62" className="hidden w-11 md:block" focusable="false">
            {CAT}
          </svg>
          <svg viewBox="0 0 64 56" className="hidden w-12 sm:block md:w-16" focusable="false">
            {SCALE}
          </svg>
          <svg viewBox="0 0 40 52" className="hidden w-7 sm:block md:w-9" focusable="false">
            {CALCULATOR}
          </svg>
          {/* HP: 120 px (sepertiga layar 360 px); tablet: 176 px. */}
          <CashRegister {...register} className="w-[120px] md:w-44" />
        </div>
      </div>
    </div>
  )
}

export default CashCounter
