// Barang di atas meja kasir: mesin kasir, kalkulator, timbangan, dan kucing
// warung yang duduk diam. Diletakkan tepat di atas area kerja (meja kasir),
// di bawah balon bicara. Hanya hiasan untuk pembaca layar (aria-hidden):
// total belanja juga tertulis di nota atau balon bicara.
// - screen: teks di layar mesin kasir
// - drawerOpen: laci mesin kasir sedang terbuka (sebentar, setelah anak
//   menekan "Berikan kembalian")

const INK = 'var(--color-tinta)'
const LINE = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' }
const THIN = { ...LINE, strokeWidth: 1.5 }

// Mesin kasir pendek dan lebar supaya layarnya muat di bawah balon bicara
// di HP: layar di atas, badan dengan tombol, lalu laci di bawah.
function registerArt(screen, drawerOpen) {
  return (
    <>
      {/* Laci digambar di belakang badan mesin; saat terbuka bergeser ke bawah
          dan isinya (uang) terlihat. */}
      <g
        style={{
          transform: drawerOpen ? 'translateY(12px)' : 'none',
          transition: 'transform 160ms ease-out',
        }}
      >
        <rect x={10} y={30} width={80} height={10} fill="var(--color-tinta)" />
        <rect x={18} y={31} width={18} height={7} fill="var(--color-daun)" {...THIN} />
        <circle cx={48} cy={35} r={3.5} fill="var(--color-pisang)" {...THIN} />
        <circle cx={58} cy={35} r={3.5} fill="var(--color-pisang)" {...THIN} />
        <rect x={6} y={38} width={88} height={10} rx={2} fill="var(--color-kayu)" {...LINE} />
        <path d="M44 43H56" {...LINE} />
      </g>
      <path d="M6 40L10 22H90L94 40Z" fill="var(--color-terpal)" {...LINE} />
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <rect
          key={index}
          x={20 + index * 10}
          y={28}
          width={7}
          height={5}
          rx={1}
          fill="var(--color-kapur)"
          {...THIN}
        />
      ))}
      <rect x={4} y={2} width={92} height={21} rx={4} fill="var(--color-tinta)" {...LINE} />
      <text
        data-register-screen
        x={50}
        y={18}
        textAnchor="middle"
        fontSize={15}
        fill="var(--color-pisang)"
        style={{ fontFamily: 'var(--font-heading)' }}
        {...(screen.length > 9 ? { textLength: 84, lengthAdjust: 'spacingAndGlyphs' } : {})}
      >
        {screen}
      </text>
    </>
  )
}

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

function CashCounter({ screen, drawerOpen = false }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-full z-10 select-none">
      <div className="relative mx-auto h-0 w-full max-w-5xl">
        <svg viewBox="0 0 64 62" className="absolute bottom-0 left-[150px] hidden w-11 md:block" focusable="false">
          {CAT}
        </svg>
        <div className="absolute right-3 bottom-0 flex items-end gap-1.5 md:right-4 md:gap-3">
          <svg viewBox="0 0 64 56" className="hidden w-12 sm:block md:w-16" focusable="false">
            {SCALE}
          </svg>
          <svg viewBox="0 0 40 52" className="hidden w-7 sm:block md:w-9" focusable="false">
            {CALCULATOR}
          </svg>
          <svg
            viewBox="0 0 100 48"
            className="w-[84px] overflow-visible md:w-24"
            focusable="false"
            data-register-drawer={drawerOpen ? 'open' : 'closed'}
          >
            {registerArt(screen, drawerOpen)}
          </svg>
        </div>
      </div>
    </div>
  )
}

export default CashCounter
