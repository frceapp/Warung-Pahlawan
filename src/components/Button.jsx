import { playClick } from '../lib/sfx.js'

const VARIANTS = {
  primary: 'bg-pisang text-tinta',
  secondary: 'bg-terpal text-kapur',
  quiet: 'bg-kapur text-tinta',
}

// Tombol gaya stiker. Tinggi minimal 48 px supaya mudah disentuh. Saat
// ditekan berbunyi klik halus (pelengkap; tombol juga turun terlihat).
function Button({ variant = 'primary', className = '', type = 'button', onClick, ...props }) {
  return (
    <button
      type={type}
      onClick={(event) => {
        playClick()
        onClick?.(event)
      }}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-4 border-tinta px-5 py-2 font-heading text-lg leading-tight shadow-[0_4px_0_var(--color-tinta)] transition-[transform,box-shadow] hover:shadow-[0_6px_0_var(--color-tinta)] duration-150 motion-safe:hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}

export default Button
