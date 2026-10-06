import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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

let documentStub
async function loadSfx({ stored = {}, hidden = false } = {}) {
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
  const sfx = await import('./sfx.js')
  return { sfx, storage }
}

const SOUNDS = [
  'playCustomerBell',
  'playPop',
  'playClick',
  'playCorrect',
  'playWrong',
  'playCoins',
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
    expect(sfx.playPop()).toBe(false)
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

  it.each([...SOUNDS, 'playFanfare'])('%s pendek (di bawah 400 ms) dan pelan', async (name) => {
    const { sfx } = await loadSfx()
    sfx.unlockAudio()
    const audio = FakeAudioContext.created[0]
    const plays = name === 'playFanfare' ? [1, 2, 3] : [undefined]
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
    expect(sfx.playCoins()).toBe(false)
    documentStub.hidden = false
    documentStub.listeners.visibilitychange()
    expect(audio.state).toBe('running')
    expect(sfx.playCoins()).toBe(true)
  })
})
