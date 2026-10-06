import { describe, expect, it } from 'vitest'
import { waitForReady } from './loadingGate.js'

// Jam tiruan: wait(ms) baru selesai saat tick(ms) dipanggil.
function fakeClock() {
  const timers = []
  return {
    wait: (ms) => new Promise((resolve) => timers.push({ ms, resolve })),
    tick(ms) {
      for (const timer of timers.filter((t) => t.ms === ms)) timer.resolve()
    },
  }
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))
const LIMITS = { minMs: 600, timeoutMs: 8000 }

describe('waitForReady', () => {
  it('menunggu minimal 600 ms walaupun pemuatan sudah selesai', async () => {
    const clock = fakeClock()
    let result = null
    waitForReady(Promise.resolve(), { ...LIMITS, wait: clock.wait }).then((r) => (result = r))
    await flush()
    expect(result).toBe(null)
    clock.tick(600)
    await flush()
    expect(result).toBe('ready')
  })

  it('siap begitu pemuatan selesai kalau sudah lewat 600 ms', async () => {
    const clock = fakeClock()
    let finish
    const task = new Promise((resolve) => (finish = resolve))
    let result = null
    waitForReady(task, { ...LIMITS, wait: clock.wait }).then((r) => (result = r))
    clock.tick(600)
    await flush()
    expect(result).toBe(null)
    finish()
    await flush()
    expect(result).toBe('ready')
  })

  it('gagal memuat menjadi error', async () => {
    const clock = fakeClock()
    const pending = waitForReady(Promise.reject(new Error('offline')), { ...LIMITS, wait: clock.wait })
    clock.tick(600)
    expect(await pending).toBe('error')
  })

  it('lebih dari 8 detik menjadi timeout', async () => {
    const clock = fakeClock()
    const pending = waitForReady(new Promise(() => {}), { ...LIMITS, wait: clock.wait })
    clock.tick(600)
    clock.tick(8000)
    expect(await pending).toBe('timeout')
  })
})
