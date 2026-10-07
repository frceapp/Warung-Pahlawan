import * as m from 'motion/react-m'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import BagImage from './BagImage.jsx'
import MoneyImage from './MoneyImage.jsx'

// Jeda sebelum terbang (tangan pembeli terangkat dulu) dan lama terbang.
const DELAY_MS = 380
const FLY_S = 0.65
// Tinggi bungkusan di tangan pembeli, dalam satuan gambar karakter (lihat
// shoppingBag di character/shoppingBag.jsx; lebar gambar karakter 100 satuan).
const BAG_UNITS = 25

// Bungkusan belanja dan uang kembalian berpindah dari meja kasir ke tangan
// pembeli. Posisi awal dibaca dari ServedStep ([data-handover-item]) dan
// tujuannya dari tangan pembeli ([data-hand-target] di gambar karakter).
// Salinannya terbang di lapisan tetap di atas layar; setelah sampai,
// onLanded dipanggil (pembeli lalu memegang bungkusan). Kalau "kurangi
// gerakan" aktif, tidak ada yang terbang: onLanded langsung dipanggil.
function HandoverFlight({ change, reduce, onLanded }) {
  const [flights, setFlights] = useState(null)
  const landedRef = useRef(onLanded)
  useLayoutEffect(() => {
    landedRef.current = onLanded
  })

  useEffect(() => {
    if (reduce) {
      const timer = setTimeout(() => landedRef.current?.(), 150)
      return () => clearTimeout(timer)
    }
    const timer = setTimeout(() => {
      const hand = document.querySelector('[data-customer-figure] [data-hand-target]')
      const svg = hand?.closest('svg')
      const sources = [...document.querySelectorAll('[data-handover-item]')]
      if (!hand || !svg || sources.length === 0) {
        landedRef.current?.()
        return
      }
      // Yang di meja disembunyikan; salinannya yang terbang.
      for (const source of sources) source.style.visibility = 'hidden'
      const target = hand.getBoundingClientRect()
      const unit = svg.getBoundingClientRect().width / 100
      const bagHeight = BAG_UNITS * unit
      setFlights(
        sources.map((source) => {
          const rect = source.getBoundingClientRect()
          const kind = source.dataset.handoverItem
          const scale = kind === 'bag' ? bagHeight / rect.height : 0.5
          // Bungkusan dipegang di pegangannya (tengah atas); uang menuju
          // tangan lalu menghilang (disimpan pembeli).
          const toX = target.left - (rect.left + rect.width / 2)
          const toY = kind === 'bag' ? target.top - rect.top : target.top - (rect.top + rect.height / 2)
          return { kind, rect, toX, toY, scale }
        }),
      )
    }, DELAY_MS)
    return () => clearTimeout(timer)
  }, [reduce])

  if (!flights) return null
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40">
      {flights.map((flight) => (
        <m.div
          key={flight.kind}
          className="absolute"
          style={{
            left: flight.rect.left,
            top: flight.rect.top,
            width: flight.rect.width,
            height: flight.rect.height,
            originX: 0.5,
            originY: flight.kind === 'bag' ? 0 : 0.5,
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: flight.toX,
            y: flight.toY,
            scale: flight.scale,
            opacity: flight.kind === 'bag' ? 1 : [1, 1, 0],
          }}
          transition={{ duration: FLY_S, ease: 'easeInOut', delay: flight.kind === 'bag' ? 0 : 0.08 }}
          onAnimationComplete={() => {
            if (flight.kind === 'bag') landedRef.current?.()
          }}
        >
          {flight.kind === 'bag' ? (
            <BagImage size={flight.rect.width} className="h-full w-full" />
          ) : (
            <div className="flex h-full w-full flex-wrap items-center justify-center gap-0.5">
              {[...new Set(change)]
                .sort((a, b) => b - a)
                .map((value) => (
                  <MoneyImage key={value} value={value} size={56} decorative className="h-6 w-10 md:h-[34px] md:w-14" />
                ))}
            </div>
          )}
        </m.div>
      ))}
    </div>
  )
}

export default HandoverFlight
