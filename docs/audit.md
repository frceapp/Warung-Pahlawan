# Audit dan optimasi (Tugas 10)

Hasil audit performa, aksesibilitas, SEO, ketahanan, dan tata letak untuk prompt P20. "Sebelum" diukur pada `main` commit `8f04e48` sebelum ada perubahan. "Sesudah" diukur pada branch PR untuk prompt ini dengan cara yang sama.

## Cara mengukur

- **Lighthouse 13.5.0**, mode mobile bawaan (layar HP, CPU diperlambat 4 kali, jaringan 4G lambat), di Chromium 141 headless. Setiap halaman diukur 5 kali, dan yang dicatat adalah median.
- **Build produksi** (`npm run build`) dijalankan di server lokal yang meniru Vercel:
  - gzip;
  - header cache dari `vercel.json`;
  - path tanpa titik diarahkan ke `index.html`;
  - `404.html` untuk berkas yang tidak ada.
- **Beranda:** mode navigasi (pemuatan halaman) dengan throttling simulasi.
- **Layar permainan:** alur pengguna Lighthouse dalam tiga bagian:
  1. Buka beranda.
  2. Rentang waktu (timespan) dari ketukan "Buka warung" Warung Kecil sampai pembeli pertama selesai datang. Bagian ini memakai throttling devtools, karena throttling simulasi tidak tersedia untuk timespan.
  3. Snapshot layar permainan untuk Accessibility, Best Practices, dan SEO.

  Layar permainan bukan pemuatan halaman baru, jadi LCP tidak berlaku. Interaksinya diukur dengan INP.
- **Ukuran bundle:** gzip level 9 per berkas hasil build. "Modul terbesar" adalah ukuran modul di dalam chunk setelah tree-shaking dan sebelum minify, dikelompokkan per paket npm atau per berkas sumber.

## Lighthouse

### Beranda (navigasi, mobile)

| | Sebelum | Sesudah |
| --- | --- | --- |
| Performance | 98 (run: 98, 97, 98, 100, 98) | 98 (run: 97, 98, 99, 100, 98) |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| FCP | 1.954 ms | 1.855 ms |
| LCP | 1.954 ms | 1.855 ms |
| TBT | 0 ms | 0 ms |
| CLS | 0,020 | 0,020 |
| JavaScript tidak terpakai (perkiraan Lighthouse) | 61 KiB | 47 KiB |
| CSS yang memblokir render (perkiraan penghematan) | 750 ms | 450 ms |
| Total transfer selama pengukuran | 182,6 kB | 183,3 kB |

### Layar permainan (alur pengguna, mobile)

| | Sebelum | Sesudah |
| --- | --- | --- |
| Performance (timespan) | 93 (run: 87, 93, 97, 98, 91) | 100 (run: 100, 100, 100, 100, 100) |
| TBT | 219 ms | 39 ms |
| INP (ketukan "Buka warung") | 326 ms | 98 ms |
| CLS | 0,000 | 0,000 |
| Accessibility (snapshot) | 100 | 100 |
| Best Practices (snapshot) | 100 | 100 |
| SEO (snapshot) | 100 | 100 |
| LCP | tidak berlaku (perpindahan layar di dalam halaman) | tidak berlaku |

## Ukuran bundle

### Per chunk (gzip)

| Chunk | Sebelum | Sesudah | Kapan dimuat |
| --- | --- | --- | --- |
| `index` (JS awal) | 101,08 kB | 84,44 kB | saat halaman dibuka |
| `jsx-runtime` | (di dalam `index`) | 0,56 kB | saat halaman dibuka |
| CSS | 11,88 kB | 7,96 kB | saat halaman dibuka |
| `PlayScreen` | (di dalam `index`) | 13,35 kB | saat beranda senggang |
| `visual-element` (Motion) | 9,06 kB | 9,09 kB | setelah aplikasi tampil, bersama `motionFeatures` |
| `AnimeCharacter` | 7,28 kB | 7,30 kB | saat beranda senggang |
| `motionFeatures` (LazyMotion) | 5,91 kB | 5,97 kB | setelah aplikasi tampil |
| `ResultScreen` | 2,94 kB | 2,97 kB | saat layar hasil dibuka |
| `elements`, `is-svg-component`, `is-html-element` (Motion, dipakai bersama) | (di dalam `index`) | 2,96 + 1,68 + 0,12 kB | bersama `motionFeatures`, `PlayScreen`, atau `AnimeCharacter` |
| `WarungScene` | 2,81 kB | 2,83 kB | saat beranda senggang |
| `characters` (data tokoh, bersama) | (di dalam `index`) | 0,87 kB | bersama `PlayScreen` |
| Data dekorasi level 1, 2, 3 | 0,37 / 0,44 / 0,31 kB | sama | saat level dibuka |
| Font yang dihasilkan build | 10 berkas (latin dan latin-ext) | 6 berkas (latin saja) | sesuai teks yang tampil |

**Dimuat saat halaman dibuka (JS dan CSS, gzip):** 112,96 kB sebelum, 92,96 kB sesudah.

**Total semua chunk JS (gzip):** 130,2 kB sebelum, 133,3 kB sesudah. Total ini naik 3,1 kB karena pemecahan chunk menambah sedikit kode penghubung antar-chunk. Yang dimuat di awal tetap turun 16,6 kB.

### Lima modul terbesar (ukuran sebelum minify)

| No. | Sebelum | Sesudah |
| --- | --- | --- |
| 1 | react-dom 536,8 kB (`index`) | react-dom 536,8 kB (`index`) |
| 2 | motion-dom 137,6 kB (`index` dan `visual-element`) | motion-dom 137,6 kB (`index`, `visual-element`, chunk Motion bersama) |
| 3 | framer-motion 43,8 kB | framer-motion 44,0 kB |
| 4 | `AnimeCharacter.jsx` 23,8 kB (`AnimeCharacter`) | `AnimeCharacter.jsx` 23,8 kB (`AnimeCharacter`) |
| 5 | `characterParts.jsx` 22,6 kB (`AnimeCharacter`) | `characterParts.jsx` 22,6 kB (`AnimeCharacter`) |

Berkas sumber berikutnya: `PlayScreen.jsx` 16,5 kB (sebelumnya di `index`, sekarang di `PlayScreen`), `ScenePiece.jsx` 14,4 kB (`WarungScene`), dan `CharacterAvatar.jsx` 13,6 kB (`ResultScreen`).

## Daftar periksa

### Performa

| Butir | Temuan | Tindakan |
| --- | --- | --- |
| Pemisahan kode layar permainan | Masih di bundel awal | Dimuat terpisah dengan `React.lazy`. Beranda memuatnya lebih awal saat senggang. Pindah ke layar permainan memakai `startTransition`, jadi beranda tetap tampil sampai layar siap dan render-nya dicicil (INP 326 → 98 ms). |
| Pemisahan kode layar hasil dan karakter | Sudah terpisah | Tidak diubah |
| Motion lewat LazyMotion | Sudah: `LazyMotion` + `domAnimation` dimuat terpisah, komponen `m`, mode `strict` | Tidak diubah |
| Font hanya subset dan bobot yang dipakai | Bobot sudah tepat (Lilita One 400, Atkinson 400 dan 700). Subset latin-ext ikut di-build, padahal semua teks memakai huruf latin dasar. | Hanya subset latin yang diimpor. Berkas font 10 → 6, CSS 11,88 → 7,96 kB gzip. |
| SVG latar dan karakter tidak dobel | Latar satu komponen dengan data per level. Karakter satu rangka dengan tampak depan dan samping. Tidak ada modul yang masuk dua chunk. `CharacterAvatar` (potret di layar hasil dan gambar pratinjau) adalah gambar lain, bukan salinan rangka karakter. | Tidak diubah |
| Header cache `/assets` di `vercel.json` | Sudah: `public, max-age=31536000, immutable` | Tidak diubah |

### Aksesibilitas

Dicek dengan axe-core 4.13 dan skrip Playwright di semua layar (beranda, lima langkah layar main, layar hasil), pada 360×640 dan 1280×800.

| Butir | Hasil |
| --- | --- |
| Kontras AA | axe: tidak ada pelanggaran. Teks di atas latar punya alas `kapur/90`. |
| Urutan fokus | Sesuai urutan baca. Contoh di beranda: Suara, lalu tiga kartu level. Di layar main: Beranda, Suara, isi meja, lalu tombol aksi. Semua elemen punya indikator fokus. |
| Label tombol | Tidak ada tombol tanpa nama. Semua SVG punya label atau `aria-hidden`. |
| Area meja yang bisa digeser | Sebelumnya bisa difokus tanpa nama, sehingga pembaca layar membacakan seluruh isinya. Sekarang diberi `role="region"` dan nama "Meja kasir (bisa digeser)". |
| `aria-live` untuk umpan balik | Ada di layar main (`role="status"`, polite) untuk semua langkah |
| Target sentuh 48 px | Tidak ada tombol yang lebih kecil dari 48 px (dicek di 320, 360, 768, dan 1280 px) |
| Reduced motion | `MotionConfig reducedMotion="user"` dan aturan CSS global. Pembeli tidak berjalan atau berputar, hanya muncul dengan fade. |
| Tombol Suara | 48×48 px, `aria-pressed` berganti dengan klik maupun Enter, label "Suara" |

### SEO dan berbagi

| Butir | Hasil |
| --- | --- |
| `lang="id"`, title, description | Ada |
| `og:image` | Ada: 1200×630 PNG, beserta `og:image:alt` dan kartu Twitter |
| `robots.txt` dan `sitemap.xml` | Ada; `robots.txt` menunjuk ke sitemap |
| Favicon | Ada (SVG) |
| Lighthouse SEO | 100 di beranda dan layar permainan |

### Ketahanan

| Butir | Sebelum | Sesudah |
| --- | --- | --- |
| Halaman 404 | Alamat halaman (misalnya `/susun-langkah`) dialihkan ke beranda. Berkas yang tidak ada mendapat teks `NOT_FOUND` bawaan, tanpa tautan. | Alamat halaman tetap ke beranda, sesuai keputusan P16. Berkas yang tidak ada mendapat `404.html` ramah (status 404) dengan tombol "Kembali ke beranda". |
| Error di konsol | Tidak ada, selama satu level dimainkan penuh dengan kesalahan di tiap langkah | Tidak ada |
| localStorage rusak (isi bukan JSON) | Game jalan, level tamat, beranda tetap tampil setelah dimuat ulang | Sama |
| localStorage diblokir (akses melempar error) | Game jalan, level tamat, tombol Suara tetap bekerja | Sama |

### Tata letak

Kantong berisi semua jenis buah di Pasar Besar (32 buah, 6 jenis, sampai 12 per jenis):

| Lebar | Sebelum | Sesudah |
| --- | --- | --- |
| 320×568 | Tidak terpotong. Isi meja perlu digeser 130 px. | Sama |
| 360×640 | Tidak terpotong. Isi meja perlu digeser 58 px. | Sama |
| 768×1024 | 6 nama buah di keranjang meluber dari tombolnya | Keranjang 3 kolom, kantong 2 kolom; tidak ada yang meluber |
| 1280×800 | Tombol "−" di kantong terjepit menjadi pil sempit; 2 nama buah meluber | Tombol "−" memakai lencana pojok seperti di HP, keranjang diberi porsi lebih lebar; tidak ada yang meluber |

Di semua lebar: tidak ada scroll halaman, tidak ada scroll mendatar, dan tombol utama terlihat.

## Angka yang tidak membaik dan alasannya

- **Performance beranda tetap 98.** Skornya sudah tinggi, dan perbedaan antar-run (97 sampai 100) lebih besar daripada efek perubahan. FCP dan LCP turun sekitar 100 ms.
- **CLS beranda tetap 0,020.** Pergeseran terjadi di bagian pilihan warung saat font Lilita One dan Atkinson menggantikan font cadangan (`font-display: swap`). Nilainya jauh di bawah batas "baik" (0,1). Menghilangkannya memerlukan pengaturan metrik font cadangan atau preload font berhash, yang belum dikerjakan.
- **CSS yang memblokir render masih sekitar 450 ms (sebelumnya 750 ms).** Semua gaya ada dalam satu berkas CSS. Menyisipkan CSS penting ke `index.html` memerlukan alat build tambahan (dependency baru), jadi tidak dikerjakan.
- **JavaScript tidak terpakai masih 47 KiB.** Sebagian besar adalah bagian React DOM yang belum dipakai saat beranda dibuka. Ini tidak bisa dipisah lebih jauh tanpa mengganti library.
- **Total transfer beranda naik 0,7 kB, dan total semua chunk JS naik 3,1 kB.** Penyebabnya:
  - Layar permainan kini dimuat lebih awal saat beranda senggang, jadi ikut terhitung selama pengukuran.
  - Pemecahan chunk menambah kode penghubung antar-chunk.

  Sebagai gantinya, JS dan CSS yang dimuat saat halaman dibuka turun 20 kB.
- **Di HP, kantong yang sangat penuh membuat isi meja perlu digeser.** Ini terjadi saat ada 6 jenis buah di kantong, padahal pesanan paling banyak 3 jenis. Tidak ada tombol yang terpotong, dan tanda "Geser ke bawah" muncul.
- **Situs live belum diukur ulang.** Angka di atas berasal dari build lokal yang meniru Vercel. Pengukuran ulang di https://wp.itslim.dev bisa dilakukan setelah PR digabung.
