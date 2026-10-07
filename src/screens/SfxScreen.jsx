import { useEffect, useState } from 'react'
import SoundToggle from '../components/SoundToggle.jsx'
import { loadSamples, previewSound, sampleStatus, unlockAudio } from '../lib/sfx.js'
import { SFX_FILES } from '../lib/sfxFiles.js'

// Halaman tersembunyi /?sfx: semua efek suara dengan tombol putar, nama
// berkas, dan sumbernya, supaya pemilik proyek bisa mendengarkan dan meminta
// ganti. Berkas baru dimuat setelah tombol pertama ditekan (sama seperti di
// permainan); sebelum siap atau kalau gagal, yang terdengar bunyi cadangan.

const STATUS = {
  idle: 'belum dimuat (tekan tombol putar)',
  loading: 'sedang dimuat',
  ready: 'siap',
  failed: 'gagal dimuat, memakai bunyi cadangan',
}

const PLAY = 'min-h-12 rounded-xl border-4 border-tinta px-4 py-2 font-heading text-base shadow-[0_3px_0_var(--color-tinta)] active:translate-y-1 active:shadow-none'

function SfxScreen() {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((n) => n + 1)

  useEffect(() => {
    document.title = 'Efek suara · Warung Pahlawan'
  }, [])

  function play(id, fallback = false) {
    unlockAudio()
    previewSound(id, { fallback })
    refresh()
    loadSamples()?.then(refresh)
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-4 bg-langit px-4 py-6 text-tinta">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl">Efek suara</h1>
        <SoundToggle />
      </header>
      <p className="max-w-prose">
        Semua bunyi di Warung Pahlawan. Tekan "Putar" untuk rekamannya, atau "Cadangan" untuk bunyi buatan Web Audio
        yang dipakai kalau berkas gagal dimuat. Semua rekaman berlisensi CC0; kreditnya ada di{' '}
        <code>docs/kredit-aset.md</code>.
      </p>
      <ul className="flex flex-col gap-3">
        {SFX_FILES.map((sound) => (
          <li
            key={sound.id}
            data-sfx-id={sound.id}
            className="flex flex-col gap-2 rounded-2xl border-4 border-tinta bg-kapur p-3 md:flex-row md:items-center md:gap-4"
          >
            <div className="flex shrink-0 gap-2">
              <button type="button" className={`${PLAY} bg-pisang`} onClick={() => play(sound.id)}>
                Putar
              </button>
              <button type="button" className={`${PLAY} bg-kapur`} onClick={() => play(sound.id, true)}>
                Cadangan
              </button>
            </div>
            <div className="min-w-0 text-sm md:text-base">
              <p className="font-bold">{sound.label}</p>
              <p>
                Berkas: <code>public/sfx/{sound.file}</code> ({STATUS[sampleStatus(sound.id)]})
              </p>
              <p>
                Asal: {sound.original}, oleh {sound.author}
                {sound.pack === 'Freesound' ? '' : `, paket ${sound.pack}`}.{' '}
                <a className="underline" href={sound.source} target="_blank" rel="noreferrer">
                  Sumber
                </a>{' '}
                · Lisensi {sound.license}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p>
        <a className="underline" href="./">
          Kembali ke beranda
        </a>
      </p>
    </main>
  )
}

export default SfxScreen
