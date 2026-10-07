// Daftar berkas efek suara di public/sfx/ beserta asalnya. Semua rekaman
// berlisensi CC0 (domain publik). Dipakai oleh pemuat suara (sfx.js),
// halaman uji /?sfx, dan dicatat juga di docs/kredit-aset.md.
// Semua berkas: MP3 mono 96 kbps, hening di awal dan akhir dipotong,
// kekerasannya disamakan, paling panjang 1,5 detik.

const KENNEY = 'Kenney (kenney.nl)'
const CC0 = 'CC0 1.0'

const kenney = (pack, slug, original) => ({
  original,
  author: KENNEY,
  pack,
  source: `https://kenney.nl/assets/${slug}`,
  license: CC0,
})

const freesound = (author, id, original) => ({
  original,
  author,
  pack: 'Freesound',
  source: `https://freesound.org/people/${author}/sounds/${id}/`,
  license: CC0,
})

export const SFX_FILES = [
  {
    id: 'doorRoll',
    file: 'pintu-gulung.mp3',
    label: 'Pintu gulung naik saat warung dibuka',
    ...freesound('Areti18', 394947, 'Rolling shutter (potongan 0,4 sampai 1,85 detik)'),
  },
  {
    id: 'doorBell',
    file: 'lonceng-pintu.mp3',
    label: 'Lonceng pintu saat pembeli datang',
    ...freesound('ryuuzan', 192761, 'Ryuuzan_shop_door_bell00.wav'),
  },
  {
    id: 'step1',
    file: 'langkah-1.mp3',
    label: 'Langkah kaki (1)',
    ...kenney('RPG Audio', 'rpg-audio', 'footstep00.ogg'),
  },
  {
    id: 'step2',
    file: 'langkah-2.mp3',
    label: 'Langkah kaki (2)',
    ...kenney('RPG Audio', 'rpg-audio', 'footstep01.ogg'),
  },
  {
    id: 'fruitIn',
    file: 'buah-masuk.mp3',
    label: 'Buah masuk kantong',
    ...kenney('Impact Sounds', 'impact-sounds', 'impactSoft_medium_001.ogg'),
  },
  {
    id: 'fruitOut',
    file: 'buah-keluar.mp3',
    label: 'Buah dikeluarkan dari kantong',
    ...kenney('RPG Audio', 'rpg-audio', 'cloth2.ogg'),
  },
  {
    id: 'wrap',
    file: 'bungkus.mp3',
    label: 'Pesanan dibungkus',
    ...kenney('Casino Audio', 'casino-audio', 'cards-pack-open-2.ogg'),
  },
  {
    id: 'registerKeys',
    file: 'tombol-kasir.mp3',
    label: 'Tombol mesin kasir',
    ...kenney('Interface Sounds', 'interface-sounds', 'click_005.ogg dan click_003.ogg, disusun tujuh ketukan'),
  },
  {
    id: 'drawer',
    file: 'laci-kasir.mp3',
    label: 'Laci mesin kasir terbuka ("ka-ching")',
    ...freesound('CapsLok', 184438, 'Cash Register Fake.wav'),
  },
  {
    id: 'note',
    file: 'uang-kertas.mp3',
    label: 'Uang kertas ke nampan kembalian',
    ...kenney('Casino Audio', 'casino-audio', 'card-slide-2.ogg'),
  },
  {
    id: 'coin',
    file: 'koin.mp3',
    label: 'Koin ke nampan kembalian',
    ...kenney('RPG Audio', 'rpg-audio', 'handleCoins2.ogg'),
  },
  {
    id: 'correct',
    file: 'benar.mp3',
    label: 'Jawaban benar',
    ...kenney('Interface Sounds', 'interface-sounds', 'confirmation_001.ogg'),
  },
  {
    id: 'wrong',
    file: 'salah.mp3',
    label: 'Jawaban salah (lembut)',
    ...kenney('Interface Sounds', 'interface-sounds', 'bong_001.ogg'),
  },
  {
    id: 'fanfare',
    file: 'fanfare.mp3',
    label: 'Fanfare di layar hasil',
    ...kenney('Music Jingles', 'music-jingles', 'jingles_PIZZI01.ogg'),
  },
  {
    id: 'click',
    file: 'klik.mp3',
    label: 'Tombol ditekan',
    ...kenney('Interface Sounds', 'interface-sounds', 'click_002.ogg'),
  },
]
