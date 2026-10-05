import { STEP_CARD_TEXT } from '../data/sequence.js'
import { shuffle } from './random.js'
import { STEPS } from './session.js'

// Mode "Susun Langkah": anak menyusun kartu langkah melayani pembeli dalam
// urutan yang benar. Semua fungsi di sini murni; angka acak lewat `rng`.

export const CORRECT_ORDER = STEPS.map((step) => step.id)

// Mengacak kartu. Hasilnya tidak pernah langsung sama dengan urutan benar.
export function shuffleCards(ids, rng) {
  const result = shuffle(ids, rng)
  const alreadySolved = ids.length > 1 && result.every((id, index) => id === ids[index])
  return alreadySolved ? [...result.slice(1), result[0]] : result
}

export function createSequenceState(rng, correctOrder = CORRECT_ORDER) {
  return {
    correctOrder,
    pool: shuffleCards(correctOrder, rng),
    placed: [],
    result: null,
    checkCount: 0,
  }
}

// Membandingkan urutan yang disusun anak dengan urutan benar.
// wrongPositions: indeks kotak yang isinya belum pas.
export function checkSequence(placed, correctOrder) {
  const wrongPositions = placed
    .map((id, index) => (id === correctOrder[index] ? -1 : index))
    .filter((index) => index >= 0)
  const isComplete = placed.length === correctOrder.length
  return {
    isComplete,
    isCorrect: isComplete && wrongPositions.length === 0,
    emptySlots: correctOrder.length - placed.length,
    wrongPositions,
  }
}

export function sequenceReducer(state, action) {
  const isSolved = state.result?.isCorrect ?? false
  switch (action.type) {
    // Menaruh kartu di kotak kosong berikutnya.
    case 'place':
      if (isSolved || !state.pool.includes(action.id)) return state
      return {
        ...state,
        pool: state.pool.filter((id) => id !== action.id),
        placed: [...state.placed, action.id],
        result: null,
      }

    // Mengeluarkan kartu dari urutan; kartu sesudahnya naik satu kotak.
    case 'remove':
      if (isSolved || !state.placed.includes(action.id)) return state
      return {
        ...state,
        placed: state.placed.filter((id) => id !== action.id),
        pool: [...state.pool, action.id],
        result: null,
      }

    case 'check':
      return {
        ...state,
        result: checkSequence(state.placed, state.correctOrder),
        checkCount: state.checkCount + 1,
      }

    // Main lagi: `pool` adalah hasil shuffleCards yang dibuat pemanggil.
    case 'restart':
      return { ...state, pool: action.pool, placed: [], result: null }

    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

function stepName(id) {
  return STEPS.find((step) => step.id === id).name
}

// Kalimat umpan balik untuk anak, tanpa menyalahkan.
export function describeSequenceResult(result, correctOrder = CORRECT_ORDER) {
  if (!result.isComplete) {
    return {
      tone: 'info',
      text: `Taruh semua kartu dulu. Masih ${result.emptySlots} kotak kosong.`,
    }
  }
  if (result.isCorrect) {
    return {
      tone: 'success',
      text: `Urutannya pas: ${correctOrder.map(stepName).join(', ')}. Di coding, langkah yang dikerjakan satu per satu seperti ini namanya urutan (sequence). Komputer juga menjalankan perintah sesuai urutannya.`,
    }
  }
  const count = result.wrongPositions.length
  const firstWrong = result.wrongPositions[0]
  return {
    tone: 'error',
    text: `Ada ${count} kartu yang belum pas, ditandai "belum pas". Ingat: ${STEP_CARD_TEXT[correctOrder[firstWrong]].hint} Keluarkan kartunya, lalu susun lagi.`,
  }
}
