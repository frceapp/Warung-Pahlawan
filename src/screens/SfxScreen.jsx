import { useEffect, useState } from 'react'
import SoundToggle from '../components/SoundToggle.jsx'
import { bufferToMono, gainToDb, measureLoudness } from '../lib/loudness.js'
import { fallbackKey, loadSamples, previewSound, renderSynth, sampleBuffer, sampleStatus, unlockAudio } from '../lib/sfx.js'
import { SELF_MADE_SOUNDS, SFX_FILES } from '../lib/sfxFiles.js'
import { gainFor, playbackGain } from '../lib/sfxGain.js'

// Halaman tersembunyi /?sfx: semua efek suara dengan tombol putar, kekerasan
// tiap bunyi (LUFS dan puncak, juga setelah gain di game), nama berkas, dan
// sumbernya, supaya pemilik proyek bisa mendengarkan dan meminta ganti.
// Berkas baru dimuat setelah tombol pertama ditekan (sama seperti di
// permainan); sebelum siap atau kalau gagal, yang terdengar bunyi cadangan.

const STATUS = {
  idle: 'belum dimuat (tekan tombol putar)',
  loading: 'sedang dimuat',
  ready: 'siap',
  failed: 'gagal dimuat, memakai bunyi cadangan',
}

const PLAY =
  'min-h-12 rounded-xl border-4 border-tinta px-4 py-2 font-heading text-base shadow-[0_3px_0_var(--color-tinta)] active:translate-y-1 active:shadow-none'

const COMPARE = [
  { label: 'Benar', id: 'correct' },
  { label: 'Salah', id: 'wrong' },
  { label: 'Fanfare 3 bintang', id: 'fanfare', stars: 3 },
  { label: 'Fanfare 2 bintang', id: 'fanfare', stars: 2 },
  { label: 'Fanfare 1 bintang', id: 'fanfare', stars: 1 },
]

const SYNTH_KEYS = ['correct', 'fanfare3', 'fanfare2', 'fanfare1', ...new Set(SFX_FILES.map(({ id }) => fallbackKey(id)))]

const decimal = (value, digits = 1) => (Number.isFinite(value) ? value.toFixed(digits).replace('.', ',') : '-')

function measure(buffer) {
  return buffer ? measureLoudness(bufferToMono(buffer), buffer.sampleRate) : null
}

// "-20,0 LUFS, puncak -3,4 dB; di game -27,0 LUFS"
function Loudness({ label, result, gain }) {
  if (!result) return null
  return (
    <p data-loudness={label}>
      {label}: <span className="font-bold">{decimal(result.lufs)} LUFS</span>, puncak {decimal(result.peakDb)} dB; di game{' '}
      <span className="font-bold">{decimal(result.lufs + gainToDb(gain))} LUFS</span>
    </p>
  )
}

function SfxScreen() {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((n) => n + 1)
  // Kekerasan bunyi Web Audio (dirender tanpa diputar) dan rekaman (setelah dimuat).
  const [synth, setSynth] = useState({})
  const [files, setFiles] = useState({})

  useEffect(() => {
    document.title = 'Efek suara · Warung Pahlawan'
    let alive = true
    Promise.all(SYNTH_KEYS.map(async (key) => [key, measure(await renderSynth(key))])).then((rows) => {
      if (alive) setSynth(Object.fromEntries(rows))
    })
    return () => {
      alive = false
    }
  }, [])

  function measureFiles() {
    setFiles(Object.fromEntries(SFX_FILES.map(({ id }) => [id, measure(sampleBuffer(id))])))
    refresh()
  }

  function play(id, options = {}) {
    unlockAudio()
    previewSound(id, options)
    refresh()
    loadSamples()?.then(measureFiles)
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-4 bg-langit px-4 py-6 text-tinta">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl">Efek suara</h1>
        <SoundToggle />
      </header>
      <p className="max-w-prose">
        Semua bunyi di Warung Pahlawan. Tekan "Putar" untuk rekamannya, atau "Cadangan" untuk bunyi buatan Web Audio
        yang dipakai kalau berkas gagal dimuat. Kekerasan diukur dengan BS.1770 (LUFS) sepanjang bunyi; "di game" sudah
        termasuk gain tiap bunyi, level bersama, dan volume utama (<code>src/lib/sfxGain.js</code>). Rekaman berlisensi
        CC0; kreditnya ada di <code>docs/kredit-aset.md</code>.
      </p>

      <section aria-labelledby="compare-title" className="flex flex-col gap-2 rounded-2xl border-4 border-tinta bg-kapur p-3">
        <h2 id="compare-title" className="font-heading text-2xl">
          Bandingkan bunyi menang dan salah
        </h2>
        <div className="flex flex-wrap gap-2" data-compare="">
          {COMPARE.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`${PLAY} ${item.id === 'wrong' ? 'bg-kapur' : 'bg-pisang'}`}
              onClick={() => play(item.id, { stars: item.stars })}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <h2 className="font-heading text-2xl">Bunyi buatan sendiri</h2>
      <ul className="flex flex-col gap-3">
        {SELF_MADE_SOUNDS.map((sound) => (
          <li key={sound.id} data-sfx-id={sound.id} className="flex flex-col gap-2 rounded-2xl border-4 border-tinta bg-kapur p-3">
            <p className="font-bold">{sound.label}</p>
            <p className="text-sm md:text-base">
              Dibuat sendiri lewat Web Audio (<code>src/lib/sfxTunes.js</code>), tanpa berkas. Gain {decimal(gainFor(sound.id), 2)}.
            </p>
            <div className="text-sm md:text-base">
              {sound.id === 'correct' ? (
                <Loudness label="Bunyi" result={synth.correct} gain={playbackGain('correct', { sample: false })} />
              ) : (
                [3, 2, 1].map((stars) => (
                  <Loudness
                    key={stars}
                    label={`${stars} bintang`}
                    result={synth[`fanfare${stars}`]}
                    gain={playbackGain('fanfare', { sample: false })}
                  />
                ))
              )}
            </div>
          </li>
        ))}
      </ul>

      <h2 className="font-heading text-2xl">Rekaman</h2>
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
              <button type="button" className={`${PLAY} bg-kapur`} onClick={() => play(sound.id, { fallback: true })}>
                Cadangan
              </button>
            </div>
            <div className="min-w-0 text-sm md:text-base">
              <p className="font-bold">{sound.label}</p>
              <p>
                Berkas: <code>public/sfx/{sound.file}</code> ({STATUS[sampleStatus(sound.id)]}). Gain {decimal(gainFor(sound.id), 2)}.
              </p>
              <Loudness label="Berkas" result={files[sound.id]} gain={playbackGain(sound.id)} />
              <Loudness
                label="Cadangan"
                result={synth[fallbackKey(sound.id)]}
                gain={playbackGain(sound.id, { sample: false })}
              />
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
