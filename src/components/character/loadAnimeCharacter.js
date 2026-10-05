// Pemuat berkas karakter anime. Dipakai React.lazy di CustomerSpot dan untuk
// memuat lebih awal dari beranda, supaya pembeli pertama tidak menunggu.
export const loadAnimeCharacter = () => import('./AnimeCharacter.jsx')
