import { addFruit, checkBag, removeFruit } from './bag.js'
import { createTotalChoices } from './choices.js'
import { createCustomers } from './customers.js'
import {
  BAG_MATCH_MESSAGE,
  describeBagProblem,
  describeChange,
  describeServed,
  describeTotalCorrect,
  describeWrongTotal,
  EMPTY_BAG_MESSAGE,
  EMPTY_CHANGE_MESSAGE,
} from './feedback.js'
import { checkChange } from './payment.js'
import { calculateStars, getMaxScore, scoreCustomer } from './score.js'

// Jalannya satu level sebagai reducer murni: (state, action) => state baru.
// Komponen React hanya menampilkan state dan mengirim aksi.
// Langkah: greet -> pick -> count -> change -> served, lalu pembeli
// berikutnya. Setelah pembeli terakhir: finished.

export const STEPS = [
  { id: 'greet', name: 'Sapa' },
  { id: 'pick', name: 'Ambil buah' },
  { id: 'count', name: 'Hitung' },
  { id: 'change', name: 'Kembalian' },
]

export function createSession(level, rng) {
  const customers = createCustomers(level, rng).map((customer) => ({
    ...customer,
    totalChoices: createTotalChoices(customer.order, rng),
  }))
  return {
    level,
    customers,
    index: 0,
    step: 'greet',
    bag: {},
    wrongTotals: [],
    givenChange: [],
    mistakes: 0,
    results: [],
    feedback: null,
    feedbackCount: 0,
  }
}

export function getCurrentCustomer(state) {
  return state.customers[state.index]
}

export function getSessionScore(state) {
  return state.results.reduce((sum, result) => sum + result.score, 0)
}

// Ringkasan untuk layar hasil.
export function summarizeSession(state) {
  const score = getSessionScore(state)
  const maxScore = getMaxScore(state.customers.length)
  return {
    levelId: state.level.id,
    score,
    maxScore,
    stars: calculateStars(score, maxScore),
    results: state.results,
  }
}

function withFeedback(state, tone, text) {
  const id = state.feedbackCount + 1
  return { ...state, feedback: { id, tone, text }, feedbackCount: id }
}

function addMistake(state) {
  return { ...state, mistakes: state.mistakes + 1 }
}

function handleWrap(state) {
  if (Object.keys(state.bag).length === 0) {
    return withFeedback(state, 'info', EMPTY_BAG_MESSAGE)
  }
  const result = checkBag(getCurrentCustomer(state).order, state.bag)
  if (!result.isMatch) {
    return withFeedback(addMistake(state), 'error', describeBagProblem(result))
  }
  return withFeedback({ ...state, step: 'count' }, 'success', BAG_MATCH_MESSAGE)
}

function handleChooseTotal(state, amount) {
  const { total } = getCurrentCustomer(state)
  if (amount === total) {
    return withFeedback({ ...state, step: 'change' }, 'success', describeTotalCorrect(total))
  }
  if (state.wrongTotals.includes(amount)) return state
  return withFeedback(
    addMistake({ ...state, wrongTotals: [...state.wrongTotals, amount] }),
    'error',
    describeWrongTotal(amount),
  )
}

function handleChange(state, givenValues) {
  const customer = getCurrentCustomer(state)
  const result = checkChange(givenValues, customer.payment)
  if (!result.isCorrect) {
    return withFeedback(addMistake(state), 'error', describeChange(result, customer.payment))
  }
  const score = scoreCustomer(state.mistakes)
  const served = {
    ...state,
    step: 'served',
    results: [
      ...state.results,
      { character: customer.character, fact: customer.fact, mistakes: state.mistakes, score },
    ],
  }
  return withFeedback(
    served,
    'success',
    `${describeChange(result, customer.payment)} ${describeServed(score)}`,
  )
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

    // Level dengan total yang langsung ditampilkan: anak cukup lanjut.
    case 'confirmTotal':
      if (state.step !== 'count' || state.level.totalMode !== 'shown') return state
      return handleChooseTotal(state, getCurrentCustomer(state).total)

    case 'chooseTotal':
      if (state.step !== 'count') return state
      return handleChooseTotal(state, action.amount)

    case 'addMoney':
      if (state.step !== 'change' || !state.level.drawer.includes(action.value)) return state
      return { ...state, givenChange: [...state.givenChange, action.value], feedback: null }

    case 'removeMoney':
      if (state.step !== 'change') return state
      return {
        ...state,
        givenChange: state.givenChange.filter((_, index) => index !== action.index),
        feedback: null,
      }

    case 'clearMoney':
      if (state.step !== 'change') return state
      return { ...state, givenChange: [], feedback: null }

    case 'giveChange':
      if (state.step !== 'change') return state
      if (state.givenChange.length === 0) {
        return withFeedback(state, 'info', EMPTY_CHANGE_MESSAGE)
      }
      return handleChange(state, state.givenChange)

    case 'noChange':
      if (state.step !== 'change') return state
      return handleChange(state, [])

    case 'nextCustomer': {
      if (state.step !== 'served') return state
      if (state.index + 1 >= state.customers.length) {
        return { ...state, step: 'finished', feedback: null }
      }
      return {
        ...state,
        index: state.index + 1,
        step: 'greet',
        bag: {},
        wrongTotals: [],
        givenChange: [],
        mistakes: 0,
        feedback: null,
      }
    }

    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}
