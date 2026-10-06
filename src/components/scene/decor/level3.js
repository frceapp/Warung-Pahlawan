// Dekorasi latar level 3 (Pasar Besar): los pasar dengan beberapa lapak di
// belakang dan bendera kecil di atas. Hiasan dibuat besar dan boleh terpotong
// di tepi layar (kamera dekat). Format data: lihat WarungScene.jsx.
export default {
  wall: 'market',
  items: [
    { piece: 'flags', show: 'md', pos: { 'l-md': '0px', 'r-md': '0px', 't-md': '66px' } },
    { piece: 'stall', show: 'mobile', pos: { l: '-56px', t: '250px', w: '160px' } },
    { piece: 'stall', show: 'mobile', pos: { r: '-56px', t: '300px', w: '160px' } },
    { piece: 'sign', props: { lines: ['Warung', 'Pahlawan'] }, show: 'mobile', pos: { r: '-14px', t: '236px', w: '116px' } },
    { piece: 'stall', show: 'md', pos: { 'l-md': 'calc(50% - 20px)', 't-md': '300px', 'w-md': '240px' } },
    { piece: 'stall', show: 'lg', pos: { l: 'calc(50% + 250px)', t: '280px', w: '260px' } },
    { piece: 'sign', props: { lines: ['Warung Pahlawan'] }, show: 'mdOnly', pos: { 'r-md': '16px', 't-md': '300px', 'w-md': '220px' } },
    { piece: 'sign', props: { lines: ['Warung Pahlawan'] }, show: 'lg', pos: { 'l-lg': 'calc(50% - 365px)', 't-lg': '64px', 'w-lg': '180px' } },
    { piece: 'stall', show: 'xl', pos: { l: '-40px', t: '160px', w: '170px' } },
  ],
}
