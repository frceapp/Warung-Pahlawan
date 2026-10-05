// Fitur animasi Motion (domAnimation) dimuat terpisah oleh LazyMotion di
// main.jsx, supaya bundel awal hanya berisi komponen `m` yang ringan.
import { domAnimation } from 'motion/react'

export default domAnimation
