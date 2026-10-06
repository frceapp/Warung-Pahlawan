import { useEffect, useRef } from 'react'
import { playCorrect, playWrong } from './sfx.js'

// Bunyi untuk umpan balik baru: nada naik untuk jawaban benar, nada turun
// yang lembut untuk jawaban salah. Umpan balik yang sudah ada saat layar
// muncul tidak dibunyikan. Teksnya tetap ditampilkan di FeedbackMessage.
export function useFeedbackSound(feedback) {
  const id = feedback?.id
  const tone = feedback?.tone
  const lastId = useRef(id)
  useEffect(() => {
    if (id === undefined || id === lastId.current) return
    lastId.current = id
    if (tone === 'success') playCorrect()
    else if (tone === 'error') playWrong()
  }, [id, tone])
}
