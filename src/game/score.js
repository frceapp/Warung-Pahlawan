// Skor sesuai AGENTS.md bagian 3, "Skor".
export const POINTS_PER_CUSTOMER = 10
export const PENALTY_PER_MISTAKE = 2
export const MIN_POINTS_PER_CUSTOMER = 4

export function scoreCustomer(mistakes) {
  return Math.max(
    MIN_POINTS_PER_CUSTOMER,
    POINTS_PER_CUSTOMER - PENALTY_PER_MISTAKE * mistakes,
  )
}

export function getMaxScore(customerCount) {
  return customerCount * POINTS_PER_CUSTOMER
}

// 3 bintang jika skor minimal 90% dari maksimum, 2 jika minimal 60%,
// selain itu 1. Dihitung dengan bilangan bulat supaya tidak ada galat
// pembulatan desimal.
export function calculateStars(score, maxScore) {
  if (score * 10 >= maxScore * 9) return 3
  if (score * 10 >= maxScore * 6) return 2
  return 1
}
