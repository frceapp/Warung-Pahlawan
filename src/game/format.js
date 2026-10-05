// Menulis rupiah sesuai AGENTS.md: "Rp7.000", tanpa spasi, titik sebagai
// pemisah ribuan.
export function formatRupiah(amount) {
  const digits = String(Math.abs(Math.round(amount)))
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${amount < 0 ? '-' : ''}Rp${grouped}`
}
