// Dekorasi latar level 3 (Pasar Besar): los pasar dengan beberapa lapak di
// belakang dan bendera kecil di atas. Format data: lihat WarungScene.jsx.
export default {
  wall: 'market',
  floor: 'concrete',
  items: [
    { piece: 'flags', show: 'md', pos: { 'l-md': '0px', 'r-md': '0px', 't-md': '66px' } },
    { piece: 'stall', show: 'all', greet: true, pos: { l: '0px', t: '120px', w: '112px', 'l-md': 'calc(50% - 220px)', 't-md': '296px', 'w-md': '150px' } },
    { piece: 'stall', show: 'all', greet: true, pos: { r: '0px', t: '160px', w: '104px', 'r-md': 'auto', 'l-md': 'calc(50% - 30px)', 't-md': '296px', 'w-md': '150px' } },
    { piece: 'stall', show: 'md', greet: true, pos: { 'l-md': 'calc(50% + 160px)', 't-md': '296px', 'w-md': '150px' } },
    { piece: 'sign', props: { lines: ['Warung', 'Pahlawan'] }, show: 'mobile', greet: true, pos: { r: '10px', t: '100px', w: '92px' } },
    {
      piece: 'sign',
      props: { lines: ['Warung Pahlawan'] },
      show: 'md',
      pos: { 'l-md': 'calc(50% - 170px)', 't-md': '346px', 'w-md': '180px', 'l-lg': 'calc(50% - 365px)', 't-lg': '64px' },
    },
    { piece: 'sacks', show: 'all', greet: true, pos: { l: '4px', t: '256px', w: '80px', 'l-md': 'calc(50% - 300px)', 't-md': '480px', 'w-md': '100px' } },
    { piece: 'crates', show: 'md', greet: true, pos: { 'l-md': 'calc(50% + 250px)', 't-md': '470px', 'w-md': '90px' } },
    { piece: 'stall', show: 'xl', pos: { l: '0px', t: '150px', w: '124px' } },
    { piece: 'stall', show: 'xl', pos: { r: '0px', t: '150px', w: '124px' } },
  ],
}
