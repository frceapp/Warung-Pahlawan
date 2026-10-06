// Dekorasi latar level 2 (Warung Ramai): rak lebih penuh, lampu menyala
// hangat, dan spanduk kecil. Format data: lihat WarungScene.jsx.
export default {
  wall: 'plain',
  wainscot: true,
  floor: 'tiles',
  items: [
    { piece: 'sign', props: { lines: ['Warung', 'Pahlawan'] }, show: 'mobile', greet: true, pos: { r: '10px', t: '100px', w: '92px' } },
    {
      piece: 'sign',
      props: { lines: ['Warung Pahlawan'] },
      show: 'md',
      pos: { 'l-md': 'calc(50% - 170px)', 't-md': '346px', 'w-md': '180px', 'l-lg': 'calc(50% - 365px)', 't-lg': '64px' },
    },
    {
      piece: 'shelf',
      props: { tiers: [['jar', 'jar', 'can'], ['box', 'sack', 'bottle']] },
      show: 'all',
      greet: true,
      pos: { l: '6px', t: '104px', w: '108px', 'l-md': 'calc(50% + 230px)', 't-md': '300px', 'w-md': '120px' },
    },
    { piece: 'shelf', props: { tiers: [['jar', 'bottle', 'jar']] }, show: 'mobile', greet: true, pos: { r: '6px', t: '166px', w: '100px' } },
    { piece: 'crates', show: 'all', greet: true, pos: { l: '4px', t: '246px', w: '76px', 'l-md': 'calc(50% + 200px)', 't-md': '470px', 'w-md': '100px' } },
    {
      piece: 'banner',
      props: { text: 'Buah Segar' },
      show: 'sm',
      greet: true,
      pos: { r: '16px', t: '250px', w: '150px', 'r-md': 'auto', 'l-md': 'calc(50% + 20px)', 't-md': '346px', 'w-md': '190px', 't-lg': '340px' },
    },
    { piece: 'sacks', show: 'md', greet: true, pos: { 'l-md': 'calc(50% - 300px)', 't-md': '480px', 'w-md': '100px' } },
    { piece: 'lamp', props: { lit: true }, show: 'xl', pos: { l: '30px', t: '66px', w: '64px' } },
    { piece: 'poster', show: 'xl', pos: { l: '40px', t: '200px', w: '48px' } },
    {
      piece: 'shelf',
      props: { tiers: [['jar', 'jar', 'can'], ['bottle', 'jar', 'box'], ['sack', 'sack', 'box']] },
      show: 'xl',
      pos: { r: '8px', t: '130px', w: '116px' },
    },
  ],
}
