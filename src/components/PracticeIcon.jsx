// Ikon kecil bergaya stiker untuk bagian "Yang kamu latih" di beranda.
// Hiasan saja (aria-hidden); judul dan teks butirnya sudah menjelaskan.
const LINE = { stroke: 'var(--color-tinta)', strokeWidth: 2.5, strokeLinejoin: 'round', strokeLinecap: 'round' }

const ICONS = {
  // Berhitung: papan hitung dengan tanda tambah dan kali.
  count: (
    <>
      <rect x={5} y={5} width={30} height={30} rx={7} fill="var(--color-pisang)" {...LINE} />
      <path d="M13 13v8M9 17h8M24 13l6 6M30 13l-6 6M9 28h8M23 26h8M23 30h8" fill="none" {...LINE} />
    </>
  ),
  // Uang rupiah: selembar uang kertas.
  money: (
    <>
      <rect x={3} y={10} width={34} height={20} rx={3} fill="var(--color-daun)" {...LINE} />
      <rect x={8} y={14} width={24} height={12} rx={2} fill="var(--color-kapur)" {...LINE} strokeWidth={2} />
      <path d="M17 17v6M17 17h3.5a2 2 0 0 1 0 3.5H17M20.5 20.5l2 2.5" fill="none" {...LINE} strokeWidth={2} />
    </>
  ),
  // Teliti dan runtut: daftar langkah dengan tanda centang.
  steps: (
    <>
      <rect x={7} y={4} width={26} height={32} rx={4} fill="var(--color-kapur)" {...LINE} />
      <path d="M11 12l2 2 4-4M11 21l2 2 4-4M11 30l2 2 4-4M21 12h8M21 21h8M21 30h8" fill="none" {...LINE} />
    </>
  ),
  // Kenal pahlawan: bintang di pita.
  hero: (
    <>
      <path d="M14 24l-4 13 6-3 4 5 0-12M26 24l4 13-6-3-4 5" fill="var(--color-cabai)" {...LINE} />
      <path
        d="M20 3l4.2 8.5 9.4 1.4-6.8 6.6 1.6 9.3L20 24.4l-8.4 4.4 1.6-9.3-6.8-6.6 9.4-1.4z"
        fill="var(--color-pisang)"
        {...LINE}
      />
    </>
  ),
}

function PracticeIcon({ name, className = '' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      {ICONS[name]}
    </svg>
  )
}

export default PracticeIcon
