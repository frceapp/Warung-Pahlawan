import { addFruit, checkBag, removeFruit } from './bag.js'
import { createCustomers } from './customers.js'
import { BAG_MATCH_MESSAGE, describeBagProblem, EMPTY_BAG_MESSAGE } from './feedback.js'

// Jalannya satu level sebagai reducer murni: (state, action) => state baru.
// Komponen React hanya menampilkan state dan mengirim aksi.

export const STEPS = [
  { id: 'greet', name: 'Sapa' },
  { id: 'pick', name: 'Ambil buah' },
  { id: 'count', name: 'Hitung' },
  { id: 'change', name: 'Kembalian' },
]

export function createSession(level, rng) {
  return {
    level,
    customers: createCustomers(level, rng),
    index: 0,
    step: 'greet',
    bag: {},
    mistakes: 0,
    feedback: null,
    feedbackCount: 0,
  }
}

export function getCurrentCustomer(state) {
  return state.customers[state.index]
}

function withFeedback(state, tone, text) {
  const id = state.feedbackCount + 1
  return { ...state, feedback: { id, tone, text }, feedbackCount: id }
}

function handleWrap(state) {
  if (Object.keys(state.bag).length === 0) {
    return withFeedback(state, 'info', EMPTY_BAG_MESSAGE)
  }
  const result = checkBag(getCurrentCustomer(state).order, state.bag)
  if (!result.isMatch) {
    return withFeedback(
      { ...state, mistakes: state.mistakes + 1 },
      'error',
      describeBagProblem(result),
    )
  }
  return withFeedback({ ...state, step: 'count' }, 'success', BAG_MATCH_MESSAGE)
}

export function sessionReducer(state, action) {
  switch (action.type) {
    case 'startServing':
      if (state.step !== 'greet') return state
      return { ...state, step: 'pick', feedback: null }

    case 'addFruit':
      if (state.step !== 'pick') return state
      return { ...state, bag: addFruit(state.bag, action.fruitId), feedback: null }

    case 'removeFruit':
      if (state.step !== 'pick') return state
      return { ...state, bag: removeFruit(state.bag, action.fruitId), feedback: null }

    case 'wrapOrder':
      if (state.step !== 'pick') return state
      return handleWrap(state)

    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}
