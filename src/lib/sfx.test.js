import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SFX_FILES } from './sfxFiles.js'

// AudioContext palsu: mencatat nada yang dijadwalkan, tanpa bunyi sungguhan.
class FakeParam {
  constructor() {
    this.value = 1
    this.events = []
  }
  setValueAtTime(value, time) {
    this.events.push(['set', value, time])
  }
  exponentialRampToValueAtTime(value, time) {
    this.events.push(['ramp', value, time])
  }
}

class FakeAudioContext {
  static created = []
  constructor() {
    this.state = 'suspended'
    this.currentTime = 10
    this.destination = {}
    this.oscillators = []
    this.sources = []
    this.decoded = []
    this.resumeCalls = 0
    this.suspendCalls = 0
    FakeAudioContext.created.push(this)
  }
  resume() {
    this.resumeCalls += 1
    this.state = 'running'
  }
  suspend() {
    this.suspendCalls += 1
    this.state = 'suspended'
  }
  createGain() {
    return { gain: new FakeParam(), connect() {} }
  }
  createBufferSource() {
    const source = {
      buffer: null,
      playbackRate: new FakeParam(),
      connect() {},
      start(time) {
        source.startAt = time
      },
    }
    this.sources.push(source)
    return source
  }
  // Seperti Safari lama: hasil lewat callback (tanpa Promise).
  decodeAudioData(data, resolve) {
    this.decoded.push(data)
    resolve({ id: data.id })
  }
  createOscillator() {
    const oscillator = {
      type: 'sine',
      frequency: new FakeParam(),
      connect() {},
      start(time) {
        oscillator.startAt = time
      },
      stop(time) {
        oscillator.stopAt = time
      },
    }
    this.oscillators.push(oscillator)
    return oscillator
  }
}

function fakeStorage(initial = {}) {
  const data = { ...initial }
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value)
    },
  }
}

// fetch palsu untuk berkas di public/sfx/. failing: daftar nama berkas yang
// gagal dimuat; tanpa `files`, semua berkas gagal.
function fakeFetch({ ok = true, failing = [] } = {}) {
  const calls = []
  const fetch = (url) => {
    calls.push(url)
    const file = url.split('/').pop()
    if (!ok || failing.includes(file)) return Promise.resolve({ ok: false, status: 404 })
    return Promise.resolve({ ok: true, arrayBuffer: () => Promise.resolve({ id: file }) })
  }
  fetch.calls = calls
  return fetch
}

let documentStub
async function loadSfx({ stored = {}, hidden = false, fetch = fakeFetch({ ok: false }) } = {}) {
  vi.resetModules()
  FakeAudioContext.created = []
  const listeners = {}
  documentStub = {
    hidden,
    addEventListener: (type, listener) => {
      listeners[type] = listener
    },
    listeners,
  }
  const storage = fakeStorage(stored)
  vi.stubGlobal('AudioContext', FakeAudioContext)
  vi.stubGlobal('document', documentStub)
  vi.stubGlobal('localStorage', storage)
  vi.stubGlobal('fetch', fetch)
  const sfx = await import('./sfx.js')
  return { sfx, storage, fetch }
}

const SOUNDS = [
  'playDoorRoll',
  'playCustomerBell',
  'playFruitIn',
  'playFruitOut',
  'playWrap',
  'playRegisterKeys',
  'playDrawer',
  'playClick',
  'playCorrect',
  'playWrong',
]

describe('efek suara', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('belum membuat AudioContext sebelum sentuhan pertama', async () => {
    const { sfx } = await loadSfx()
    sfx.installAudioUnlock()
    expect(FakeAudioContext.created).toHaveLength(0)
    expect(sfx.playFruitIn()).toBe(false)
  })

  it('membuat AudioContext saat sentuhan pertama dan melanjutkannya bila tertunda', async () => {
    const { sfx } = await loadSfx()
    sfx.installAudioUnlock()
    documentStub.listeners.pointerdown()
    expect(FakeAudioContext.created).toHaveLength(1)
    expect(FakeAudioContext.created[0].resumeCalls).toBe(1)
    documentStub.listeners.keydown()
    expect(FakeAudioContext.created).toHaveLength(1)
  })

  it.each([...SOUNDS, 'playFanfare', 'playMoney'])('cadangan %s pendek (di bawah 400 ms) dan pelan', async (name) => {
    const { sfx } = await loadSfx()
    sfx.unlockAudio()
    const audio = FakeAudioContext.created[0]
    const plays = name === 'playFanfare' ? [1, 2, 3] : name === 'playMoney' ? [500, 5000] : [undefined]
    for (const stars of plays) {
      audio.oscillators = []
      expect(sfx[name](stars)).toBe(true)
      expect(audio.oscillators.length).toBeGreaterThan(0)
      const end = Math.max(...audio.oscillators.map((o) => o.stopAt)) - audio.currentTime
      expect(end).toBeLessThan(sfx.MAX_SOUND_S)
    }
    expect(sfx.MASTER_VOLUME).toBeLessThanOrEqual(0.25)
  })

  it('fanfare 3 bintang lebih meriah daripada 1 bintang', async () => {
    const { sfx } = await loadSfx()
    sfx.unlockAudio()
    const audio = FakeAudioContext.created[0]
    sfx.playFanfare(1)
    const oneStar = audio.oscillators.length
    audio.oscillators = []
    sfx.playFanfare(3)
    expect(audio.oscillators.length).toBeGreaterThan(oneStar)
  })

  it('menyimpan pilihan suara dengan key sendiri dan tidak berbunyi saat mati', async () => {
    const { sfx, storage } = await loadSfx()
    expect(sfx.isSoundOn()).toBe(true)
    sfx.unlockAudio()
    sfx.setSoundOn(false)
    expect(storage.data[sfx.SOUND_STORAGE_KEY]).toBe('off')
    expect(sfx.playCorrect()).toBe(false)
    expect(FakeAudioContext.created[0].suspendCalls).toBe(1)
  })

  it('membaca pilihan "mati" yang tersimpan', async () => {
    const { sfx } = await loadSfx({ stored: { warungPahlawanSuara: 'off' } })
    expect(sfx.isSoundOn()).toBe(false)
    expect(sfx.unlockAudio()).toBe(null)
    expect(FakeAudioContext.created).toHaveLength(0)
  })

  it('tetap jalan kalau localStorage tidak tersedia', async () => {
    const { sfx } = await loadSfx()
    vi.stubGlobal('localStorage', {
      getItem() {
        throw new Error('blocked')
      },
      setItem() {
        throw new Error('blocked')
      },
    })
    expect(() => sfx.setSoundOn(false)).not.toThrow()
    expect(sfx.isSoundOn()).toBe(false)
  })

  it('tidak berbunyi dan menghentikan suara saat tab tersembunyi', async () => {
    const { sfx } = await loadSfx()
    sfx.installAudioUnlock()
    documentStub.listeners.pointerdown()
    const audio = FakeAudioContext.created[0]
    documentStub.hidden = true
    documentStub.listeners.visibilitychange()
    expect(audio.suspendCalls).toBe(1)
    expect(sfx.playMoney(500)).toBe(false)
    documentStub.hidden = false
    documentStub.listeners.visibilitychange()
    expect(audio.state).toBe('running')
    expect(sfx.playMoney(500)).toBe(true)
  })

  it('baru memuat berkas suara setelah sentuhan pertama, sekali saja', async () => {
    const fetch = fakeFetch()
    const { sfx } = await loadSfx({ fetch })
    sfx.installAudioUnlock()
    expect(fetch.calls).toHaveLength(0)
    documentStub.listeners.pointerdown()
    documentStub.listeners.keydown()
    await sfx.loadSamples()
    expect(fetch.calls).toHaveLength(SFX_FILES.length)
    expect(fetch.calls.every((url) => /\/sfx\/[a-z0-9-]+\.mp3$/.test(url))).toBe(true)
    expect(SFX_FILES.every(({ id }) => sfx.sampleStatus(id) === 'ready')).toBe(true)
  })

  it('tidak memuat berkas suara kalau suara dimatikan', async () => {
    const fetch = fakeFetch()
    const { sfx } = await loadSfx({ fetch, stored: { warungPahlawanSuara: 'off' } })
    sfx.installAudioUnlock()
    documentStub.listeners.pointerdown()
    expect(fetch.calls).toHaveLength(0)
  })

  it('memutar rekaman lewat Web Audio setelah berkas siap', async () => {
    const { sfx } = await loadSfx({ fetch: fakeFetch() })
    sfx.unlockAudio()
    await sfx.loadSamples()
    const audio = FakeAudioContext.created[0]
    expect(sfx.playCorrect()).toBe(true)
    expect(audio.sources).toHaveLength(1)
    expect(audio.sources[0].buffer).toEqual({ id: 'benar.mp3' })
    expect(audio.oscillators).toHaveLength(0)
    sfx.playMoney(500)
    sfx.playMoney(2000)
    expect(audio.sources.slice(1).map((source) => source.buffer.id)).toEqual(['koin.mp3', 'uang-kertas.mp3'])
  })

  it('memakai bunyi sintetis lama kalau berkas gagal dimuat', async () => {
    const { sfx } = await loadSfx({ fetch: fakeFetch({ failing: ['salah.mp3'] }) })
    sfx.unlockAudio()
    await sfx.loadSamples()
    const audio = FakeAudioContext.created[0]
    expect(sfx.sampleStatus('wrong')).toBe('failed')
    expect(sfx.playWrong()).toBe(true)
    expect(audio.sources).toHaveLength(0)
    expect(audio.oscillators.length).toBeGreaterThan(0)
  })

  it('memakai bunyi sintetis selama berkas belum selesai dimuat', async () => {
    const pending = () => new Promise(() => {})
    const { sfx } = await loadSfx({ fetch: pending })
    sfx.unlockAudio()
    const audio = FakeAudioContext.created[0]
    expect(sfx.sampleStatus('doorBell')).toBe('loading')
    expect(sfx.playCustomerBell()).toBe(true)
    expect(audio.oscillators.length).toBeGreaterThan(0)
  })

  it('menjadwalkan langkah kaki pada waktu kaki menapak, bergantian dua rekaman', async () => {
    const { sfx } = await loadSfx({ fetch: fakeFetch() })
    sfx.unlockAudio()
    await sfx.loadSamples()
    const audio = FakeAudioContext.created[0]
    sfx.playFootsteps([0.09, 0.27, 0.456])
    const offsets = audio.sources.map((source) => source.startAt - audio.currentTime)
    for (const [i, t] of [0.09, 0.27, 0.456].entries()) expect(offsets[i]).toBeCloseTo(t, 6)
    expect(audio.sources.map((source) => source.buffer.id)).toEqual(['langkah-1.mp3', 'langkah-2.mp3', 'langkah-1.mp3'])
  })
})
