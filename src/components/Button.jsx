const VARIANTS = {
  primary: 'bg-pisang text-tinta',
  secondary: 'bg-terpal text-kapur',
  quiet: 'bg-kapur text-tinta',
}

// Tombol gaya stiker. Tinggi minimal 48 px supaya mudah disentuh.
function Button({ variant = 'primary', className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-4 border-tinta px-5 py-2 font-heading text-lg leading-tight shadow-[0_4px_0_var(--color-tinta)] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}

export default Button
