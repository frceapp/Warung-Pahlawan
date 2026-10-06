// Dekorasi latar level 1 (Warung Kecil): warung kayu sederhana, rak sedikit.
// Hiasan dibuat besar dan boleh terpotong di tepi layar (kamera dekat).
// Format data: lihat WarungScene.jsx.
export default {
  wall: 'planks',
  items: [
    // Papan nama: di HP dua baris di kanan, di tablet di dinding kanan, di
    // layar lebar di celah header.
    { piece: 'sign', props: { lines: ['Warung', 'Pahlawan'] }, show: 'mobile', pos: { r: '-14px', t: '236px', w: '116px' } },
    { piece: 'sign', props: { lines: ['Warung Pahlawan'] }, show: 'mdOnly', pos: { 'r-md': '16px', 't-md': '300px', 'w-md': '220px' } },
    { piece: 'sign', props: { lines: ['Warung Pahlawan'] }, show: 'lg', pos: { 'l-lg': 'calc(50% - 365px)', 't-lg': '64px', 'w-lg': '180px' } },
    { piece: 'bananas', show: 'all', pos: { l: '6px', t: '236px', w: '52px', 'l-md': 'calc(50% + 30px)', 't-md': '280px', 'w-md': '84px' } },
    { piece: 'shelf', props: { tiers: [['jar', 'box']] }, show: 'mobile', pos: { l: '-70px', t: '352px', w: '140px' } },
    { piece: 'shelf', props: { tiers: [['jar', 'jar', 'box']] }, show: 'mobile', pos: { r: '-60px', t: '330px', w: '150px' } },
    { piece: 'shelf', props: { tiers: [['jar', 'jar', 'box'], ['sack', 'can', 'jar']] }, show: 'lg', pos: { r: '-60px', t: '296px', w: '360px' } },
    { piece: 'lamp', show: 'xl', pos: { l: '20px', t: '64px', w: '90px' } },
    { piece: 'calendar', show: 'xl', pos: { l: '30px', t: '220px', w: '72px' } },
  ],
}
