// Penampilan tokoh untuk karakter anime di layar main. Semua tokoh memakai
// satu rangka yang sama (AnimeCharacter); yang berbeda hanya data di sini.
// Ciri tiap tokoh mengikuti tabel tokoh di AGENTS.md bagian 3.
//
// Warna memakai nama token desain (misalnya 'kapur'), kecuali warna kulit
// yang tidak ada di token dan ditulis sebagai kode hex.
//
// - skin: warna kulit
// - hair: model rambut ('sanggul', 'pendek', 'belah-samping', 'panjang',
//   'tertutup' untuk rambut yang tertutup kain)
// - outfit: model baju ('kebaya', 'jas', 'beskap', 'kurung', 'jubah',
//   'mantel', 'kemeja') dengan warna atasan, aksen, dan bawahan
// - accessories: aksesori khas ('bros', 'peci', 'kacamata', 'kumis',
//   'selendang', 'sorban', 'blangkon', 'ikat-kepala')
// - side: tampak samping (menghadap kanan) untuk berjalan masuk dan keluar:
//   - hair: rambut dari samping ('sanggul' dengan konde di belakang atas,
//     'pendek', 'belah-samping' dengan poni ke depan, 'panjang' terurai ke
//     punggung, 'tertutup')
//   - headwear: penutup kepala dari samping ('peci', 'sorban', 'blangkon'
//     dengan mondolan di belakang, 'ikat-kepala' dengan simpul dan ujung kain
//     di belakang, 'kerudung' untuk selendang yang menutup kepala), atau null
//   - nose: bentuk hidung profil ('kecil' atau 'mancung')
export const CHARACTER_LOOKS = {
  kartini: {
    skin: '#E3AE7F',
    hair: 'sanggul',
    outfit: { style: 'kebaya', top: 'kapur', accent: 'kayu', bottom: 'kayu' },
    accessories: ['bros'],
    side: { hair: 'sanggul', headwear: null, nose: 'kecil' },
  },
  soekarno: {
    skin: '#D49A66',
    hair: 'pendek',
    outfit: { style: 'jas', top: 'kapur', accent: 'tinta', bottom: 'tinta' },
    accessories: ['peci'],
    side: { hair: 'pendek', headwear: 'peci', nose: 'mancung' },
  },
  hatta: {
    skin: '#DCA675',
    hair: 'belah-samping',
    outfit: { style: 'jas', top: 'terpal', accent: 'tinta', bottom: 'tinta' },
    accessories: ['kacamata'],
    side: { hair: 'belah-samping', headwear: null, nose: 'kecil' },
  },
  dewantara: {
    skin: '#C98F5C',
    hair: 'pendek',
    outfit: { style: 'beskap', top: 'terpal-tua', accent: 'kapur', bottom: 'tinta' },
    accessories: ['peci', 'kacamata', 'kumis'],
    side: { hair: 'pendek', headwear: 'peci', nose: 'mancung' },
  },
  'cut-nyak-dhien': {
    skin: '#D9A16D',
    hair: 'tertutup',
    outfit: { style: 'kurung', top: 'terpal-tua', accent: 'pisang', bottom: 'terpal-tua' },
    accessories: ['selendang'],
    side: { hair: 'tertutup', headwear: 'kerudung', nose: 'kecil' },
  },
  diponegoro: {
    skin: '#C58A57',
    hair: 'tertutup',
    outfit: { style: 'jubah', top: 'kapur', accent: 'daun', bottom: 'kapur' },
    accessories: ['sorban'],
    side: { hair: 'tertutup', headwear: 'sorban', nose: 'mancung' },
  },
  sudirman: {
    skin: '#D29763',
    hair: 'pendek',
    outfit: { style: 'mantel', top: 'daun', accent: 'pisang', bottom: 'tinta' },
    accessories: ['blangkon'],
    side: { hair: 'pendek', headwear: 'blangkon', nose: 'kecil' },
  },
  pattimura: {
    skin: '#B07443',
    hair: 'panjang',
    outfit: { style: 'kemeja', top: 'kapur', accent: 'cabai', bottom: 'terpal-tua' },
    accessories: ['ikat-kepala'],
    side: { hair: 'panjang', headwear: 'ikat-kepala', nose: 'mancung' },
  },
}
