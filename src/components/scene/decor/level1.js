// Dekorasi latar level 1 (Warung Kecil): warung kayu sederhana, rak sedikit.
// Format data: lihat WarungScene.jsx.
export default {
  wall: 'planks',
  floor: 'planks',
  items: [
    // Papan nama: di HP dua baris di kanan atas, di tablet di dinding bawah
    // balon bicara, di layar lebar di celah header.
    { piece: 'sign', props: { lines: ['Warung', 'Pahlawan'] }, show: 'mobile', greet: true, pos: { r: '10px', t: '100px', w: '92px' } },
    {
      piece: 'sign',
      props: { lines: ['Warung Pahlawan'] },
      show: 'md',
      pos: { 'l-md': 'calc(50% - 170px)', 't-md': '346px', 'w-md': '180px', 'l-lg': 'calc(50% - 365px)', 't-lg': '64px' },
    },
    { piece: 'bananas', show: 'all', greet: true, pos: { l: '20px', t: '96px', w: '40px', 'l-md': 'calc(50% + 300px)', 't-md': '300px', 'w-md': '48px' } },
    {
      piece: 'shelf',
      props: { tiers: [['jar', 'jar', 'box']] },
      show: 'all',
      greet: true,
      pos: { r: '6px', t: '166px', w: '100px', 'r-md': 'auto', 'l-md': 'calc(50% + 40px)', 't-md': '338px', 'w-md': '124px' },
    },
    { piece: 'sacks', show: 'all', greet: true, pos: { l: '6px', t: '252px', w: '84px', 'l-md': 'calc(50% + 160px)', 't-md': '470px', 'w-md': '110px' } },
    // Sisi kiri dan kanan di layar lebar (terlihat di semua langkah).
    { piece: 'lamp', show: 'xl', pos: { l: '30px', t: '66px', w: '64px' } },
    { piece: 'calendar', show: 'xl', pos: { l: '36px', t: '190px', w: '52px' } },
    { piece: 'shelf', props: { tiers: [['jar', 'jar', 'box'], ['sack', 'can']] }, show: 'xl', pos: { r: '8px', t: '150px', w: '112px' } },
  ],
}
