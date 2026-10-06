import { useSyncExternalStore } from 'react'
import { isSoundOn, setSoundOn, subscribeSound } from '../lib/sfx.js'
import Button from './Button.jsx'

// Tombol Suara di header: menyalakan atau mematikan efek suara. Pilihan
// disimpan di localStorage (lihat lib/sfx.js). Ikon dan aria-pressed selalu
// menunjukkan keadaannya, jadi tidak bergantung pada bunyi.
function SoundToggle({ className = '' }) {
  const on = useSyncExternalStore(subscribeSound, isSoundOn, () => true)
  return (
    <Button
      variant="quiet"
      aria-pressed={on}
      aria-label="Suara"
      title={on ? 'Suara menyala' : 'Suara mati'}
      onClick={() => setSoundOn(!on)}
      className={`w-12 shrink-0 px-0 md:w-auto md:px-3 ${className}`}
      data-sound-toggle
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-6 w-6 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
        {on ? (
          <>
            <path d="M15.5 9.2a4 4 0 0 1 0 5.6" />
            <path d="M18.3 6.6a7.5 7.5 0 0 1 0 10.8" />
          </>
        ) : (
          <path d="M16 9.5l5 5M21 9.5l-5 5" />
        )}
      </svg>
      <span className="hidden md:inline">Suara</span>
    </Button>
  )
}

export default SoundToggle
