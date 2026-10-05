const STAR_PATH =
  'M12 2.5 L14.8 8.6 L21.5 9.3 L16.5 13.8 L17.9 20.4 L12 17 L6.1 20.4 L7.5 13.8 L2.5 9.3 L9.2 8.6 Z'

// Bintang 1 sampai 3. Jumlahnya selalu juga tertulis sebagai teks.
function StarRating({ stars, size = 28, label }) {
  const text = label ?? `${stars} dari 3 bintang`
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={text}>
      {[1, 2, 3].map((index) => (
        <svg key={index} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
          <path
            d={STAR_PATH}
            className={`stroke-tinta ${index <= stars ? 'fill-pisang' : 'fill-kapur'}`}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  )
}

export default StarRating
