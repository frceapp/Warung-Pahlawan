// Mesin kasir warung model lama di atas meja kasir (hiasan, aria-hidden:
// total belanja juga tertulis di nota dan teks layar main). Dari atas ke
// bawah: gulungan kertas nota, layar miring, badan dengan deretan tombol,
// laci uang, dan alas.
// - screen: teks di layar ("Rp ?" sebelum total diketahui, lalu total)
// - ringing: langkah Hitung; tombol berkedip bergantian sekali
// - paperOut: kertas nota sudah keluar dari atas (sejak langkah Hitung)
// - drawerOpen: laci terbuka dan uang di dalamnya terlihat (langkah
//   Kembalian, menutup lagi setelah kembalian benar)
// Gerak memakai transisi dan animasi CSS (index.css), jadi aturan "kurangi
// gerakan" di index.css membuatnya langsung berganti tanpa gerak.

const INK = 'var(--color-tinta)'
const LINE = { stroke: INK, strokeWidth: 2.6, strokeLinejoin: 'round', strokeLinecap: 'round' }
const THIN = { ...LINE, strokeWidth: 1.6 }

// Tombol angka: dua baris enam tombol, ditambah dua tombol kecil dan satu
// tombol jumlah (jingga) di kiri. Urutan kedip dibuat berselang-seling,
// seperti orang mengetik harga.
const KEYS = [
  ...[0, 1, 2, 3, 4, 5].flatMap((col) => [
    { x: 42 + col * 11.5, y: 32, w: 9, h: 6 },
    { x: 42 + col * 11.5, y: 41, w: 9, h: 6 },
  ]),
  { x: 12, y: 32, w: 9, h: 6 },
  { x: 24, y: 32, w: 9, h: 6 },
]
const BLINK_ORDER = [0, 7, 2, 9, 4, 11, 13, 1, 8, 3, 10, 5, 12, 6]
const BLINK_STEP_MS = 60

// Uang di dalam laci: lembaran berwarna dan beberapa koin.
const BILLS = ['daun', 'terpal', 'jingga', 'cabai']

function CashRegister({ screen, ringing = false, paperOut = false, drawerOpen = false, className = '' }) {
  const long = screen.length > 8
  return (
    <svg
      viewBox="0 0 120 72"
      className={`overflow-visible ${className}`}
      focusable="false"
      aria-hidden="true"
      data-register
      data-ringing={ringing ? 'true' : 'false'}
      data-register-paper={paperOut ? 'out' : 'in'}
      data-register-drawer={drawerOpen ? 'open' : 'closed'}
    >
      {/* Kertas nota: tersembunyi di balik gulungan dan layar, lalu naik
          keluar dari atas. */}
      <g className="register-paper" style={{ transform: paperOut ? 'none' : 'translateY(24px)' }}>
        <path d="M46 6V-16L49.5 -18.5L53 -16L56.5 -18.5L60 -16L63.5 -18.5L67 -16L70.5 -18.5L74 -16V6Z" fill="var(--color-kapur)" {...THIN} />
        <path d="M50 -11H70M50 -6H64M50 -1H68" fill="none" {...THIN} strokeWidth={1.2} />
      </g>

      {/* Gulungan kertas di bagian atas, dijepit dua penyangga jingga. */}
      <rect x={34} y={0} width={52} height={9} rx={4.5} fill="var(--color-kapur)" {...LINE} />
      <rect x={29} y={-1} width={8} height={12} rx={2} fill="var(--color-jingga)" {...THIN} />
      <rect x={83} y={-1} width={8} height={12} rx={2} fill="var(--color-jingga)" {...THIN} />

      {/* Layar miring: rumah layar lebih sempit di atas. */}
      <path d="M4 30L116 30L110 3L10 3Z" fill="var(--color-terpal-tua)" {...LINE} />
      <path d="M11 27L109 27L105 7L15 7Z" fill={INK} {...THIN} />
      <text
        data-register-screen
        x={60}
        y={24}
        textAnchor="middle"
        fontSize={20}
        fill="var(--color-pisang)"
        style={{ fontFamily: 'var(--font-heading)' }}
        {...(long ? { textLength: 90, lengthAdjust: 'spacingAndGlyphs' } : {})}
      >
        {screen}
      </text>

      {/* Badan dan tombol. */}
      <rect x={6} y={28} width={108} height={24} rx={7} fill="var(--color-terpal-tua)" {...LINE} />
      {KEYS.map((key, index) => (
        <rect
          key={index}
          className="register-key"
          style={{ '--delay': `${BLINK_ORDER.indexOf(index) * BLINK_STEP_MS}ms` }}
          x={key.x}
          y={key.y}
          width={key.w}
          height={key.h}
          rx={1.5}
          fill="var(--color-kapur)"
          {...THIN}
        />
      ))}
      <rect
        className="register-key-total"
        style={{ '--delay': `${BLINK_ORDER.length * BLINK_STEP_MS}ms` }}
        x={12}
        y={41}
        width={21}
        height={6}
        rx={1.5}
        fill="var(--color-jingga)"
        {...THIN}
      />

      {/* Alas. */}
      <rect x={3} y={61} width={114} height={11} rx={3} fill={INK} />

      {/* Isi laci (terlihat saat laci terbuka). */}
      <rect x={11} y={49.5} width={98} height={10.5} fill="color-mix(in srgb, var(--color-tinta) 80%, var(--color-kayu))" />
      {BILLS.map((color, index) => (
        <rect
          key={color}
          x={15 + index * 16}
          y={51}
          width={13}
          height={8}
          rx={1}
          fill={`var(--color-${color})`}
          {...THIN}
          strokeWidth={1.2}
        />
      ))}
      {[83, 92, 101].map((cx) => (
        <circle key={cx} cx={cx} cy={56} r={3.2} fill="var(--color-pisang)" {...THIN} strokeWidth={1.2} />
      ))}

      {/* Laci: bergeser ke bawah saat terbuka. */}
      <g className="register-drawer" style={{ transform: drawerOpen ? 'translateY(10px)' : 'none' }}>
        <rect x={9} y={49} width={102} height={13} rx={3} fill="var(--color-kayu)" {...LINE} />
        <rect x={50} y={53} width={20} height={5} rx={2.5} fill="var(--color-jingga)" {...THIN} />
        <circle cx={101} cy={55.5} r={1.6} fill={INK} />
      </g>
    </svg>
  )
}

export default CashRegister
