// Dekorasi latar level 2 (Warung Ramai): rak lebih penuh, lampu menyala
// hangat, dan spanduk kecil. Hiasan dibuat besar dan boleh terpotong di tepi
// layar (kamera dekat). Format data: lihat WarungScene.jsx.
export default {
  wall: 'plain',
  items: [
    { piece: 'sign', props: { lines: ['Warung', 'Pahlawan'] }, show: 'mobile', pos: { r: '-14px', t: '236px', w: '116px' } },
    { piece: 'sign', props: { lines: ['Warung Pahlawan'] }, show: 'mdOnly', pos: { 'r-md': '16px', 't-md': '300px', 'w-md': '220px' } },
    { piece: 'sign', props: { lines: ['Warung Pahlawan'] }, show: 'lg', pos: { 'l-lg': 'calc(50% - 365px)', 't-lg': '64px', 'w-lg': '180px' } },
    {
      piece: 'shelf',
      props: { tiers: [['jar', 'jar', 'can'], ['box', 'sack', 'bottle'], ['jar', 'bottle', 'jar']] },
      show: 'mobile',
      pos: { l: '-76px', t: '238px', w: '150px' },
    },
    { piece: 'shelf', props: { tiers: [['jar', 'bottle', 'jar'], ['can', 'box', 'can']] }, show: 'mobile', pos: { r: '-64px', t: '320px', w: '150px' } },
    { piece: 'banner', props: { text: 'Buah Segar' }, show: 'md', pos: { 'l-md': 'calc(50% - 80px)', 't-md': '340px', 'w-md': '300px' } },
    {
      piece: 'shelf',
      props: { tiers: [['jar', 'jar', 'can', 'jar'], ['bottle', 'jar', 'box', 'bottle'], ['sack', 'sack', 'box', 'can']] },
      show: 'lg',
      pos: { r: '-50px', t: '250px', w: '380px' },
    },
    { piece: 'lamp', props: { lit: true }, show: 'lg', pos: { l: 'calc(50% + 90px)', t: '200px', w: '120px' } },
    { piece: 'lamp', props: { lit: true }, show: 'xl', pos: { l: '20px', t: '64px', w: '90px' } },
    { piece: 'poster', show: 'xl', pos: { l: '34px', t: '230px', w: '64px' } },
  ],
}
