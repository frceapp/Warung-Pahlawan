import { paint } from './paint.js'

// Bungkusan belanja: kantong kertas cokelat berisi buah, bibirnya dilipat.
// Dipegang pada pegangannya: titik pegang di (0, 0), kantong menggantung di
// bawahnya.
export function shoppingBag() {
  return (
    <>
      <path d="M-4.6 3.4 C-4.6 -1.4 4.6 -1.4 4.6 3.4" fill="none" strokeWidth="2" />
      <path fill={paint('pisang')} d="M-6.4 4.4 C-6 -0.6 -1.6 -1.8 1 0.4 C-2.2 0.8 -4.4 2.6 -4.8 4.6 Z" strokeWidth="1.6" />
      <circle cx="3.4" cy="2.6" r="3" fill={paint('cabai')} strokeWidth="1.6" />
      <path d="M3.4 -0.2 Q4.6 -1.8 6 -1.4" fill="none" stroke={paint('daun')} strokeWidth="1.6" />
      <path fill={paint('kayu')} d="M-8.4 4 L8.4 4 L9.8 19.6 C9.8 20.8 9 21.4 7.8 21.4 L-7.8 21.4 C-9 21.4 -9.8 20.8 -9.8 19.6 Z" />
      <path fill={paint('kapur')} d="M-8.4 4 L8.4 4 L8.7 8 L-8.7 8 Z" strokeWidth="1.6" />
    </>
  )
}
