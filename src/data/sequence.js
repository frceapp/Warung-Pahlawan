// Isi mode "Susun Langkah": keterangan dan petunjuk untuk tiap kartu
// langkah. Nama dan urutan langkah diambil dari STEPS di src/game/session.js.
export const STEP_CARD_TEXT = {
  greet: {
    description: 'Sambut pembeli.',
    hint: 'Langkah pertama, pembeli disapa dulu.',
  },
  pick: {
    description: 'Isi kantong belanja.',
    hint: 'Sesudah menyapa, ambil buah pesanannya.',
  },
  count: {
    description: 'Tentukan totalnya.',
    hint: 'Total dihitung setelah buahnya dibungkus.',
  },
  change: {
    description: 'Beri uang kembalian.',
    hint: 'Kembalian diberikan paling akhir.',
  },
}
