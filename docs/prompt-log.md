# Log prompt mentah

Log ini mencatat semua prompt dari awal sampai akhir pengerjaan, apa adanya, termasuk salah ketik. Entri yang sudah ditulis tidak diubah isinya.

- Zona waktu: WIB (UTC+7)
- Garis start lomba: 5 Oktober 2026, 09.30 WIB
- AI Agent: (isi nama AI Agent yang dipakai)

## Format entri

```
### P1, tanggal, jam
Tugas: (nomor tugas di AGENTS.md)
Prompt: (salin persis)
Hasil AI: (ringkasan: berkas yang dibuat atau diubah, hasil tes dan build)
Yang saya ubah atau tolak: (kalau ada)
Commit terkait: (hash dan pesan commit)
```

## Entri

### P1, 5 Oktober 2026, 10.53 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: 1
Prompt:

````text
Baca AGENTS.md di root repo ini sampai habis sebelum mengerjakan apa pun.
Dokumen itu acuan untuk semua tugas.

Kerjakan Tugas 1 saja: kerangka proyek.
1. Buat proyek React + Vite (JavaScript) di folder ini, lalu pasang
   Tailwind CSS 4 lewat plugin Vite resminya.
2. Pasang token warna dan font dari bagian "Desain" di AGENTS.md
   ke src/index.css.
3. Buat beranda sementara: judul game dan satu kalimat penjelasan,
   supaya bisa dicek di HP dan desktop.
4. Lengkapi index.html: lang="id", title, dan meta description.
5. Jangan membuat logika game atau layar lain dulu.

Selesai jika: npm run dev jalan tanpa error, npm run build lulus,
dan beranda terbaca di lebar 360 px dan 1280 px.

Setelah selesai, tuliskan daftar berkas yang dibuat, perintah yang
kamu jalankan beserta hasilnya, dan usulan pesan commit. Kalau ada
bagian AGENTS.md yang tidak jelas atau bertentangan, tanyakan dulu,
jangan menebak.
````

Hasil AI:
- Proyek React + Vite (JavaScript) dibuat dengan `npm create vite@latest` (template react), lalu Tailwind CSS 4 dipasang lewat `@tailwindcss/vite`. Font Lilita One dan Atkinson Hyperlegible dimuat lokal lewat Fontsource.
- Berkas: `package.json`, `package-lock.json`, `vite.config.js`, `.gitignore`, `.oxlintrc.json`, `index.html` (`lang="id"`, title, meta description, tag Open Graph dasar), `public/favicon.svg`, `src/main.jsx`, `src/App.jsx`, `src/index.css` (token warna dan font dari AGENTS.md), `src/screens/HomeScreen.jsx` (beranda sementara).
- `npm run build` lulus, `npm run lint` lulus, `npm run dev` jalan. Beranda dicek dengan Playwright di 360 px dan 1280 px. Lingkungan AI saat itu memakai Node 22.22.0.
- AI bertanya tentang versi Node, tag Open Graph, dan README (dijawab di P2).

Yang saya ubah atau tolak:

Commit terkait:
- `d510fe6` feat: scaffold React, Vite, and Tailwind with design tokens
- Masuk ke main lewat PR #1 (digabung 5 Oktober 2026, 10.55 WIB). PR #1 tidak dibuat oleh AI di sesi ini.

### P2, 5 Oktober 2026, 11.01 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: 2
Prompt:

````text
Tugas 1 saya terima. Jawaban untuk tiga pertanyaanmu:
1. Versi Node: kunci ke Node 24. Tambahkan "engines" di package.json
   dan berkas .nvmrc.
2. Tag Open Graph: pertahankan. og:url dan og:image ditambahkan nanti
   setelah ada tautan deploy.
3. README.md: buat sekarang, bersamaan dengan tugas ini.

Kerjakan Tugas 2 dari AGENTS.md: deploy pertama ke Vercel. Baca ulang
bagian 4, 6, dan 8 AGENTS.md sebelum mulai.

Bagian yang kamu kerjakan di repo:
1. Kunci Node 24 seperti di atas.
2. Pastikan proyek siap di-deploy ke Vercel sebagai proyek Vite:
   build command `npm run build`, output folder `dist`. Tambahkan
   vercel.json hanya kalau memang diperlukan, dan jelaskan alasannya.
3. Buat README.md berbahasa Indonesia: nama dan deskripsi singkat game,
   status pengembangan yang jujur (sekarang baru kerangka dan beranda
   sementara, game belum bisa dimainkan), tautan ke AGENTS.md,
   docs/jurnal-prompt.md, dan docs/prompt-log.md, kebutuhan Node 24,
   perintah npm install, npm run dev, dan npm run build, ringkasan
   stack, serta baris "Situs: (isi setelah deploy)". Jangan menulis
   fitur yang belum ada.
4. Jangan mengubah isi docs/.

Bagian yang tidak bisa kamu kerjakan dan dikerjakan pemilik proyek:
import repository ke Vercel dari dashboard. Tuliskan langkahnya dengan
jelas, berurutan, dan sesuai tampilan Vercel saat ini: mengimpor repo,
pengaturan yang perlu dicek (framework preset Vite, versi Node 24,
production branch), dan cara mengecek hasil dari HP. Sebutkan juga apa
yang harus dilakukan karena pekerjaanmu ada di branch
claude/confident-babbage-bpzr6d sedangkan AGENTS.md meminta deploy dari
branch main. Beri tahu pilihan yang paling aman (misalnya membuat PR
lalu menggabungkannya) dan jangan menggabungkan atau mem-push ke main
sendiri tanpa saya minta.

Selesai jika: npm run build lulus di Node 24 (kalau lingkunganmu belum
Node 24, katakan apa adanya), README dan pengaturan Vercel sudah ada di
commit, dan langkah import Vercel sudah kamu tuliskan.

Setelah selesai, tulis seperti sebelumnya: berkas yang dibuat atau
diubah, perintah beserta hasilnya, dependency baru dan alasannya (kalau
ada), usulan pesan commit, dan hal yang perlu saya putuskan. Jangan
lanjut ke Tugas 3.
````

Hasil AI:
- `package.json` diberi `"engines": { "node": "24.x" }` dan dibuat `.nvmrc` berisi `24`.
- `README.md` dibuat: deskripsi game, status pengembangan, tautan dokumen, kebutuhan Node 24, perintah npm, ringkasan stack, dan baris "Situs: (isi setelah deploy)".
- `vercel.json` tidak dibuat karena Vercel mendeteksi Vite otomatis (build `npm run build`, output `dist`).
- `npm ci`, `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0 (binary Node 24 diunduh ke folder sementara di luar repo).
- Langkah import repository ke Vercel ditulis di laporan AI. Import dan deploy dikerjakan pemilik proyek; langkah di dashboard Vercel (tidak dapat diverifikasi).

Yang saya ubah atau tolak:

Commit terkait:
- `750d46f` chore: pin Node.js 24 for local and Vercel builds
- `d3cff6a` docs: add README with setup steps and project status
- Belum ada PR saat prompt ini selesai. Kedua commit masuk ke main lewat PR #2 (lihat P3).

### P3, 5 Oktober 2026, 11.12 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: 2 (lanjutan)
Prompt:

````text
hasil Tugas 2 saya terima. Situs sudah live di
https://wp.itslim.dev dan sudah saya cek dari HP.

Jawaban untuk pertanyaanmu:
1. PR: mulai sekarang dan seterusnya, kamu yang membuat PR ke main
   setiap kali pekerjaan sudah berhasil (build dan tes lulus). Jangan
   menggabungkan PR-nya; saya yang memeriksa dan menggabungkan.
   Deskripsi PR berisi: tugas yang dikerjakan, ringkasan perubahan,
   hasil build dan tes, dan hal yang perlu saya putuskan.
2. docs/jurnal-prompt.md: saya yang membuat dan mengisinya. Biarkan
   tautan di README seperti sekarang, tanpa mengubah isi docs/.
3. Repo public: saya urus sendiri.

Lanjutan Tugas 2, selesaikan dengan satu PR:
1. README.md: ganti "Situs: (isi setelah deploy)" dengan
   https://wp.itslim.dev, dan hapus keterangan "(belum dibuat)" pada
   tautan jurnal prompt karena berkasnya akan saya tambahkan.
2. index.html: tambahkan og:url dengan https://wp.itslim.dev dan
   <link rel="canonical"> yang sama. Jangan menambahkan og:image dulu;
   gambar pratinjau dikerjakan di Tugas 10.
3. Pastikan npm run build dan npm run lint lulus.

Jangan lanjut ke Tugas 3.

Setelah selesai: buat PR ke main dari branch kerja, lalu tulis
laporan seperti biasa (berkas yang diubah, perintah beserta hasilnya,
usulan pesan commit, hal yang perlu saya putuskan) ditambah tautan PR.
````

Hasil AI:
- AI mendapati commit P2 belum ada di main dan ada perubahan AGENTS.md di main (`f774bb6`, aturan PR). Main digabung ke branch kerja dengan merge biasa.
- `README.md`: baris situs menjadi `Situs: https://wp.itslim.dev` dan keterangan "(belum dibuat)" pada tautan jurnal dihapus.
- `index.html`: ditambah `<link rel="canonical" href="https://wp.itslim.dev/" />` dan `og:url` dengan alamat yang sama. `og:image` belum ditambahkan.
- `npm ci`, `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0. PR #2 dibuat AI.

Yang saya ubah atau tolak:

Commit terkait:
- `6ab2568` Merge branch 'main' into claude/confident-babbage-bpzr6d
- `cf53d75` docs: link live site in README
- `a09fa0e` chore: add canonical link and og:url for live site
- PR #2 "Tugas 2: kunci Node 24, README, dan metadata situs live" (dibuat 11.12 WIB, digabung 11.13 WIB).

### P4, 5 Oktober 2026, 11.22 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: 3 dan 4
Prompt:

````text
PR #2 sudah saya gabungkan. Mulai dari main terbaru.

Mulai sekarang kita mengerjakan game-nya. Saya mengizinkan kamu
mengerjakan lebih dari satu tugas dalam satu prompt ini: Tugas 3 dan
Tugas 4 dari AGENTS.md. Baca ulang bagian 3 (alur game, level, buah,
uang, skor, tokoh), bagian 7, dan bagian 8 sebelum mulai.

Tugas 3: data dan logika game
- Pasang Vitest (dependency baru, sebutkan alasannya di PR) dan buat
  script "npm test".
- Buat data di src/data/: tokoh (isi kalimat fun fact PERSIS dari
  docs/sumber-fakta.md, jangan mengarang atau mengubah faktanya),
  buah dan harga, pecahan uang, dan tiga level sesuai tabel di
  AGENTS.md.
- Buat logika murni di src/game/, tanpa React: membuat pesanan,
  menghitung total, memilih uang pembeli (kadang pas), memeriksa isi
  kantong terhadap pesanan (melaporkan buah yang kurang atau lebih),
  membuat tiga pilihan total (satu benar, dua pengecoh yang masuk
  akal), memeriksa kembalian, menghitung skor, dan bintang.
- Angka acak lewat parameter supaya tes bisa deterministik.
- Tes wajib mencakup: aturan tiap level, total benar, kembalian selalu
  bisa disusun dari laci uang level itu, kasus uang pas, kantong
  kurang/lebih, skor dan batas bintang.
- Kalau docs/sumber-fakta.md tidak ada di repo, berhenti dan tanya.

Tugas 4: ilustrasi SVG buatan sendiri
- Komponen untuk 6 buah, uang (semua pecahan di AGENTS.md; desain
  sendiri yang sederhana, jangan meniru uang rupiah asli), dan avatar
  8 tokoh dengan ciri sesuai tabel tokoh. Gaya stiker: garis tepi
  tebal warna "tinta", warna dari token desain.
- Tokoh digambar dengan hormat dan mudah dikenali lewat cirinya, bukan
  karikatur.
- Semua gambar harus rapi pada ukuran 40 px dan 160 px. Beri
  aria-label bila gambar berdiri sendiri, dan aria-hidden bila
  dekoratif.
- Buat halaman sementara untuk melihat semua ilustrasi sekaligus,
  lalu cek visual di 360 px dan 1280 px. Halaman ini boleh dihapus
  atau disembunyikan sebelum PR.

Satu commit untuk tiap tugas. Setelah npm test, npm run build, dan
npm run lint lulus, buat PR ke main (jangan digabung). Lalu tulis
laporan seperti biasa. Jangan lanjut ke Tugas 5.
````

Hasil AI:
- Tugas 3: Vitest 5.0.3 dipasang (devDependency) dan script `npm test` dibuat. Data di `src/data/` (buah, uang, level, tokoh; fun fact dan asal disalin dari `docs/sumber-fakta.md`). Logika murni di `src/game/` (pesanan, total, kantong, pilihan total, pembayaran dan kembalian, skor dan bintang, pembeli satu level), dengan angka acak lewat parameter.
- Tes mencakup aturan tiap level, total, kembalian yang selalu bisa disusun dari laci (diuji pada semua kemungkinan pesanan), uang pas, kantong kurang atau lebih, skor dan batas bintang, serta kecocokan fun fact dengan `docs/sumber-fakta.md`. Hasil: 9 berkas tes, 50 tes lulus.
- Tugas 4: komponen `FruitImage`, `MoneyImage`, dan `CharacterAvatar` (SVG buatan sendiri) dan galeri sementara di `/?galeri` yang hanya terbuka saat pengembangan. Cek visual di 360 px dan 1280 px dengan Playwright.
- `npm test`, `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0. PR #3 dibuat AI.

Yang saya ubah atau tolak:

Commit terkait:
- `34a12c1` feat: add game data and pure game logic with tests
- `659b0df` feat: add SVG illustrations for fruits, money, and characters
- PR #3 "Tugas 3 dan 4: data, logika game dengan tes, dan ilustrasi SVG" (dibuat 11.26 WIB, digabung 11.28 WIB).

### P5, 5 Oktober 2026, 11.34 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: 5, 6, 7, dan 8
Prompt:

````text
PR sebelumnya sudah saya gabungkan. Mulai dari main terbaru.

Saya mengizinkan Tugas 5 sampai 8 dalam satu prompt ini. Baca ulang
AGENTS.md bagian 3, 4, 8 (terutama Desain dan Aksesibilitas) sebelum
mulai. Pakai logika dan ilustrasi yang sudah ada; jangan menulis ulang.
Satu commit untuk tiap tugas.

Tugas 5: layar main, langkah 1 dan 2
- Layar warung: terpal bergaris di atas, tokoh pembeli datang dengan
  animasi singkat, balon bicara berisi fun fact, meja kayu di bawah.
- Penanda "urutan langkah" (Sapa, Ambil buah, Hitung, Kembalian) yang
  menunjukkan langkah aktif.
- Pesanan tampil sebagai gambar buah dan angka. Keranjang buah
  tersedia; ketuk buah untuk memasukkan ke kantong belanja, ada cara
  mengeluarkannya lagi. Tombol "Bungkus pesanan"; bila isi kantong
  salah, tampilkan buah mana yang kurang atau lebih, tanpa menyalahkan.
- Semua bisa dipakai dengan mouse, sentuhan, dan keyboard.

Tugas 6: layar main, langkah 3 dan 4, skor
- Langkah Hitung: nota dengan harga tiap buah (bantuan hasil kali
  sesuai level), anak memilih satu dari tiga pilihan total.
- Langkah Kembalian: uang pembeli, laci uang sesuai level, anak
  menyusun kembalian, ada tombol "tidak perlu kembalian" untuk uang
  pas. Tampilkan jumlah yang sudah disusun.
- Umpan balik benar atau salah memakai teks (bukan warna saja) dan
  aria-live. Skor dan kesalahan tercatat sesuai aturan skor.
- Satu level bisa dimainkan sampai habis.

Tugas 7: beranda lengkap dan layar hasil
- Beranda: pilihan tiga level dengan bintang terbaik (localStorage,
  tetap jalan bila localStorage tidak tersedia), cara main singkat,
  dan penjelasan hubungan game dengan konsep coding (tabel di bagian 3
  dalam bahasa anak).
- Layar hasil: skor, bintang, daftar tokoh yang dilayani beserta fun
  fact, tombol main lagi dan kembali ke beranda.

Tugas 8: animasi, hover, responsivitas
- Animasi hanya untuk menjawab aksi anak (pembeli datang, buah masuk
  kantong, jawaban salah). Hover relevan untuk tombol dan buah.
  Hormati prefers-reduced-motion.
- Cek di 360, 768, dan 1280 px dengan Playwright atau cara lain;
  tampilkan hasilnya (screenshot). Target sentuh minimal 48 px.
- Tampilan harus khas warung pasar sesuai bagian Desain, bukan
  tampilan generik.

Setelah npm test, npm run build, dan npm run lint lulus, buat PR ke
main (jangan digabung), dengan tangkapan layar di deskripsi PR. Lalu
tulis laporan seperti biasa: berkas, perintah dan hasil, dependency
baru, usulan pesan commit, dan hal yang perlu saya putuskan. Mainkan
sekali satu level penuh dan laporkan apa adanya kalau ada bagian yang
belum berjalan. Jangan lanjut ke Tugas 9.
````

Hasil AI:
- Tugas 5: layar main langkah Sapa dan Ambil buah (terpal, pembeli datang dengan animasi, balon bicara, penanda urutan langkah, keranjang, kantong, "Bungkus pesanan" dengan pesan buah yang kurang atau lebih), dijalankan oleh reducer murni `src/game/session.js`.
- Tugas 6: langkah Hitung (nota dan tiga pilihan total) dan Kembalian (laci uang, kembalian yang disusun, "Tidak perlu kembalian"), umpan balik teks lewat `aria-live`, skor per pembeli, dan akhir level.
- Tugas 7: beranda lengkap (tiga level dengan bintang terbaik di localStorage, cara main, tabel konsep coding) dan layar hasil (dimuat dengan `React.lazy`).
- Tugas 8: animasi untuk aksi anak, hover, `prefers-reduced-motion`, perbaikan kontras, dan cek di 360, 768, dan 1280 px. Tangkapan layar ditaruh di `.github/pr-assets/tugas-5-8/`.
- Hasil: 12 berkas tes, 78 tes lulus; build dan lint lulus. Uji Playwright di build produksi: level 1 di 360 px selesai dengan skor 40 dari 40; level 3 di 1280 px dengan kesalahan disengaja selesai dengan skor 54 dari 60. PR #4 dibuat AI.

Yang saya ubah atau tolak:

Commit terkait:
- `7e03a06` feat: add play screen for greeting and picking fruit
- `ccc93c1` feat: add counting and change steps with scoring
- `c6e533a` feat: add full home screen and result screen
- `d91ac1d` style: add feedback animations, hover states, and contrast fixes
- `5b0cd96` docs: add screenshots for tasks 5 to 8 pull request
- PR #4 "Tugas 5 sampai 8: layar main, beranda, hasil, animasi, dan responsif" (dibuat 11.44 WIB, digabung 12.29 WIB).

### P6, 5 Oktober 2026, 12.52 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: perbaikan tampilan HP (di luar daftar tugas bagian 4; terkait Tugas 8)
Prompt:

````text
Terima kasih, PR sebelumnya sudah saya gabungkan. Mulai dari main terbaru.

Masalah (saya uji di HP, layar game): halaman terlalu kompleks. Untuk
menyelesaikan satu pesanan, saya harus scroll sampai paling bawah untuk
menemukan tombol aksinya. Anak SD tidak akan sabar mencari tombol itu.

Tujuan: di layar HP, tiap langkah (Sapa, Ambil buah, Hitung, Kembalian)
harus bisa diselesaikan tanpa scroll halaman, atau paling banyak satu
area kecil yang bisa di-scroll di dalam layar yang tetap pas satu layar.

Langkah kerja:
1. Diagnosis dulu, sebelum mengubah kode. Dengan Playwright, ambil
   screenshot tiap langkah di 360x640 dan 360x740. Ukur tinggi total
   halaman dibanding tinggi layar dan sebutkan elemen mana yang paling
   memakan tinggi (terpal, tokoh, balon bicara, pesanan, keranjang,
   kantong, nota, laci uang, penanda langkah). Tulis hasilnya di
   deskripsi PR, lengkap dengan tangkapan layar sebelum perbaikan.
2. Rancang ulang tata letak untuk HP berdasarkan temuan itu, dengan
   prinsip berikut:
   - Layar game memakai tinggi layar penuh (100dvh), bukan halaman
     panjang. Satu langkah, satu fokus.
   - Tombol aksi utama selalu terlihat di bagian bawah layar (bar aksi
     tetap), tidak tergantung panjang konten.
   - Bagian dekoratif dikecilkan di HP: terpal dibuat tipis, tokoh dan
     balon bicara ringkas, penanda langkah dibuat kompak.
   - Fun fact ditampilkan penuh hanya di langkah Sapa. Di langkah lain,
     cukup tokoh kecil dan pesanannya.
   - Hanya hal yang dibutuhkan untuk langkah yang sedang aktif yang
     tampil besar; sisanya diringkas.
   - Desktop dan tablet tidak boleh rusak; kalau perlu, pertahankan
     tata letak yang sekarang untuk layar lebar.
3. Pertahankan semua fitur dan logika. Jangan mengubah src/game dan
   src/data. Target sentuh minimal 48 px, kontras, aria-live, dan
   dukungan keyboard tetap seperti di AGENTS.md.
4. Cek ulang dengan screenshot di 360x640, 360x740, 390x844, 768x1024,
   dan 1280x800. Untuk tiap langkah, laporkan apakah halaman masih bisa
   di-scroll dan apakah tombol aksi utama terlihat tanpa scroll. Kalau
   ada yang masih gagal, katakan apa adanya.
5. Mainkan satu level penuh di 360x640 dan laporkan hasilnya.

Selesai jika di 360x640 tombol aksi utama di keempat langkah terlihat
tanpa scroll, dan di langkah Hitung serta Kembalian semua elemen yang
diperlukan bisa dipakai tanpa menggulir halaman.

Setelah npm test, npm run build, dan npm run lint lulus, buat PR ke
main (jangan digabung), dengan tangkapan layar sebelum dan sesudah di
deskripsi PR. Tulis laporan seperti biasa dan sebutkan hal yang perlu
saya putuskan, termasuk bagian yang kamu kecilkan atau sembunyikan di
HP. Jangan menambah fitur baru.
````

Hasil AI:
- Diagnosis sebelum perbaikan dengan Playwright (360x640, level 3): tinggi halaman 750 px (Sapa), 1369 px (Ambil buah), 1295 px (Hitung), dan 1429 px (Kembalian); tombol aksi utama tidak terlihat tanpa scroll. Terpal, header, penanda langkah, dan kolom tokoh memakan sekitar 420 px sebelum meja dimulai.
- Layar main dirancang ulang: tinggi layar penuh (`100dvh`), terpal tipis di HP, header satu baris, penanda langkah kompak, pembeli ringkas (fun fact penuh hanya di langkah Sapa), satu area kerja yang bisa di-scroll, dan bar aksi tetap di bawah berisi umpan balik dan tombol utama. Komponen baru `ActionBar` dan `CustomerSpot`; `GreetStep` dihapus. `src/game` dan `src/data` tidak diubah.
- Cek ulang di 360x640, 360x740, 390x844, 768x1024, dan 1280x800 untuk 3 level dan 5 langkah (75 kombinasi): halaman tidak bisa di-scroll dan tombol aksi utama terlihat. Sisa geseran area kerja 6 sampai 9 px hanya berupa padding kosong.
- Satu level penuh dimainkan di 360x640 (level 3 dengan kesalahan disengaja, skor 54 dari 60; level 1, skor 40 dari 40) tanpa halaman pernah bisa di-scroll. 78 tes lulus; build dan lint lulus. PR #5 dibuat AI.

Yang saya ubah atau tolak:

Commit terkait:
- `efd33d0` fix: fit each play step on one phone screen
- `5d080b7` docs: add before and after screenshots for phone layout pull request
- PR #5 "Layar main muat satu layar HP dengan bar aksi tetap" (dibuat 12.53 WIB, digabung 14.19 WIB).

### P7, 5 Oktober 2026, 14.25 WIB (dari riwayat commit: waktu commit untuk prompt ini)
Tugas: dokumentasi (AGENTS.md bagian 8, log prompt, jurnal prompt)
Prompt:

````text
Kerjakan pekerjaan dokumentasi ini dulu. Mulai dari main terbaru, dan
pastikan PR perbaikan tampilan HP sudah termasuk. Baca ulang AGENTS.md
bagian 8.

Aturan baru (ubah AGENTS.md bagian 8 "Aturan lomba"; ini pengecualian
dari larangan mengubah docs/):
- Kamu boleh MENAMBAH entri baru di docs/prompt-log.md dan mengisi
  docs/jurnal-prompt.md sesuai aturan di bawah. Entri lama di
  prompt-log.md tidak boleh diubah, dihapus, atau dirapikan. Berkas lain
  di docs/ (termasuk sumber-fakta.md) tetap tidak boleh diubah.
- Di setiap PR, tambahkan entri untuk prompt yang sedang kamu kerjakan
  di bagian paling bawah prompt-log.md, memakai format yang sudah ada
  di berkas itu. Prompt disalin PERSIS apa adanya, termasuk salah
  ketik, tanpa dirapikan atau diringkas. "Hasil AI" ditulis dari
  pekerjaanmu di PR itu. Kalau ada bagian yang tidak bisa kamu
  verifikasi, tulis "(tidak dapat diverifikasi)" dan jangan menebak.
- Larangan memalsukan dokumentasi prompt berlaku: jangan menulis
  prompt yang tidak pernah saya kirim, jangan mengubah urutan, dan
  jangan menambahkan kalimat ke dalam teks prompt.

Tugas sekarang:
1. Perbarui AGENTS.md bagian 8 sesuai aturan baru di atas. Hanya
   bagian 8.
2. Isi docs/prompt-log.md dengan prompt-prompt yang sudah saya kirim
   ke kamu sampai sekarang, urut. Teks tiap prompt saya tempel di
   bawah, apa adanya. Jangan mengganti isinya dengan ingatanmu.
   Untuk "Hasil AI" dan "Commit terkait" setiap entri, pakai riwayat
   git dan deskripsi PR (git log, gh pr view) sebagai sumber. Untuk
   waktu, pakai waktu commit atau PR dalam WIB dan beri keterangan
   "(dari riwayat commit)" kalau saya tidak menuliskannya.
   Entri untuk prompt ini sendiri juga ditulis, paling akhir.

   --- tempel di sini, satu per satu, ---
   P1 (Tugas 1):
   [tempel prompt persis]
   P2 (Tugas 2):
   [tempel prompt persis]
   P3 (lanjutan Tugas 2):
   [tempel prompt persis]
   P4 (Tugas 3 dan 4):
   [tempel prompt persis]
   P5 (Tugas 5 sampai 8):
   [tempel prompt persis]
   P6 (perbaikan tampilan HP):
   [tempel prompt persis, termasuk bagian yang saya isi sendiri]
   --- selesai ---

3. Isi docs/jurnal-prompt.md secara ringkas, hanya bagian yang
   faktanya ada di repo:
   - No. 1 Ide dan PRD: P1.
   - No. 2 Debugging: P6.
   - No. 5 Bebas: P5 (pembuatan game lengkap).
   - Jenis lain (Audit dan optimasi, Finishing) biarkan kosong dengan
     status "belum"; jangan diisi sebelum pekerjaannya terjadi.
   Untuk tiap bagian yang diisi: "Konteks" (keadaan proyek saat prompt
   dikirim, 1 sampai 3 kalimat), "Prompt" (salinan persis dari
   prompt-log.md), dan "Hasil" yang ringkas dan berbasis hasil
   aplikasi: apa yang jadi dan bisa dicoba (fitur yang berjalan, tautan
   https://wp.itslim.dev, jumlah tes yang lulus, ukuran build).
   Khusus No. 2, ambil dari PR perbaikan: temuan diagnosis (elemen
   mana yang memakan tinggi layar), angka tinggi halaman sebelum dan
   sesudah di 360x640, dan apa yang diubah, tanpa promosi.
   Jangan menulis "Keputusan saya", "Dugaan saya", dan "Yang saya
   pelajari"; biarkan kosong, itu bagian saya.
   Perbarui tabel status di bagian atas jurnal.
4. Jangan mengubah kode.

Selesai jika: prompt-log.md berisi semua prompt di atas, urut, persis
seperti yang saya tempel, dan setiap prompt di log bisa dicocokkan
dengan satu atau lebih commit atau PR. Kalau ada prompt yang tidak bisa
dicocokkan, katakan.

Setelah selesai, buat PR ke main (jangan digabung) dan tulis laporan
seperti biasa, termasuk daftar prompt yang kamu catat dan bagian yang
tidak bisa kamu verifikasi.
````

Hasil AI:
- Sebelum mulai, AI bertanya tiga hal karena: teks P1 sampai P6 tidak ikut tertempel (masih tertulis "[tempel prompt persis]"), PR #5 belum digabung saat itu, dan `docs/jurnal-prompt.md` belum ada. Jawaban pemilik proyek (dipilih lewat pertanyaan AI): "Salin dari sesi ini", "PR5 sudah saya gabung", dan "Buatkan templat".
- Karena itu, teks prompt P1 sampai P7 di log ini disalin kata per kata dari pesan yang diterima AI di sesi ini, bukan dari tempelan. Apakah teks itu sama persis dengan yang diketik pemilik proyek (tidak dapat diverifikasi).
- `AGENTS.md` bagian 8 "Aturan lomba" diperbarui dengan aturan baru tentang `docs/prompt-log.md`, `docs/jurnal-prompt.md`, dan larangan memalsukan dokumentasi prompt.
- `docs/prompt-log.md`: entri P1 sampai P7 ditambahkan di bawah "Entri". Isi berkas yang sudah ada tidak diubah.
- `docs/jurnal-prompt.md` dibuat dengan templat baru: No. 1 (P1), No. 2 (P6), dan No. 5 (P5) diisi; No. 3 dan No. 4 berstatus "belum". Bagian milik pemilik proyek dibiarkan kosong.
- Kode tidak diubah.

Yang saya ubah atau tolak:

Commit terkait:
- Commit dan PR untuk prompt ini; hash ada di riwayat PR (hash commit tidak bisa ditulis di dalam commit itu sendiri).

### P8, 5 Oktober 2026, 16.14 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: perbaikan hasil uji situs live (di luar daftar tugas bagian 4)
Prompt:

````text
PR sebelumnya sudah saya gabungkan. Mulai dari main terbaru. Ikuti
aturan di AGENTS.md bagian 8, termasuk menambah entri prompt ini di
docs/prompt-log.md.

Hasil pengujian situs live https://wp.itslim.dev (browser, 360x640,
320x568, dan 1280x800; ketiga level sudah bisa ditamatkan). Ada empat
masalah:

1. Layar 320x568, level 3, kantong berisi 8 buah (1 rambutan, 4
   semangka, 3 mangga): tile kantong hanya selebar sekitar 83 px,
   sehingga tombol "−" menutupi jumlah buah, dan kantong terpotong di
   bawah bar tombol. Di 360x640 kasus yang sama muat dengan baik.
2. Layar 360x640, level 3, anak mengambil semua 6 jenis buah (11 buah
   di kantong): kantong menjadi dua baris dan baris bawahnya terpotong.
   Area itu bisa digulir di dalam layar (tinggi isi 402 px, tinggi area
   365 px), tapi tidak ada petunjuk bahwa bisa digulir.
3. Di langkah Kembalian masih muncul pesan hijau "Benar! Total
   belanjanya RpX. Sekarang terima uang dari pembeli." dari langkah
   sebelumnya. Seharusnya berupa petunjuk untuk langkah Kembalian.
4. Gambar uang di laci dan di "Uangku" terlalu kecil (sekitar 34 px),
   dan lembar Rp20.000 berwarna cokelat yang nyaris sama dengan warna
   meja kayu, sehingga sulit dibedakan.

Perbaiki keempatnya:
- No. 1: pastikan tiap item kantong tetap menampilkan ikon, jumlah, dan
  tombol keluarkan dengan target sentuh minimal 48 px tanpa saling
  menutupi di lebar 320 px. Boleh mengubah tata letak item (misalnya
  jumlah di atas ikon, atau tombol keluarkan di bawah) asal tetap
  kompak.
- No. 2: beri tanda yang jelas bahwa kantong bisa digulir (misalnya
  bayangan atau gradasi di tepi bawah area, atau potongan baris yang
  sengaja terlihat), dan pastikan area terakhir bisa dicapai. Bar
  tombol utama tetap terlihat tanpa scroll halaman.
- No. 3: ganti dengan petunjuk langkah Kembalian yang berguna, ditulis
  dalam bahasa anak, lalu pastikan umpan balik tiap langkah hanya
  berisi hal untuk langkah itu.
- No. 4: perbesar gambar uang secara wajar, beri tiap pecahan warna
  yang jelas berbeda satu sama lain dan dari warna meja, dan tetap
  tampilkan angka. Desain tetap buatan sendiri dan tidak meniru uang
  rupiah asli.

Jangan mengubah logika di src/game dan src/data, dan jangan menambah
fitur. Pertahankan hasil perbaikan HP sebelumnya: di 360x640 tombol
aksi utama tiap langkah tetap terlihat tanpa scroll halaman.

Cek dengan screenshot sebelum dan sesudah di 320x568, 360x640, 390x844,
dan 1280x800, untuk level 3 dengan kantong 8 buah dan kantong 11 buah
(6 jenis), serta langkah Kembalian di level 2 dan 3. Laporkan apa
adanya kalau ada yang belum beres.

Setelah npm test, npm run build, dan npm run lint lulus, buat PR ke main
(jangan digabung), dengan tangkapan layar sebelum dan sesudah di
deskripsi PR. Tulis laporan seperti biasa dan sebutkan hal yang perlu
saya putuskan. Jangan lanjut ke tugas lain.
````

Hasil AI:
- Keempat masalah direproduksi dulu dengan Playwright di build `main` (sebelum perbaikan): tile kantong 83 px di 320x568 dengan jumlah dan tombol "−" bertumpuk; kantong 11 buah di 360x640 perlu digeser 37 px tanpa tanda; langkah Kembalian menampilkan "Benar! Total belanjanya ..." dari langkah Hitung; gambar uang 32x19 px di laci dan 27x16 px di "Uangku", dan Rp20.000 berwarna kayu.
- No. 1: tiap item kantong menjadi satu tombol keluarkan (minimal 48 px tinggi) berisi ikon dan jumlah, dengan tanda "−" kecil di pojok. Di 320x568 tile 79 px dan tidak ada lagi yang saling menutupi (`ShoppingBag.jsx`).
- No. 2: area kerja menampilkan bayangan di tepi bawah dan label "Geser ke bawah ↓" selama isinya masih bisa digeser; baris yang terpotong tetap terlihat sebagian, dan item terakhir bisa dicapai (`PlayScreen.jsx`).
- No. 3: umpan balik yang terbawa dari langkah sebelumnya disembunyikan; langkah Kembalian dimulai dengan petunjuk "Kembalian = uang pembeli dikurangi total belanja. Uangnya pas? Pilih "Tidak perlu kembalian"." Pesan "selesai dilayani" tetap tampil karena milik langkah itu (`PlayScreen.jsx`, `ChangeTray.jsx`).
- No. 4: gambar uang dibuat lebih besar (laci 56x34 px dan "Uangku" 48x29 px di HP; 80x48 px di desktop) dan tiap pecahan diberi warna dasar dan pita sendiri dari token desain; tidak ada yang berwarna kayu. Angka tetap tampil di gambar. Di HP, label teks di bawah uang laci hanya untuk pembaca layar (`MoneyImage.jsx`, `MoneyDrawer.jsx`).
- Pengecekan: skrip Playwright untuk 4 ukuran (320x568, 360x640, 390x844, 1280x800) dengan kantong 8 dan 11 buah serta langkah Kembalian level 2 dan 3; matriks 3 level x 6 ukuran x 5 langkah; satu level penuh dimainkan di 360x640 dan 320x568 (skor 54 dari 60) tanpa halaman pernah bisa di-scroll. Di 320x568 area kerja masih perlu digeser pada langkah Ambil buah dan Kembalian, dengan tanda geser; di 360x640 langkah Kembalian kadang perlu digeser sampai 53 px pada pembayaran uang pas beberapa lembar.
- `npm test` (78 tes), `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0. `src/game` dan `src/data` tidak diubah.

Yang saya ubah atau tolak:

Commit terkait:
- `e6f254f` fix: keep bag count and remove mark apart on narrow screens
- `f0fcde3` fix: show a scroll hint when the play work area overflows
- `17240bc` fix: show only current-step feedback and a change-step hint
- `6d45586` style: enlarge money images and give each note its own colors
- `c6bac8b` docs: add before and after screenshots for live test fixes
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P9, 5 Oktober 2026, 21.12 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: 9 (fitur tambahan: mode "Susun Langkah")
Prompt:

````text
Kerjakan satu fitur dari Tugas 9: mode "Susun Langkah".

Anak menyusun empat langkah melayani pembeli (Sapa, Ambil buah, Hitung,
Kembalian) dalam urutan yang benar. Kartu langkah tampil teracak. Anak
mengetuk kartu satu per satu untuk menaruhnya di urutan, dan bisa
mengeluarkannya lagi. Kalau benar, tampilkan penjelasan singkat bahwa ini
namanya "urutan" (sequence) di coding. Kalau salah, beri petunjuk kartu
mana yang belum pas, tanpa menyalahkan.

Syarat:
- Dibuka dari beranda lewat satu tombol baru.
- Muat di 360x640 tanpa scroll halaman, tombol aksi utama selalu terlihat.
- Bisa dipakai dengan keyboard, sentuhan, dan mouse.
- Logika pengacakan dan pengecekan urutan berupa fungsi murni di src/game
  dengan tes.
- Jangan mengubah logika game yang sudah ada.
````

Hasil AI:
- Logika murni di `src/game/sequence.js`: `shuffleCards` (mengacak empat kartu dan tidak pernah langsung dalam urutan benar), `checkSequence` (kotak yang belum pas dan kotak kosong), `sequenceReducer` (taruh, keluarkan, cek, main lagi), dan `describeSequenceResult` (kalimat umpan balik). Urutan benar diambil dari `STEPS` di `src/game/session.js` tanpa mengubahnya. Teks kartu dan petunjuk ada di `src/data/sequence.js`.
- Tes baru `src/game/sequence.test.js` (17 tes). Seluruhnya 13 berkas tes, 95 tes lulus.
- Layar `src/screens/SequenceScreen.jsx` (dimuat dengan `React.lazy`) dan komponen `src/components/StepCard.jsx`: kotak urutan bernomor 1 sampai 4, tumpukan kartu teracak, ketuk kartu untuk menaruh, ketuk kartu di urutan untuk mengeluarkan, tombol "Cek urutan" di bar aksi bawah. Kalau benar: penjelasan "urutan (sequence)" dan tombol "Main lagi" serta "Kembali ke beranda". Kalau salah: kartu yang belum pas ditandai teks "belum pas" dan diberi petunjuk. Umpan balik lewat `aria-live`.
- Beranda: satu tombol baru "Main Susun Langkah" di kartu "Latihan: Susun Langkah" (`HomeScreen.jsx`, `App.jsx`).
- Uji Playwright di build produksi: 320x568, 360x640, 390x844 (sentuhan), 768x1024, dan 1280x800 (mouse), untuk keadaan awal, salah, dan benar; serta keyboard saja di 360x640. Di semua ukuran halaman tidak bisa di-scroll dan tombol aksi utama terlihat. Di 360x640 semua kotak dan kartu terlihat tanpa geser; satu kasus (1 kartu ditaruh lalu langsung dicek) menyisakan geser 9 px berupa padding. Di 320x568 area kartu masih perlu digeser 13 sampai 73 px.
- Logika game lama (`src/game` dan `src/data` yang sudah ada) tidak diubah. `npm test`, `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0. Satu level penuh tetap bisa dimainkan dari beranda (level 1 di 360x640, skor 40 dari 40).

Yang saya ubah atau tolak:

Commit terkait:
- `ce305ab` feat: add pure logic for the step-ordering practice
- `97749a5` feat: add Susun Langkah practice screen with a home entry
- `f7f044a` docs: add screenshots for Susun Langkah pull request
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P10, 5 Oktober 2026, 21.26 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: 11 (finishing)
Prompt:

````text
Kerjakan Tugas 11: finishing. Jangan menambah fitur.

1. Perbarui README.md: deskripsi, fitur yang benar-benar ada, cara
   menjalankan, tautan situs, dan tautan ke AGENTS.md serta docs/.
2. Perbarui bagian "Sudah ada" dan "Rencana" di AGENTS.md sesuai kondisi
   proyek sekarang.
3. Periksa gerbang kelayakan di bagian 9 satu per satu dan laporkan
   statusnya. Untuk butir yang tidak bisa kamu cek (repo public, isi
   jurnal), katakan.
4. Mainkan tiga level di https://wp.itslim.dev pada 360x640 dan 1280x800,
   lalu laporkan semua masalah. Perbaiki hanya yang kecil dan aman, dan
   daftarkan sisanya di PR.
````

Hasil AI:
- AGENTS.md tidak punya bagian bernama "Sudah ada" dan "Rencana", jadi AI bertanya dulu. Jawaban pemilik proyek (dipilih lewat pertanyaan AI): "Kolom status di bagian 4-5 (Recommended)". Tabel bagian 4 diberi kolom Status dan daftar bagian 5 dijadikan tabel dengan status.
- `README.md` ditulis ulang: deskripsi, fitur yang ada (tiga level, empat langkah, delapan tokoh, skor dan bintang, layar hasil, Susun Langkah, aksesibilitas), cara menjalankan, stack, status, keterbatasan yang diketahui, dan tautan ke AGENTS.md serta docs/.
- Uji situs live https://wp.itslim.dev: bundle yang live sama dengan build `main`. Chromium di lingkungan AI tidak bisa memverifikasi sertifikat lewat proxy, jadi halaman dibuka di alamat asli dengan permintaan jaringan diambil oleh sisi Node Playwright (TLS tetap diverifikasi dengan CA bundle proxy). Ketiga level ditamatkan di 360x640 (skor 36/40, 44/50, 56/60) dan 1280x800 (38/40, 46/50, 54/60) dengan kesalahan disengaja; Susun Langkah diuji di kedua ukuran dan dengan keyboard. Tidak ada error di console dan halaman tidak pernah bisa di-scroll.
- Masalah yang ditemukan dan diperbaiki: tombol kembali browser atau HP di tengah permainan keluar dari situs (sekarang kembali ke beranda; `App.jsx`), dan tombol di layar hasil tidak sama lebar di HP (`ResultScreen.jsx`). Masalah lain didaftarkan di PR tanpa diperbaiki.
- Gerbang kelayakan bagian 9: butir 1, 2 (API GitHub tanpa token menyatakan repo public), 4, dan 6 terpenuhi; butir 5 dinilai sesuai berdasarkan isi game; butir 3 belum terpenuhi (jurnal baru 3 dari 5 prompt dan bagian pemilik masih kosong). Apakah juri bisa membuka situs dari perangkat mereka (tidak dapat diverifikasi).
- `npm test` (95 tes), `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0. `src/game` dan `src/data` tidak diubah.

Yang saya ubah atau tolak:

Commit terkait:
- `2bea129` fix: return to home on browser back instead of leaving the site
- `09d03c6` style: stack result buttons at full width on phones
- `c2c83de` docs: rewrite README for the playable game
- `c440ad8` docs: add task status to AGENTS.md sections 4 and 5
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P11, 5 Oktober 2026, 21.36 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: 10 (audit aksesibilitas, performa, SEO)
Prompt:

````text
Kerjakan Tugas 10: audit aksesibilitas, performa, dan SEO.

1. Ukur dulu sebelum mengubah apa pun. Jalankan Lighthouse (mobile) pada
   https://wp.itslim.dev dan catat skor Performance, Accessibility, Best
   Practices, SEO, serta ukuran bundel. Kalau Lighthouse tidak bisa jalan
   di lingkunganmu, pakai alat setara dan katakan.
2. Periksa aksesibilitas: urutan fokus keyboard, indikator fokus, kontras
   teks (WCAG AA), label tombol dan gambar, aria-live di semua langkah.
3. Perbaiki temuan yang sudah saya ketahui:
   - robots.txt dan sitemap.xml belum ada (404).
   - og:image belum ada. Buat gambar 1200x630 dari ilustrasi buatan sendiri,
     PNG atau WebP di bawah 150 kB, plus og:image:alt dan twitter:card.
     Ini satu-satunya gambar raster yang diizinkan.
   - Halaman yang tidak ada menampilkan teks polos "NOT_FOUND" dari
     Vercel. Arahkan ke game lewat rewrite di vercel.json.
   - Berkas /assets/* tidak punya cache panjang. Atur lewat vercel.json:
     public, max-age=31536000, immutable. index.html tidak berubah.
   - Bundel JS utama sekitar 272 kB. Coba pisahkan layar non-inti dengan
     React.lazy, ukur hasilnya, dan batalkan kalau untungnya kecil.
4. Ukur ulang dengan alat yang sama dan tulis tabel sebelum dan sesudah di
   deskripsi PR. Kalau ada skor yang tidak naik, katakan sebabnya.

Jangan mengubah logika game dan jangan menambah fitur.
````

Hasil AI:
- Sebelum mulai, AI bertanya apakah PR #9 sudah digabung. Jawaban pemilik proyek: "sudah saya gabung".
- Pengukuran sebelum (Lighthouse 13.5.0, mobile, median 3 kali, situs live https://wp.itslim.dev): Performance 93, Accessibility 100, Best Practices 100, SEO 100. Bundel JS utama 275,08 kB (gzip 84,58 kB); total transfer halaman awal 143,9 kB dalam 7 permintaan. Supaya Chromium bisa membuka situs live lewat proxy, CA proxy ditambahkan ke penyimpanan sertifikat NSS; verifikasi TLS tetap aktif.
- Audit aksesibilitas dengan axe-core 4.13.0 dan skrip Playwright di semua layar dan langkah (360x640 dan 1280x800): satu-satunya pelanggaran adalah layar main tanpa judul h1 (`page-has-heading-one`). Nama level di header layar main dijadikan h1. Urutan fokus Tab, indikator fokus, label tombol dan SVG, kontras (aturan axe), dan aria-live di layar main serta Susun Langkah tidak bermasalah.
- Ditambahkan `public/robots.txt`, `public/sitemap.xml`, dan `public/og-image.png` (1200x630, 91 kB) beserta tag og:image, og:image:alt, dan twitter:card di `index.html`. Gambar disusun dari ilustrasi SVG game sendiri lewat layar khusus pengembangan `src/screens/OgImageScreen.jsx` (/?og), yang tidak ikut build produksi.
- Ditambahkan `vercel.json`: rewrite path halaman (tanpa titik) ke `index.html` supaya halaman yang tidak ada membuka game, dan header `Cache-Control: public, max-age=31536000, immutable` untuk `/assets/*`. Rewrite pertama yang menangkap semua path ternyata juga membalas berkas yang tidak ada (misalnya `/llms.txt`) dengan HTML, jadi aturannya dipersempit; berkas yang tidak ada tetap 404.
- Percobaan React.lazy untuk layar main: bundel utama turun dari 84,58 kB menjadi 74,14 kB gzip, tetapi skor dan metrik Lighthouse lokal tidak berubah di luar variasi antar-run, dan anak harus menunggu potongan kode tambahan saat membuka level. Sesuai prompt, percobaan dibatalkan dan tidak di-commit.
- Pengukuran sesudah memakai Lighthouse yang sama pada build lokal (server statis dengan gzip, median 5 kali), karena situs live baru berubah setelah PR digabung dan deployment preview Vercel dilindungi login. Build lokal sebelum: Performance 98, Accessibility 100, Best Practices 100, SEO 100. Sesudah: 99, 100, 100, 100. Skor yang tidak naik sudah 100, atau perubahannya tidak menyentuh kode yang dimuat halaman awal. Header cache, rewrite, dan berkas baru di Vercel belum dicek (tidak dapat diverifikasi sebelum PR digabung).
- `npm test` (95 tes), `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0. `src/game` dan `src/data` tidak diubah.

Yang saya ubah atau tolak:

Commit terkait:
- `5de242a` fix: give the play screen a top-level heading
- `01eec0c` feat: add robots.txt and sitemap.xml
- `a0b6b39` feat: add dev-only composition for the link preview image
- `5617bf3` feat: add og:image and Twitter card meta tags
- `980a91d` fix: serve the game instead of Vercel NOT_FOUND for unknown paths
- `f8d9cda` perf: cache hashed assets for a year
- `ffc24a4` fix: keep 404 for missing files and only rewrite page paths
- `ccb42f6` docs: mark task 10 audit as done
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P12, 5 Oktober 2026, 22.05 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: animasi kartu pembeli (di luar daftar tugas bagian 4; terkait Tugas 8)
Prompt:

````text
Tambahkan animasi pada kartu pembeli saat pembeli datang. Kerjakan di satu PR.

Kapan animasi jalan
- Saat pembeli pertama muncul (anak menekan "Mulai melayani") dan saat pembeli berikutnya muncul (anak menekan "Layani pembeli berikutnya").
- Jangan ada animasi berulang tanpa aksi anak.

Urutan animasi (total sekitar 700 ms)
1. Kartu pembeli meluncur masuk dari kiri dengan sedikit membal di akhir, seperti pembeli yang berjalan ke warung.
2. Setelah kartu berhenti, gelembung bicara muncul dengan efek pop (membesar dari 90% ke 100%).
3. Kalimat sapaan dan fun fact langsung terbaca penuh. Jangan pakai efek mengetik huruf per huruf, karena membuat anak SD menunggu.
4. Pada langkah "Ambil buah", chip pesanan (gambar buah dan angka) muncul satu per satu dengan jeda 80 ms.

Pembeli sebelumnya
- Saat anak menekan "Layani pembeli berikutnya", kartu lama keluar ke kanan sekitar 250 ms, lalu kartu baru masuk.

Aturan
- Pakai CSS saja (transform dan opacity). Jangan tambah library.
- Jangan sampai ada layout shift. Ruang kartu sudah tersedia sebelum animasi mulai.
- Hormati `prefers-reduced-motion`: tanpa gerak, cukup fade 150 ms.
- Di 360x640 tombol aksi di bar bawah harus tetap terlihat tanpa scroll halaman, dan tombol bisa ditekan setelah animasi selesai (jangan terkunci lebih dari 700 ms).
- Teks tetap terbaca pembaca layar. Region aria-live tidak boleh ikut berubah karena animasi.
- Jangan ubah isi `src/game` dan `src/data`.
- Pakai token warna dan nama animasi yang sudah ada di CSS bila cocok.

Cek sebelum PR
- Rekam atau screenshot urutan animasi di 360x640 dan 1280x800.
- Uji dengan reduced motion aktif.
- Pastikan lint, tes, dan build lolos.
````

Hasil AI:
- PR #10 belum digabung saat prompt ini masuk. AI bertanya apakah animasi ditumpuk di PR #10, memakai branch baru, atau menunggu PR #10 digabung. Jawaban pemilik proyek (dipilih lewat pertanyaan AI): "Saya gabung PR #10 dulu (Recommended)". Di tengah pengerjaan pemilik proyek mengirim pesan "info PR terakhir sudah di merge", lalu branch dimulai ulang dari `main` yang sudah berisi PR #10.
- Kartu pembeli meluncur masuk dari kiri dengan sedikit membal (400 ms), lalu balon bicara muncul dengan efek pop dari 90% ke 100% (400-580 ms). Teks sapaan dan fun fact langsung tampil penuh, tanpa efek mengetik. Di langkah Ambil buah, chip pesanan muncul satu per satu dengan jeda 80 ms (mulai 400 ms, chip ketiga selesai di 700 ms).
- Animasi masuk jalan saat kartu pembeli muncul karena aksi anak: kartu besar di langkah Sapa (saat level dibuka dan saat pembeli berikutnya datang) dan kartu ringkas di atas area kerja setelah "Mulai melayani". Kartu tidak beranimasi ulang saat pindah ke langkah Hitung, Kembalian, atau Selesai.
- Saat "Layani pembeli berikutnya" ditekan, kartu lama keluar ke kanan sambil memudar (250 ms), lalu pembeli berikutnya datang. Pindah pembeli menunggu animationend, dengan timer cadangan 400 ms, dan dijaga supaya satu pembeli tidak terlewat dua kali. Tombol "Lihat hasil" untuk pembeli terakhir tetap langsung.
- Hanya CSS (transform dan opacity), tanpa library baru. Keyframes `arrive` yang sudah ada diubah arahnya (dari kiri, dengan membal); keyframes baru: `pop-in`, `leave`, `fade-in`, `fade-out`. Dengan "kurangi gerakan", kartu hanya memudar 150 ms saat datang dan pergi. Area kerja diberi `overflow-x-hidden` supaya kartu yang meluncur tidak memunculkan scroll mendatar.
- Diuji dengan Playwright pada build produksi di 360x640 dan 1280x800, dengan dan tanpa reduced motion: frame tiap 100 ms (animasi dijeda lewat Web Animations API), frame beruntun pada kecepatan normal untuk kartu keluar, dan rekaman video yang diubah menjadi GIF (`.github/pr-assets/animasi-pembeli/`). Halaman tidak bisa di-scroll, tombol aksi di bar bawah tetap terlihat, tombol bisa langsung ditekan saat animasi berjalan, teks aria-live tidak berubah selama kartu keluar, dan tidak ada layout shift tanpa input selain saat beranda dimuat (font). Audit axe-core di semua layar tanpa pelanggaran.
- `npm test` (95 tes), `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0. `src/game` dan `src/data` tidak diubah.

Yang saya ubah atau tolak:

Commit terkait:
- `38894c9` feat: animate the customer card arriving at the stall
- `2225b5a` feat: let the served customer leave before the next one arrives
- `137684b` chore: add customer animation recordings for the PR
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P13, 5 Oktober 2026, 22.45 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: karakter pembeli anime (di luar daftar tugas bagian 4; terkait Tugas 4 dan 8)
Prompt:

````text
Upgrade animasi pembeli jadi karakter 2D bergaya anime yang berjalan masuk. Kerjakan di satu PR.

Pendekatan
- Satu rangka karakter SVG yang dipakai bersama untuk 8 tokoh. Bagiannya terpisah: kepala, rambut (depan dan belakang), badan, lengan kiri dan kanan, kaki kiri dan kanan.
- Tiap tokoh hanya beda data: warna kulit, model rambut, baju, dan satu aksesori khas (misalnya kebaya Kartini, peci Soekarno, blangkon Diponegoro, ikat kepala Pattimura). Simpan datanya di satu berkas, jangan 8 SVG terpisah.
- Gaya anime: kepala besar, mata besar dengan highlight, proporsi chibi, garis tepi tebal warna tinta, sesuai gaya sticker di AGENTS.md.
- Animasikan dengan CSS transform pada tiap bagian (rotate dan translate dengan transform-origin di sendi). Jangan tambah library animasi atau sprite sheet.

Animasi
1. Berjalan masuk: karakter tampak samping, berjalan dari kiri ke posisi di depan warung. Kaki dan lengan berayun bergantian, badan naik turun sedikit tiap langkah, rambut dan baju mengikuti dengan jeda tipis. Sekitar 1,2 detik.
2. Berhenti: langkah melambat, badan menghadap depan, lalu melambai satu kali.
3. Diam (idle): napas pelan (badan naik turun 2 px), kedip mata tiap 3 sampai 5 detik dengan jeda acak, rambut bergoyang halus.
4. Bicara: mulut membuka dan menutup selama gelembung bicara tampil, berhenti setelah selesai.
5. Reaksi terhadap aksi anak: melompat kecil dan senyum saat jawaban benar, menggeleng pelan dan alis turun saat salah. Setelah kembalian benar, karakter melambai lalu berjalan keluar ke kanan.

Aturan
- Animasi idle boleh berulang, tetapi pelan dan kecil, dan berhenti saat tab tidak aktif.
- `prefers-reduced-motion`: tanpa berjalan. Karakter langsung muncul dengan fade 150 ms, tanpa idle bergerak, dan mulut tetap statis.
- Hanya animasikan transform dan opacity. Jaga 60 fps di HP biasa.
- Karakter tidak menutupi gelembung bicara, chip pesanan, atau bar aksi. Di 360x640 tidak boleh ada scroll halaman dan tombol utama tetap terlihat.
- Tombol aksi bisa ditekan maksimal 1,2 detik setelah pembeli muncul. Anak boleh melewati animasi jalan dengan menekan tombol.
- Beri `aria-hidden="true"` pada ilustrasi karakter dan pertahankan teks nama dan fun fact untuk pembaca layar.
- Muat berkas karakter secara lazy bila ukurannya lebih dari 20 kB, supaya bundle awal tidak membesar.
- Jangan ubah isi `src/game` dan `src/data`.

Cek sebelum PR
- Rekam atau screenshot urutan jalan, idle, bicara, dan keluar untuk 2 tokoh yang berbeda jauh (misalnya Kartini dan Pangeran Diponegoro) di 360x640 dan 1280x800.
- Uji dengan reduced motion aktif.
- Laporkan perubahan ukuran bundle.
- Pastikan lint, tes, dan build lolos.
````

Hasil AI:
- Prompt menyebut "blangkon Diponegoro", sedangkan AGENTS.md bagian 3 menulis ciri Pangeran Diponegoro "sorban dan jubah putih" (blangkon untuk Jenderal Sudirman). AI bertanya dulu. Jawaban pemilik proyek (dipilih lewat pertanyaan AI): "Ikuti AGENTS.md (Recommended)". Diponegoro memakai sorban dan jubah putih, Sudirman blangkon dan mantel.
- Satu rangka karakter SVG bergaya anime chibi untuk 8 tokoh (`src/components/character/AnimeCharacter.jsx`): rambut belakang, kaki kiri dan kanan, lengan kiri dan kanan, badan, kain bawah, kepala dengan wajah, rambut depan, dan penutup kepala. Perbedaan tiap tokoh hanya data di satu berkas (`characterLooks.js`): warna kulit, model rambut, baju, dan aksesori. Potongan bentuknya ada di `characterParts.jsx`. Data tokoh tidak ditaruh di `src/data` karena prompt melarang mengubah isi folder itu.
- Gerak hanya lewat CSS transform dan opacity (`animeCharacter.css`), dengan transform-origin di sendi. Berjalan masuk dari kiri sekitar 1,2 detik (kaki dan lengan berayun bergantian, badan naik turun, rambut dan kain mengikuti dengan jeda tipis, langkah melambat), lalu menoleh ke depan dan melambai sekali. Diam: napas 2 px, rambut bergoyang halus, kedip tiap 3 sampai 5 detik dengan jeda acak. Bicara: mulut bergerak selama kalimat baru tampil lalu berhenti. Reaksi: melompat dan senyum saat benar, menggeleng, alis turun, dan cemberut saat salah. Setelah kembalian benar, karakter melambai lalu berjalan keluar ke kanan.
- Tampak samping saat berjalan dibuat dengan menggeser bagian wajah, lengan, dan kaki di rangka yang sama, bukan gambar profil terpisah.
- Animasi berulang berhenti saat tab tidak aktif. Dengan "kurangi gerakan", karakter hanya memudar 150 ms saat datang dan pergi, tanpa gerak diam, kedip, bicara, atau reaksi. Karakter diberi `aria-hidden="true"`; nama tokoh dan fun fact tetap berupa teks.
- Berkas karakter (13,34 kB JS dan 7,28 kB CSS, lebih dari 20 kB) dimuat terpisah dan dimuat lebih awal dari beranda saat browser senggang. Percobaan pertama dengan React.lazy membuat karakter muncul sekitar 400 ms terlambat; diperbaiki dengan merender komponen yang sudah dimuat secara langsung.
- AGENTS.md bagian 8 (Desain) diberi pengecualian untuk gerak diam karakter pembeli, karena prompt mengizinkan animasi idle yang berulang.
- Ukuran bundle awal (build `main` sebelum perubahan, dibanding sesudah): JS 275,75 kB (gzip 84,86 kB) menjadi 261,86 kB ditambah potongan bersama 8,26 kB yang dimuat bersamaan (gzip 81,16 + 3,12 kB). Avatar lama kini hanya dipakai layar hasil sehingga pindah ke potongan layar hasil (2,78 kB menjadi 10,18 kB). CSS awal 39,63 kB menjadi 39,89 kB.
- Diuji dengan Playwright di build produksi pada 360x640 dan 1280x800, dengan dan tanpa reduced motion, memakai urutan pembeli tetap (seed) untuk Kartini dan Pangeran Diponegoro. Tidak ada scroll halaman, tombol utama selalu terlihat dan bisa ditekan saat karakter masih berjalan, dan karakter tidak menutupi balon bicara, chip pesanan, atau bar aksi. Frame rate di Chromium headless 60 fps, juga dengan CPU diperlambat 4x; HP sungguhan (tidak dapat diverifikasi). Audit axe-core di semua layar tanpa pelanggaran.
- `npm test` (95 tes), `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0. `src/game` dan `src/data` tidak diubah.

Yang saya ubah atau tolak:

Commit terkait:
- `cca408e` feat: add a shared anime character rig with looks for the eight heroes
- `c1b2baa` feat: let anime customers walk in, talk, react, and walk out
- `9ff35ee` chore: show anime characters in the dev gallery
- `2b85962` fix: show the preloaded customer right away instead of after a Suspense delay
- `edcc4ea` docs: allow subtle idle motion for customer characters in AGENTS.md
- `9a07041` chore: add anime character recordings for the PR
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P14, 5 Oktober 2026, 23.38 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: perbaikan animasi pembeli dan ukuran karakter (di luar daftar tugas bagian 4; terkait Tugas 8)
Prompt:

````text
Perbaiki animasi yang glitch dan ukuran karakter pembeli yang mengecil saat melayani. Kerjakan di satu PR.

Langkah 1: diagnosis dulu
- Cari penyebab glitch di animasi sekarang (misalnya animasi CSS yang restart karena `key` berubah, transform yang saling menimpa, kartu langsung hilang tanpa animasi keluar, layout shift). Tulis penyebabnya di deskripsi PR.

Langkah 2: pindah ke Motion
- Pasang `motion` (versi terbaru yang stabil) dan impor dari `motion/react`.
- Pakai `LazyMotion` dengan `domAnimation` dan komponen `m`, supaya bundle awal kecil.
- Bungkus aplikasi dengan `MotionConfig reducedMotion="user"`.
- Pakai `AnimatePresence` (mode "wait") untuk pergantian pembeli: kartu lama keluar dulu, baru kartu baru masuk.
- Pindahkan animasi karakter (masuk, idle, bicara, reaksi benar dan salah, keluar) ke Motion. Hanya animasikan transform dan opacity.
- Hapus keyframe CSS lama yang sudah tidak dipakai.

Langkah 3: ukuran karakter
- Sekarang karakter terlalu kecil di langkah Ambil buah, Hitung, dan Kembalian. Anak harus tetap bisa mengenali tokoh.
- Di 360x640, tinggi karakter minimal 120 px di langkah Sapa dan minimal 96 px di langkah lainnya. Jangan menyusut mendadak saat berpindah langkah: transisikan skala dan posisinya dengan halus.
- Boleh ubah tata letak, misalnya karakter di samping gelembung pesanan, asalkan aksi utama setiap langkah tetap terlihat tanpa scroll halaman di 360x640.

Aturan
- Jangan ubah isi `src/game` dan `src/data`.
- Laporkan perubahan ukuran bundle (sebelum dan sesudah).
- Cek dengan screenshot atau rekaman di 360x640 dan 1280x800, termasuk dengan reduced motion aktif.
- Pastikan lint, tes, dan build lolos.
````

Hasil AI:
- Diagnosis dengan skrip Playwright yang mencatat posisi, ukuran, dan opacity karakter serta kartu pembeli di setiap frame (build `main`). Penyebab glitch: langkah Sapa dan langkah lain memakai dua komponen pembeli yang berbeda, sehingga saat "Mulai melayani" kartu besar langsung hilang tanpa animasi keluar, karakter mengecil dari 128 ke 64 px (360x640) atau 176 ke 88 px (1280x800) dalam satu frame, kartu ringkas baru meluncur lagi dari luar layar (di 1280x800 dari -839 px), dan area kerja meloncat 84 px (360x640) atau 120 px (1280x800). Saat pembeli berganti, karakter sudah pergi lebih dulu sehingga yang bergeser keluar hanya kartu kosong, lalu ukuran karakter meloncat lagi.
- Memasang `motion` 14.0.0 (impor dari `motion/react` dan `motion/react-m`). Aplikasi dibungkus `MotionConfig reducedMotion="user"` dan `LazyMotion` dengan `domAnimation` yang dimuat terpisah; komponen memakai `m`.
- Komponen baru `CustomerStage` menggantikan `CustomerSpot`: satu panggung per pembeli untuk keempat langkah, jadi karakter tidak dipasang ulang saat langkah berganti. Ukuran dan posisinya dihaluskan dengan FLIP (transform saja) dari langkah Sapa ke langkah lain. Pergantian pembeli memakai `AnimatePresence` mode "wait": balon memudar, karakter lama berjalan keluar ke kanan, baru pembeli baru berjalan masuk. Area kerja muncul dan memudar dengan animasi, dan bar aksi dijaga tetap di bawah selama pergantian.
- Animasi karakter (masuk, menoleh, melambai, diam, kedip, bicara, reaksi benar dan salah, melambai setelah dilayani, keluar) dipindahkan dari keyframe CSS ke varian Motion, hanya transform dan opacity. `animeCharacter.css` dan keyframe CSS pembeli di `index.css` yang tidak dipakai lagi dihapus. Gerak diam berhenti saat tab tidak aktif.
- Ukuran karakter di 360x640: 144 px di langkah Sapa dan 112 px di langkah lain (sebelumnya 128 dan 64 px). viewBox karakter dipotong sedikit supaya gambar mengisi kotaknya. Di 1280x800: 208 dan 144 px. Di langkah selain Sapa karakter berada di samping balon pesanan, dengan papan nama kecil di bawahnya.
- Ukuran bundle (build `main` dibanding sesudah): JS awal 270,12 kB (gzip 84,28 kB) menjadi 315,50 kB (gzip 99,88 kB). Dimuat terpisah setelah halaman tampil: fitur Motion 15,08 kB dan potongan bersama 22,84 kB; berkas karakter 13,34 kB JS + 7,28 kB CSS menjadi 18,24 kB JS. CSS awal 39,89 kB menjadi 38,80 kB.
- Diuji dengan Playwright pada build produksi di 360x640 dan 1280x800, dengan dan tanpa reduced motion, untuk R.A. Kartini dan Pangeran Diponegoro: tidak ada scroll halaman, tombol utama selalu terlihat, karakter tidak menutupi balon, chip pesanan, atau bar aksi, dan isi area kerja tetap muat seperti sebelumnya. Frame rate di Chromium headless 60 fps, juga dengan CPU diperlambat 4x; HP sungguhan (tidak dapat diverifikasi). Audit axe-core di semua layar tanpa pelanggaran.
- `npm test` (95 tes), `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0. `src/game` dan `src/data` tidak diubah.

Yang saya ubah atau tolak:

Commit terkait:
- `23f7fba` feat: add Motion with lazily loaded features and user reduced motion
- `d04c802` feat: move anime character animations from CSS to Motion
- `18998b6` fix: keep one customer stage per customer and animate customer changes
- `df6d91f` fix: keep the action bar at the bottom while customers change
- `35f78ae` refactor: remove unused customer CSS keyframes
- `0452300` docs: note Motion in the stack sections of AGENTS.md and README
- `d6fb389` chore: add Motion animation recordings for the PR
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P15, 6 Oktober 2026, 07.30 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: Tugas 9, fitur tambahan (suara; bagian 5)
Prompt:

````text
Tambahkan efek suara sederhana. Kerjakan di satu PR.

Teknik
- Pakai Web Audio API (OscillatorNode dan GainNode). Tanpa berkas audio dan tanpa library.
- Buat satu modul kecil `src/lib/sfx.ts` dengan fungsi per bunyi. Buat AudioContext hanya setelah sentuhan pertama anak, lalu `resume()` bila tertunda (aturan autoplay di iOS dan Chrome).

Bunyi (singkat, di bawah 400 ms, volume kecil)
- Pembeli datang: lonceng warung dua nada.
- Ambil buah ke tas: "pop" pendek.
- Tombol ditekan: klik halus.
- Jawaban benar: nada naik ceria.
- Jawaban salah: nada turun yang lembut (bukan bunyi buzzer keras).
- Uang diberikan: dua dentingan koin.
- Hasil akhir: fanfare pendek, lebih meriah untuk 3 bintang.

Aturan
- Tombol Suara di header (ikon speaker, `aria-pressed`, minimal 48 px). Status tersimpan di localStorage dengan key sendiri.
- Bunyi mati bila tab tersembunyi (`visibilitychange`).
- Tampilkan umpan balik visual tiap bunyi; bunyi hanya pelengkap, bukan satu-satunya petunjuk.
- Jangan ubah isi `src/game` dan `src/data`.
- Pastikan lint, tes, dan build lolos. Catat di PR bahwa uji suara perlu dilakukan di HP asli.
````

Hasil AI:
- Sebelum mulai, AI bertanya dua hal. (1) Prompt meminta `src/lib/sfx.ts` (TypeScript), sedangkan AGENTS.md bagian 6 menulis "JavaScript tanpa TypeScript". Jawaban pemilik proyek (dipilih lewat pertanyaan AI): "src/lib/sfx.js (Recommended)". (2) Letak tombol Suara di header. Jawaban: "Beranda dan layar main (Recommended)".
- Modul baru `src/lib/sfx.js` dengan Web Audio API (OscillatorNode dan GainNode), tanpa berkas audio dan tanpa library. AudioContext baru dibuat pada sentuhan, klik, atau tombol keyboard pertama (listener `pointerdown`, `touchstart`, `keydown` dipasang di `main.jsx`), lalu `resume()` kalau masih tertunda. Volume keseluruhan 0,2. Saat tab tersembunyi (`visibilitychange`) AudioContext di-`suspend()` dan tidak ada bunyi baru.
- Tujuh bunyi, semuanya selesai sebelum 400 ms: lonceng dua nada saat pembeli sampai, "pop" saat buah masuk tas, klik halus di setiap `Button`, nada naik (do-mi-sol) untuk jawaban benar, nada turun lembut (gelombang sinus) untuk jawaban salah, dua dentingan koin saat uang ditaruh di nampan kembalian, dan fanfare di layar hasil (3 bintang: lima nada lebih meriah; 2 bintang: tiga nada; 1 bintang: dua nada). Bunyi benar dan salah juga dipakai di mode Susun Langkah.
- Setiap bunyi berpasangan dengan umpan balik yang terlihat: karakter berjalan masuk dan balon muncul (lonceng), angka di tas memantul (pop), tombol turun saat ditekan (klik), teks umpan balik di `aria-live` dan reaksi karakter (benar dan salah), nampan kembalian memantul (koin), bintang dan skor di layar hasil (fanfare).
- Komponen baru `SoundToggle`: tombol Suara dengan ikon speaker SVG (garis gelombang saat menyala, tanda silang saat mati), `aria-pressed`, label "Suara", ukuran 48x48 px di HP dan dengan teks "Suara" di layar lebar. Dipasang di header beranda dan layar main. Pilihan disimpan di localStorage dengan key `warungPahlawanSuara`; game tetap jalan kalau localStorage tidak tersedia.
- Tes baru `src/lib/sfx.test.js` (14 tes) dengan AudioContext palsu: belum ada AudioContext sebelum sentuhan pertama, dibuat dan di-resume saat sentuhan pertama, setiap bunyi di bawah 400 ms, fanfare 3 bintang lebih meriah dari 1 bintang, pilihan suara tersimpan dan dibaca ulang, localStorage yang error tidak membuat game berhenti, tab tersembunyi menghentikan bunyi.
- Diuji dengan Playwright pada build produksi (Chromium headless, Web Audio dicatat lewat instrumen, bukan didengar): bunyi muncul di urutan yang benar dari pembeli datang sampai layar hasil, tombol Suara berganti `aria-pressed` dan pilihannya bertahan setelah halaman dimuat ulang, tidak ada bunyi saat suara mati atau tab tersembunyi. Header di 360x640 dan 1280x800 tanpa scroll mendatar; di 320x568 judul level terpotong ("Pasar Be…"). Audit axe-core di semua layar tanpa pelanggaran. Uji suara di HP asli (iOS dan Android): (tidak dapat diverifikasi).
- Ukuran bundle JS awal: 314,54 kB (gzip 99,33 kB) di `main` menjadi 318,72 kB (gzip 100,64 kB).
- AGENTS.md (bagian 4, 5, dan 7) dan README diperbarui: folder `src/lib/` dan status fitur suara.
- `npm test` (109 tes), `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0. `src/game` dan `src/data` tidak diubah.

Yang saya ubah atau tolak:

Commit terkait:
- `dec167f` feat: add Web Audio sound effects module
- `b15c7ad` feat: play sound effects for game actions and add a sound toggle
- `c92a523` docs: note sound effects in AGENTS.md and README
- `e954dc9` chore: add sound toggle screenshots for the PR
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P16, 6 Oktober 2026, 07.41 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: penghapusan mode Susun Langkah (di luar daftar tugas bagian 4; terkait Tugas 9)
Prompt:

````text
Hapus mode latihan "Susun Langkah" sepenuhnya. Kerjakan di satu PR.

- Hapus komponen, rute, tautan atau tombol menu di beranda, data, gaya, aset, dan tes yang khusus untuk mode ini.
- Hapus key localStorage miliknya bila ada. Key skor terbaik game utama (`warung-pahlawan:best-stars`) tetap.
- Cari sisa referensi ("Susun Langkah", "latihan") di src, README, dan metadata, lalu bersihkan. Jangan sentuh `prompt-log.md` karena log tidak boleh diubah.
- Rapikan beranda supaya tampilannya tetap seimbang tanpa tombol itu.
- Pastikan tidak ada tautan mati dan alamat lama tidak menghasilkan halaman kosong. Alihkan ke beranda.
- Jangan ubah isi `src/game` dan `src/data` selain bagian yang khusus untuk mode ini.
- Laporkan perubahan ukuran bundle.
- Pastikan lint, tes, dan build lolos.
````

Hasil AI:
- Prompt meminta "Jangan sentuh `prompt-log.md`", sedangkan AGENTS.md bagian 8 mewajibkan entri baru untuk setiap PR. AI bertanya dulu. Jawaban pemilik proyek (dipilih lewat pertanyaan AI): "Tambah entri P16 saja (Recommended)". Entri lama, termasuk yang menyebut Susun Langkah, tidak diubah.
- Dihapus: `src/screens/SequenceScreen.jsx`, `src/components/StepCard.jsx`, `src/data/sequence.js`, `src/game/sequence.js`, dan `src/game/sequence.test.js` (17 tes). Hanya berkas khusus mode ini yang dihapus di `src/game` dan `src/data`; berkas lain di kedua folder tidak diubah.
- `src/App.jsx`: layar `sequence` dan impor lazy `SequenceScreen` dihapus. `src/screens/HomeScreen.jsx`: kartu "Latihan: Susun Langkah" dan tombol "Main Susun Langkah" dihapus. Beranda kini berisi judul, pilihan warung, cara main, dan tabel konsep coding, dengan jarak antarbagian tetap 40 px dan tanpa scroll mendatar di 360x640, 768x1024, dan 1280x800.
- Tidak ada gaya CSS, keyframe, atau key localStorage yang khusus untuk mode ini; key `warung-pahlawan:best-stars` dan `warungPahlawanSuara` tetap. Mode ini juga tidak pernah punya alamat sendiri (layar berpindah lewat state React). Alamat lain selain `/` sudah menampilkan beranda lewat rewrite di `vercel.json`; sekarang `src/main.jsx` juga merapikan alamatnya ke `/` dengan `history.replaceState`. Diuji: `/susun-langkah`, `/sequence`, `/?mode=sequence`, dan `/#susun-langkah` menampilkan beranda tanpa error, dan beranda tidak punya tautan.
- Folder `.github/pr-assets/susun-langkah/` (11 tangkapan layar PR #8) dihapus. Deskripsi PR #8 menautkan gambarnya ke commit `f7f044a`, jadi gambarnya tetap tampil di PR itu. Tangkapan layar beranda sebelum dan sesudah ditambahkan di `.github/pr-assets/hapus-susun-langkah/`.
- README (daftar fitur, struktur, status, keterbatasan) dan AGENTS.md (status Tugas 9 di bagian 4 dan baris Susun Langkah di bagian 5) diperbarui. Sisa kata "sequence" di `src/data/guide.js` adalah konsep coding "Urutan (sequence)" di beranda, bukan bagian mode ini. `index.html`, `public/`, dan `docs/` lain tidak memuat referensi ke mode ini.
- Ukuran bundle (build `main` dibanding sesudah): JS awal 319,68 kB (gzip 101,19 kB; `index` 318,72 kB ditambah `jsx-runtime` 0,96 kB yang dimuat di awal) menjadi 318,72 kB (gzip 100,84 kB; `jsx-runtime` kini menyatu di `index`). Chunk lazy `SequenceScreen` 6,96 kB (gzip 2,70 kB) hilang. CSS 38,82 kB menjadi 38,29 kB. Folder `dist` 646.900 menjadi 638.235 byte.
- Audit axe-core di beranda, kelima langkah layar main, dan layar hasil (360x640 dan 1280x800) tanpa pelanggaran; satu level dimainkan sampai layar hasil.
- `npm test` (13 berkas, 92 tes), `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0.

Yang saya ubah atau tolak:

Commit terkait:
- `5690519` feat: remove the Susun Langkah practice mode
- `c7b8446` fix: send unknown paths to the home address
- `3b53836` docs: drop Susun Langkah from README and AGENTS.md
- `b479ed7` chore: remove Susun Langkah PR screenshots
- `b6932ab` chore: add home screen screenshots for the PR
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P17, 6 Oktober 2026, 08.16 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: latar warung dan meja kasir di layar main (di luar daftar tugas bagian 4; terkait Tugas 8)
Prompt:

````text
Latar permainan terasa sepi. Ubah jadi suasana warung dengan meja kasir. Kerjakan di satu PR.

Latar (SVG, gaya sticker sesuai desain di AGENTS.md)
- Tembok belakang dengan papan nama "Warung Pahlawan", rak berisi toples, karung, dan kardus, serta tandan pisang yang menggantung. Lantai kayu atau ubin di bagian bawah.
- Atap terpal bergaris yang sudah ada tetap dipakai.
- Meja kasir di depan, tempat tas belanja dan nampan uang berada. Di atas meja ada mesin kasir kecil, kalkulator, dan timbangan.
- Hiasan yang tidak mengganggu: lampu gantung, kalender dinding, poster kecil. Boleh ada kucing warung yang duduk diam.

Variasi tiap level
- Warung Kecil: warung kayu sederhana, rak sedikit.
- Warung Ramai: rak lebih penuh, lampu menyala hangat, spanduk kecil.
- Pasar Besar: latar los pasar dengan beberapa lapak di belakang dan bendera kecil di atas.
- Ketiganya memakai komponen yang sama dengan data dekorasi yang berbeda, bukan tiga SVG terpisah.

Interaksi (hanya sebagai respons aksi anak)
- Laci mesin kasir terbuka sebentar saat anak menekan "Berikan kembalian" dan menutup lagi.
- Layar mesin kasir menampilkan total belanja pada langkah Hitung.
- Tidak ada animasi latar yang jalan terus. Lampu dan kucing statis.

Aturan
- Karakter pembeli tetap besar dan jelas (minimal 120 px di langkah Sapa, 96 px di langkah lain di 360x640). Latar tidak boleh membuat karakter mengecil atau tertutup.
- Latar harus lebih redup dan lebih sederhana daripada objek yang diklik: buah, uang, tombol, dan teks. Kontras teks dan tombol tetap lolos AA.
- Di 360x640 tidak ada scroll halaman dan tombol utama setiap langkah terlihat. Di layar sempit, kurangi detail latar (sembunyikan hiasan), jangan perkecil area permainan.
- Latar berupa elemen dekoratif: `aria-hidden="true"`, tidak bisa difokus.
- Ukuran SVG latar maksimal 30 kB per level. Muat level lain secara lazy.
- Pakai token warna yang sudah ada: terpal, jingga, pisang, kapur, langit, tinta, daun, kayu.
- Jangan ubah isi `src/game` dan `src/data`.
- Cek dengan screenshot ketiga level di 360x640 dan 1280x800, lalu laporkan ukuran bundle.
- Pastikan lint, tes, dan build lolos.
````

Hasil AI:
- Prompt meminta layar mesin kasir menampilkan total belanja di langkah Hitung, sedangkan di level 2 dan 3 anak justru memilih total dari tiga pilihan (AGENTS.md bagian 3), sehingga total di mesin kasir membocorkan jawaban. AI bertanya dulu. Jawaban pemilik proyek (dipilih lewat pertanyaan AI): "Tampil setelah dijawab (Recommended)". Level 1 menampilkan total di langkah Hitung (sama dengan nota); level 2 dan 3 menampilkan "Rp ?" sampai anak memilih total yang benar, lalu totalnya tampil di langkah Kembalian. Aturan ini ada di fungsi murni `src/lib/registerScreen.js` beserta tesnya.
- Latar baru `src/components/scene/WarungScene.jsx`: dinding, lantai, hiasan, dan meja kasir. Satu komponen untuk ketiga level dengan data dekorasi berbeda di `src/components/scene/decor/level1.js`, `level2.js`, dan `level3.js` (bukan di `src/data`, karena folder itu tidak boleh diubah). Potongan SVG (rak dengan toples, kardus, dan karung, tandan pisang, lampu gantung, kalender, poster, spanduk, papan nama "Warung Pahlawan", lapak pasar, bendera kecil, karung beras, tumpukan kardus) ada di `ScenePiece.jsx`, bergaris tepi tinta tebal seperti stiker, hanya memakai token warna yang ada. Dinding, lantai, dan meja memakai utilitas CSS baru di `src/index.css` (warna token dicampur dengan langit lewat `color-mix` supaya redup).
- Variasi level: Warung Kecil memakai dinding papan kayu, lantai kayu, dan rak sedikit dengan lampu mati; Warung Ramai memakai dinding cat dengan lis, lantai ubin, rak lebih penuh, lampu menyala (cahaya diam), dan spanduk "Buah Segar"; Pasar Besar memakai los pasar dengan tiang kayu, lantai semen, beberapa lapak di belakang, dan bendera kecil di atas. Terpal bergaris yang sudah ada tetap dipakai.
- Meja kasir: area kerja di layar main kini bergaya meja kayu, dan di atasnya ada mesin kasir, kalkulator, timbangan, serta kucing warung yang duduk diam (`src/components/CashCounter.jsx`). Laci mesin kasir terbuka 700 ms saat anak menekan "Berikan kembalian" lalu menutup lagi (tanpa gerak kalau "kurangi gerakan" aktif). Tidak ada animasi latar yang berjalan terus; dicek dengan `document.getAnimations()` (0 animasi di latar dan meja).
- Aturan tata letak: ukuran karakter tidak berubah (360x640: 144 px di Sapa dan 112 px di langkah lain; 1280x800: 208 dan 144 px), dan tinggi area kerja sama dengan build `main` di setiap langkah. Hiasan di area panggung hanya digambar di langkah Sapa; di layar sempit hiasan (lampu, kalender, poster, spanduk, bendera, kucing, kalkulator, timbangan) disembunyikan. Latar dan meja `aria-hidden="true"`, `pointer-events: none`, tanpa elemen yang bisa difokus. Teks yang berada di atas latar (skor, asal tokoh, label "Urutan langkah") diberi alas `kapur/90`.
- Pemuatan: komponen latar dimuat terpisah (dimuat lebih awal saat beranda senggang), dan data dekorasi dimuat per level saat level dibuka; dicek bahwa membuka satu level hanya mengunduh data level itu. Ukuran SVG di halaman per level (latar ditambah meja kasir): 19,4 kB, 23,8 kB, dan 22,2 kB.
- Ukuran bundle (build `main` dibanding sesudah): JS awal 318,72 kB (gzip 100,84 kB) menjadi 323,06 kB (gzip 102,09 kB); CSS 38,29 kB (gzip 10,60 kB) menjadi 44,20 kB (gzip 11,59 kB), sebagian karena fallback `color-mix` yang dibuat otomatis. Chunk baru yang dimuat terpisah: `WarungScene` 8,91 kB (gzip 3,02 kB), data dekorasi level 1, 2, 3: 0,99, 1,32, dan 1,12 kB.
- Diuji dengan Playwright pada build produksi, ketiga level di 360x640 dan 1280x800 (juga 768x1024, 390x844, dan 320x568), setiap langkah: tidak ada scroll halaman, tombol utama terlihat, tidak ada error. Audit axe-core di semua layar tanpa pelanggaran. Keterbatasan: di 320x568 balon bicara yang lebih tinggi menutupi sebagian layar mesin kasir di langkah Hitung dan Kembalian, dan di 360x640 menutupinya 4 px di langkah Ambil buah (saat layar masih "Rp ?"). Uji di HP asli: (tidak dapat diverifikasi).
- AGENTS.md (bagian 7) dan README diperbarui. `npm test` (15 berkas, 109 tes, 17 tes baru), `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0. `src/game` dan `src/data` tidak diubah.

Yang saya ubah atau tolak:

Commit terkait:
- `fa18a50` feat: add warung backdrop scene with per-level decor data
- `ac3b3ff` feat: add cash counter with register, calculator, and scale
- `2415b50` feat: show warung backdrop and cash counter on the play screen
- `74ed1b5` docs: note warung backdrop in AGENTS.md and README
- `a20a61a` chore: add warung backdrop screenshots for the PR
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P18, 6 Oktober 2026, 08.54 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: komposisi layar main dengan kamera dekat (di luar daftar tugas bagian 4; terkait Tugas 8)
Prompt:

````text
Komposisi layar permainan masih salah: meja kasir jauh, banyak ruang kosong, dan karakter pembeli terlalu kecil. Perbaiki komposisinya. Kerjakan di satu PR.

Ukur dulu
- Di 360x640 dan 1280x800, catat untuk tiap langkah: tinggi karakter yang terlihat (px), jarak karakter ke meja, dan area kosong terbesar. Tulis angkanya di deskripsi PR sebagai "sebelum".

Komposisi baru (kamera dekat)
- Pembeli digambar setengah badan, berdiri tepat di belakang meja kasir. Tepi atas meja menutupi badan pembeli di sekitar pinggang. Tidak ada celah antara pembeli dan meja.
- Meja kasir membentang selebar layar dan menjadi tempat kerja: keranjang buah, tas belanja, nampan uang, dan mesin kasir berada di atas meja, bukan di panel terpisah di bawahnya.
- Gelembung bicara menempel di samping atau di atas kepala pembeli dan boleh menimpa latar. Jangan diberi baris kosong sendiri.
- Latar (rak, papan nama) ikut diperbesar dan terpotong di tepi layar, seperti difoto dari dekat. Jangan diperkecil supaya muat semuanya.
- Buang margin, padding, dan jarak antarbagian yang hanya membuat ruang kosong.

Target ukuran
- 360x640: tinggi karakter yang terlihat minimal 200 px di langkah Sapa dan minimal 150 px di langkah Ambil buah, Hitung, dan Kembalian. Lebar karakter sekitar setengah lebar layar.
- 1280x800: tinggi karakter minimal 320 px. Area permainan boleh dibatasi lebarnya, tetapi isinya diperbesar, bukan dibiarkan kecil di tengah.
- Ukuran karakter berubah halus saat pindah langkah, tidak melompat.

Yang tidak boleh rusak
- Di 360x640 tidak ada scroll halaman dan tombol utama setiap langkah tetap terlihat.
- Target sentuh buah, uang, dan tombol minimal 48 px.
- Teks nama, fun fact, dan pesanan tetap terbaca dan tidak tertutup karakter.
- Jangan ubah isi `src/game` dan `src/data`.

Cek sebelum PR
- Screenshot keempat langkah di 360x640 dan 1280x800, lalu tulis angka "sesudah" di samping angka "sebelum".
- Pastikan lint, tes, dan build lolos.
````

Hasil AI:
- Ukur dulu dengan skrip Playwright pada build `main` (Warung Ramai). Tinggi karakter yang terlihat diukur dari ujung rambut sampai tepi atas meja; area kosong terbesar adalah persegi terbesar tanpa teks, gambar, tombol, atau balon (dinding, hiasan latar, dan permukaan meja dihitung kosong). Sebelum, 360x640: Sapa 128 px, jarak ke meja 237 px, kosong 360x152 (24%); Ambil buah 102 px, jarak 6 px, kosong 11%; Hitung 100 px, jarak 6 px, kosong 27%; Kembalian 101 px, jarak 6 px, kosong 5%. Sebelum, 1280x800: Sapa 185 px, jarak 188 px, kosong 968x484 (46%); Ambil buah 131 px, Hitung 128 px, Kembalian 130 px, jarak 15 px, kosong 11 sampai 16%.
- Kamera dekat: pembeli setengah badan berdiri tepat di belakang meja kasir; pinggang gambar (73,5% tinggi) ada di tepi atas meja dan meja menutupi badan bagian bawah (`src/components/CustomerStage.jsx`, `src/screens/PlayScreen.jsx`). Panggung pembeli dan meja kasir ada dalam satu kolom: di HP panggung tinggi di langkah Sapa lalu memendek halus di langkah lain, dan ukuran karakter berubah lewat transisi CSS (scale dengan titik putar di pinggang, 500 ms; diukur 55 frame, perubahan terbesar 13 px per frame). Balon bicara menempel di atas kepala (HP, langkah Sapa) atau di samping kepala, tanpa baris sendiri. Papan nama pindah ke depan meja (Sapa) atau ke tepi bawah panggung (langkah lain). Label "Urutan langkah" di layar lebar kini hanya untuk pembaca layar.
- Meja kasir selebar layar menjadi tempat kerja: panel putih dihapus, keranjang buah, kantong belanja, nota, laci uang, dan nampan kembalian tampil sebagai barang di atas meja, dan mesin kasir berdiri di tepi meja. Di layar lebar keranjang dan laci uang menjadi satu baris. Tombol "Kosongkan" tetap di baris judul nampan (area sentuh 48 px tanpa menambah tinggi baris), nama buah di tombol kantong hanya dibacakan lewat `aria-label`, dan nota dibuat lebih rapat di layar lebar.
- Latar (`src/components/scene/`) kini hanya dinding dengan hiasan yang diperbesar dan terpotong di tepi layar; lantai dan meja latar dihapus karena tertutup meja kasir. Papan nama dan hiasan punya posisi sendiri untuk HP, tablet (768 sampai 1023 px), dan layar lebar.
- Sesudah, 360x640 (Warung Ramai): Sapa 220 px, Ambil buah 158 px, Hitung 154 px, Kembalian 158 px; jarak ke meja 0 px di semua langkah; kosong terbesar Sapa 8%, Ambil buah 10%, Hitung 20%, Kembalian 3%. Sesudah, 1280x800: Sapa 390 px, Ambil buah 336 px, Hitung 328 px, Kembalian 336 px; jarak 0 px; kosong terbesar Sapa 30%, Ambil buah 13%, Hitung 16%, Kembalian 12% (sebagian besar dinding dengan rak dan spanduk di bawah balon). Level 1 dan 3 memberi angka yang hampir sama (selisih tinggi karakter paling banyak 6 px).
- Dicek di 360x640 dan 1280x800 untuk ketiga level (juga 320x568, 390x844, dan 768x1024 untuk level 3): tidak ada scroll halaman, tombol utama selalu terlihat, tidak ada tombol yang lebih kecil dari 48 px, dan tidak ada teks yang tertutup karakter. Di layar HP yang pendek (tinggi 620 px atau kurang) karakter Sapa diperkecil 0,8 supaya balon tetap muat. Isi meja muat tanpa digeser, kecuali di 360x640 level 2 dan 3 saat nampan berisi tiga jenis uang (lebih 25 px, ada tanda "Geser ke bawah"; di `main` lebih 38 px dengan dua jenis uang). Area kerja bisa difokus dengan keyboard saat isinya bisa digeser (temuan axe `scrollable-region-focusable`). Audit axe-core di semua layar tanpa pelanggaran. Uji di HP asli: (tidak dapat diverifikasi).
- Ukuran bundle (build `main` dibanding sesudah): JS awal 323,06 kB (gzip 102,09 kB) menjadi 323,24 kB (gzip 102,19 kB); CSS 44,20 kB (gzip 11,59 kB) menjadi 44,82 kB (gzip 11,98 kB); `WarungScene` 8,91 kB menjadi 8,30 kB.
- README diperbarui. `npm test` (15 berkas, 109 tes), `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0. `src/game` dan `src/data` tidak diubah.

Yang saya ubah atau tolak:

Commit terkait:
- `332799d` feat: show the customer half-body behind the counter in a close-up stage
- `2de0b3f` feat: place basket, bag, receipt, drawer, and tray on the counter
- `b00c840` refactor: make the warung backdrop wall-only with larger edge-cropped decor
- `5a60ff4` docs: describe the close-up play screen in README
- `b074152` chore: add close-up composition screenshots for the PR
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P19, 6 Oktober 2026, 09.34 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: tampak samping karakter saat berjalan (di luar daftar tugas bagian 4; terkait Tugas 8)
Prompt:

````text
Saat pembeli berjalan masuk dan keluar, badannya masih menghadap depan sehingga terlihat seperti digeser. Buat tampak samping untuk berjalan. Kerjakan di satu PR.

Tampak samping
- Tambahkan tampak samping pada rangka karakter bersama (prop arah: "depan" atau "samping"). Bukan SVG baru per tokoh.
- Tampak samping: kepala profil dengan satu mata, hidung, dan satu telinga, badan lebih ramping, lengan depan dan lengan belakang bertumpuk, rambut dan aksesori khas tokoh digambar dari samping (peci, blangkon, sanggul, ikat kepala).
- Tambahkan data tampak samping untuk kedelapan tokoh di berkas data karakter yang sama.
- Untuk arah sebaliknya, cerminkan dengan scaleX(-1). Jangan menggambar dua kali.

Urutan gerak
1. Masuk: tampak samping menghadap kanan, berjalan dari kiri ke belakang meja kasir. Lengan berayun bergantian dan badan naik turun tiap langkah. Kaki tertutup meja, jadi tidak perlu digambar.
2. Berhenti: berputar ke depan sekitar 200 ms (badan menyempit, ganti tampak, melebar lagi), lalu melambai.
3. Selama melayani: tampak depan seperti sekarang.
4. Keluar: berputar ke samping menghadap kanan, lalu berjalan keluar ke kanan.

Aturan
- Saat pergantian tampak, tidak boleh ada frame kosong atau dua tampak terlihat bersamaan.
- Ukuran dan posisi kepala harus sama di kedua tampak, supaya karakter tidak melompat saat berputar.
- prefers-reduced-motion: tanpa berjalan dan tanpa berputar. Karakter langsung muncul tampak depan dengan fade.
- Ukuran karakter dan komposisi meja kasir yang sekarang jangan diubah.
- Jangan ubah isi src/game dan src/data selain data tampilan karakter.

Cek sebelum PR
- Screenshot frame tengah saat berjalan masuk, saat berputar, dan saat berjalan keluar untuk Kartini dan Pangeran Diponegoro, di 360x640 dan 1280x800.
- Laporkan perubahan ukuran bundle.
- Pastikan lint, tes, dan build lolos.
````

Prompt tambahan (dikirim di tengah pengerjaan prompt ini):

````text
Tambahan:

* Rambut karakter bergoyang tidak natural ketika berjalan
````

Hasil AI:
- Pesan tambahan "Rambut karakter bergoyang tidak natural ketika berjalan" dikirim pemilik proyek di tengah pengerjaan dan dikerjakan di PR yang sama.
- Rangka karakter bersama (`src/components/character/AnimeCharacter.jsx`) kini punya dua tampak: depan dan samping. Prop `facing` (`depan` atau `samping`) dan `mirrored` bisa memaksa satu tampak; arah kiri memakai cermin `scale(-1 1)` tanpa menggambar dua kali. Nama prop memakai bahasa Inggris sesuai AGENTS.md, nilainya tetap "depan" dan "samping".
- Tampak samping (`src/components/character/characterParts.jsx`): kepala profil dengan satu mata, hidung, dan satu telinga, di kotak yang sama dengan kepala tampak depan (x 24 sampai 76, y 21 sampai 70); badan lebih ramping; lengan depan dan belakang bertumpuk di satu bahu; kaki tidak digambar karena tertutup meja kasir. Rambut dan aksesori dari samping: konde Kartini, peci, sorban yang menutup sampai tengkuk, blangkon dengan mondolan, ikat kepala dengan ujung kain, kerudung, kacamata satu lensa, dan kumis. Data tampak samping kedelapan tokoh (`side: { hair, headwear, nose }`) ditambahkan di `src/components/character/characterLooks.js`.
- Urutan gerak: berjalan masuk tampak samping dari kiri (lengan berayun bergantian, badan naik turun tiap langkah), berputar ke depan dalam 200 ms (menyempit sampai 6%, tampak diganti dalam satu commit React lewat `flushSync` saat paling sempit, lalu melebar), melambai, melayani dengan tampak depan, lalu saat pergi berputar ke samping menghadap kanan dan berjalan keluar ke kanan. Dicek per frame dengan jam tiruan Playwright dan dengan waktu asli: tidak ada frame tanpa tampak atau dengan dua tampak sekaligus, dan posisi serta tinggi kepala sama sebelum dan sesudah berputar.
- Rambut: bagian rambut yang menempel di kepala tidak diputar lagi (sebelumnya seluruh rambut diputar sehingga tampak lepas dari kepala). Saat berjalan, hanya bagian yang menjuntai (konde, rambut panjang, ujung ikat kepala, kain kerudung) yang tertinggal sedikit ke belakang dari titik tempelnya dan memantul kecil tiap langkah. Gerak diam rambut tampak depan hanya untuk rambut belakang.
- Perbaikan: saat pembeli berganti, panggung baru membesar setelah pembeli lama selesai berjalan keluar (`onExitComplete`), sehingga pembeli lama berjalan lurus ke kanan dan tidak ikut turun. Ukuran karakter dan komposisi meja kasir tidak berubah (diukur ulang: 360x640 Sapa 220 px, langkah lain 154 sampai 158 px; 1280x800 328 sampai 390 px).
- Kurangi gerakan: tanpa berjalan dan berputar; karakter hanya muncul tampak depan dengan fade (dicek: hanya tampak depan yang pernah tampil).
- Galeri ilustrasi pengembangan (`/?galeri`) menampilkan tampak samping kedelapan tokoh, menghadap kanan dan dicerminkan ke kiri.
- Ukuran bundle (build `main` dibanding sesudah): berkas karakter (dimuat terpisah) 18,21 kB (gzip 5,69 kB) menjadi 25,72 kB (gzip 7,33 kB); JS awal 323,24 kB (gzip 102,19 kB) menjadi 323,34 kB (gzip 102,22 kB); CSS tidak berubah (44,82 kB).
- Screenshot frame tengah berjalan masuk, berputar, dan berjalan keluar untuk Kartini dan Pangeran Diponegoro di 360x640 dan 1280x800 ada di `.github/pr-assets/tampak-samping/`. Audit axe-core di semua layar tanpa pelanggaran. `npm test` (15 berkas, 109 tes), `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0. `src/game` dan `src/data` tidak diubah. Uji di HP asli: (tidak dapat diverifikasi).

Yang saya ubah atau tolak:

Commit terkait:
- `3abf66e` feat: add a side view to the shared character rig
- `10cd1b6` feat: walk in and out in side view and turn to face the counter
- `50a495a` fix: grow the stage only after the previous customer has walked out
- `acb6e56` feat: show side views in the illustration gallery
- `97fbe00` docs: mention side-view walking in README
- `d6c223d` chore: add side-view walking screenshots for the PR
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P20, 6 Oktober 2026, 10.11 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: Tugas 10, audit dan optimasi
Prompt:

````text
Kerjakan Tugas 10: audit dan optimasi. Kerjakan di satu PR.

Ukur dulu, sebelum mengubah apa pun
- Lighthouse mode mobile pada build produksi untuk beranda dan layar permainan: Performance, Accessibility, Best Practices, SEO, serta LCP, CLS, dan TBT.
- Ukuran bundle per chunk (gzip) dan 5 modul terbesar.
- Simpan angkanya di `docs/audit.md` sebagai "sebelum".

Periksa dan perbaiki bila masih ada
- Performa: pemisahan kode untuk layar permainan, hasil, dan karakter; Motion lewat LazyMotion; font hanya subset dan bobot yang dipakai; SVG latar dan karakter tidak dobel; header cache jangka panjang untuk `/assets` di `vercel.json`.
- Aksesibilitas: kontras AA, urutan fokus, label tombol, aria-live untuk umpan balik, target sentuh 48 px, reduced motion, tombol Suara.
- SEO dan berbagi: title dan description, `og:image`, `robots.txt`, `sitemap.xml`, favicon, `lang="id"`.
- Ketahanan: halaman 404 yang ramah dengan tombol ke beranda, tidak ada error di konsol, localStorage yang rusak atau diblokir tidak membuat game macet.
- Tata letak: 320, 360, 768, dan 1280 px. Tas berisi banyak buah tidak terpotong.

Ukur lagi
- Jalankan pengukuran yang sama dan tulis "sesudah" di `docs/audit.md` di samping "sebelum". Bila ada angka yang turun atau tidak bisa diperbaiki, tulis alasannya.

Jurnal
- Isi bagian "3. Audit dan optimasi" di `docs/jurnal-prompt.md`: Konteks berisi angka sebelum, Prompt disalin persis dari entri log prompt ini, Hasil berisi angka sesudah. Perbarui tabel status.

Jangan menambah fitur. Jangan ubah isi `src/game` dan `src/data`. Pastikan lint, tes, dan build lolos.
````

Hasil AI:
- Prompt meminta halaman 404 ramah dengan tombol ke beranda, sedangkan di P16 alamat lama dialihkan ke beranda. AI bertanya dulu. Jawaban pemilik proyek (dipilih lewat pertanyaan AI): "Dua-duanya (Recommended)". Alamat halaman tetap membuka beranda, dan berkas yang tidak ada mendapat `public/404.html` yang ramah dengan tombol "Kembali ke beranda".
- Diukur dulu pada `main` commit `8f04e48` sebelum ada perubahan: Lighthouse 13.5.0 mode mobile, median 5 run, pada build produksi di server lokal yang meniru Vercel. Beranda memakai mode navigasi; layar permainan memakai alur pengguna (timespan dari ketukan "Buka warung", lalu snapshot). Ukuran bundle per chunk diukur dengan gzip, dan lima modul terbesar dari daftar modul hasil build. Angka sebelum dan sesudah ditulis di `docs/audit.md` (berkas baru).
- Sebelum dan sesudah, beranda: Performance 98 dan 98, Accessibility, Best Practices, dan SEO 100; LCP 1.954 dan 1.855 ms; CLS 0,020 dan 0,020; TBT 0 dan 0 ms. Layar permainan: Performance 93 dan 100; TBT 219 dan 39 ms; INP 326 dan 98 ms; CLS 0; Accessibility, Best Practices, dan SEO 100. JS awal 101,08 menjadi 84,44 kB gzip (ditambah 0,56 kB `jsx-runtime`), CSS 11,88 menjadi 7,96 kB gzip; total semua chunk JS 130,2 menjadi 133,3 kB gzip karena pemecahan chunk.
- Perbaikan performa: layar permainan dimuat terpisah (`src/screens/loadPlayScreen.js`, `React.lazy`), dimuat lebih awal oleh beranda saat browser senggang, dan dibuka dengan `startTransition`; font hanya subset latin (berkas font 10 menjadi 6). Motion lewat LazyMotion, pemisahan layar hasil dan karakter, dan header cache `/assets` di `vercel.json` sudah ada dan tidak diubah. Tidak ada SVG atau modul yang masuk dua chunk.
- Aksesibilitas: axe-core tanpa pelanggaran di semua layar (360x640 dan 1280x800); urutan fokus, label tombol, `aria-live`, target sentuh 48 px, reduced motion, dan tombol Suara (48x48 px, `aria-pressed`) dicek. Area meja yang bisa digeser kini punya `role="region"` dan nama "Meja kasir (bisa digeser)". SEO dan berbagi (title, description, `og:image`, `robots.txt`, `sitemap.xml`, favicon, `lang="id"`) sudah lengkap.
- Ketahanan: satu level dimainkan penuh dengan localStorage normal, rusak, dan diblokir; level tetap tamat dan konsol bersih. Tata letak: kantong berisi 6 jenis buah dicek di 320, 360, 768, dan 1280 px; di 768 dan 1280 px nama buah di keranjang yang meluber dan tombol "−" yang terjepit diperbaiki (`FruitBasket`, `PickStep`, `ShoppingBag`).
- Yang tidak membaik ditulis beserta alasannya di `docs/audit.md`: CLS beranda 0,020 (pergantian font), CSS yang memblokir render (sekitar 450 ms), JavaScript tidak terpakai 47 KiB, dan total transfer beranda naik 0,7 kB karena layar permainan dimuat lebih awal. Situs live belum diukur ulang: (tidak dapat diverifikasi).
- Jurnal: bagian "3. Audit dan optimasi" di `docs/jurnal-prompt.md` diisi (Konteks dengan angka sebelum, Prompt disalin persis dari entri ini, Hasil dengan angka sesudah) dan tabel status diperbarui; bagian milik pemilik proyek tidak diisi. AGENTS.md diperbarui (status Tugas 10 dan 11, struktur folder).
- `npm test` (15 berkas, 109 tes), `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0. `src/game` dan `src/data` tidak diubah.

Yang saya ubah atau tolak:

Commit terkait:
- `e926ece` perf: load only the latin font subsets that the game uses
- `2089b8e` perf: lazy-load the play screen and preload it from home
- `4a00e9a` fix: keep basket and bag buttons intact on tablet and desktop
- `8af704e` fix: name the scrollable counter region for keyboard users
- `df84c26` fix: add a friendly 404 page for missing files
- `2464c84` docs: note audit file and 404 page in AGENTS.md
- `1e5ac89` docs: record audit numbers before and after in docs/audit.md
- `f0ad2ac` docs: fill journal section 3 (audit and optimization)
- `621cf62` chore: add audit screenshots for the PR
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P21, 6 Oktober 2026, 10.33 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: Tugas 11, finishing
Prompt:

````text
Kerjakan Tugas 11: finishing. Kerjakan di satu PR. Jangan menambah fitur.

- Periksa keenam butir Gerbang kelayakan di AGENTS.md satu per satu. Tulis hasilnya (lolos atau belum, dengan bukti) di deskripsi PR.
- Mainkan ketiga level dari awal sampai hasil di 360x640 dan 1280x800. Catat dan perbaiki bug yang ditemukan.
- Rapikan teks: ejaan, konsistensi istilah, kalimat fun fact sama persis dengan `docs/sumber-fakta.md`.
- Bersihkan kode: console.log, kode mati, komponen dan dependensi yang tidak dipakai, komentar TODO.
- README final: deskripsi singkat, tautan situs, cara menjalankan, stack, daftar fitur yang benar-benar ada, 2 sampai 3 screenshot, dan tautan ke AGENTS.md, jurnal, serta log prompt.
- Pastikan dokumen tidak menyebut fitur yang sudah dihapus.
- Cocokkan `docs/prompt-log.md` dengan riwayat commit. Laporkan entri yang hash commitnya kosong atau tidak cocok, tetapi jangan ubah isi entri lama.
- Isi bagian "4. Finishing" di `docs/jurnal-prompt.md`: Konteks, Prompt disalin persis dari entri log prompt ini, dan Hasil. Perbarui tabel status.
- Pastikan lint, tes, dan build lolos.
````

Hasil AI:
- Gerbang kelayakan diperiksa satu per satu; hasil dan buktinya ditulis di deskripsi PR. Butir 1 (AGENTS.md ada), 2 (repository public menurut API GitHub, `"visibility": "public"`), 4 (stack bebas), 5 (tema dan subtema), dan 6 (https://wp.itslim.dev menjawab 200, memakai berkas `assets/index-BWIC3kQt.js` yang sama dengan build `main` commit `9d84ef2`, dan berkas yang tidak ada mendapat halaman 404) lolos. Butir 3 belum: kelima bagian jurnal sudah berisi Konteks, Prompt, dan Hasil, tetapi bagian "Keputusan saya", "Dugaan saya", dan "Yang saya pelajari" di semua bagian belum diisi pemilik proyek.
- Ketiga level dimainkan dari beranda sampai layar hasil lalu kembali ke beranda, di 360x640 dan 1280x800, dengan skrip Playwright pada build produksi (pembeli pertama: satu kesalahan di tiap langkah). Skor level 1, 2, dan 3: 36 dari 40, 44 dari 50, dan 54 dari 60; konsol bersih; fun fact di balon Sapa dan di layar hasil sama persis dengan `docs/sumber-fakta.md`; kembalian selalu bisa disusun dari laci.
- Bug yang ditemukan: di 1280x800, saat pesan umpan balik muncul, isi meja kasir lebih 16 sampai 61 px sehingga harus digeser, dan tanda "Geser ke bawah" menutupi nama buah di keranjang. Diperbaiki di `src/components/ActionBar.jsx` (di layar lebar pesan ada di samping tombol) dan `src/screens/PlayScreen.jsx` (jarak atas meja sedikit lebih rapat di layar lebar). Sesudahnya kelebihan 0 px di semua langkah dan level di 1280x800 dan 768x1024; tampilan 360x640 tidak berubah. Di layar laptop yang lebih pendek (1366x768, 1280x720) isi meja masih bisa perlu digeser; ditulis di README sebagai keterbatasan.
- Teks: daftar tiga jenis buah di pesan salah kini memakai koma sebelum "dan" ("3 semangka, 3 jeruk, dan 4 pisang"), dan "Kembaliannya kelebihan" menjadi "Kembaliannya terlalu banyak" (`src/game/feedback.js`, tesnya ditambah satu). Istilah "tas" diganti "kantong" di README dan komentar `src/lib/sfx.js`. Fun fact di `src/data/characters.js` sama persis dengan `docs/sumber-fakta.md` (16 kalimat, semuanya "sudah dicek").
- Kode: tidak ada `console.log`, `debugger`, atau komentar TODO; semua komponen dan modul dipakai (galeri dan layar gambar pratinjau hanya untuk pengembangan dan tidak ikut build produksi). Paket `@types/react` dan `@types/react-dom` dihapus dari `package.json` karena proyek tidak memakai TypeScript.
- README final: deskripsi, tautan situs, tiga screenshot di `.github/readme/`, daftar fitur yang ada, cara menjalankan, stack, keterbatasan, dan tautan ke AGENTS.md, jurnal, log prompt, sumber fakta, dan audit. AGENTS.md: status Tugas 9 dan 11 diperbarui, baris mode "Susun Langkah" yang sudah dihapus dibuang dari bagian 5, dan `.github/readme/` ditambahkan ke struktur folder. `docs/audit.md` masih menyebut alamat `/susun-langkah` sebagai contoh alamat lama; tidak diubah karena berkas lain di `docs/` tidak boleh diubah.
- Log prompt dicocokkan dengan riwayat commit: semua hash di P1 sampai P20 ada di `main` dan pesan commitnya cocok, dan untuk entri yang mencantumkan hash, jam di judulnya sama dengan waktu commit pertama yang dicantumkan. P7 tidak mencantumkan hash; commit untuk P7 menurut riwayat adalah `7cdf048`, `3767de3`, dan `e5fdf81` (PR #6). P8 sampai P20 tidak mencantumkan commit "docs: log prompt" miliknya sendiri, sesuai catatan di entri itu. Baris "AI Agent: (isi nama AI Agent yang dipakai)" di bagian atas log belum diisi. Entri lama tidak diubah.
- Jurnal: bagian "4. Finishing" di `docs/jurnal-prompt.md` diisi (Konteks, Prompt disalin persis dari entri ini, Hasil) dan tabel status diperbarui; bagian milik pemilik proyek tidak diisi.
- `npm test` (15 berkas, 110 tes), `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0. axe-core tanpa pelanggaran di semua layar (360x640 dan 1280x800). Uji di HP asli: (tidak dapat diverifikasi).

Yang saya ubah atau tolak:

Commit terkait:
- `d904732` fix: keep the counter free of scrolling on 1280x800 when feedback shows
- `355fe60` fix: use the standard list comma and clearer wording in feedback
- `113b834` chore: remove unused React type packages
- `ad5bb34` style: call the shopping bag kantong in the pop sound comment
- `b1bd1f1` docs: finalize README with features, screenshots, and document links
- `ef5de6c` docs: update task status and drop the removed mode from AGENTS.md
- `69c246e` docs: fill journal section 4 (finishing)
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P22, 6 Oktober 2026, 12.52 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: layar loading "Membuka warung" (di luar daftar tugas bagian 4; terkait Tugas 8 dan 10)
Prompt:

````text
Saat level pertama kali dibuka, latar warung muncul belakangan sehingga terlihat kosong lalu tiba-tiba ada. Tambahkan layar loading dan pastikan adegan tampil utuh. Kerjakan di satu PR.

Layar loading "Membuka warung"
- Tampil segera setelah anak memilih level: rolling door warung tertutup dengan papan nama level dan teks "Membuka warung...".
- Setelah semua siap, rolling door naik sekitar 500 ms dan memperlihatkan warung yang sudah lengkap. Pembeli pertama baru berjalan masuk setelah pintu terbuka.
- Tampil minimal 600 ms supaya tidak berkedip saat koneksi cepat.

Yang harus siap sebelum pintu dibuka
- Latar level, meja kasir, karakter pembeli pertama, fitur Motion, dan font. Tidak boleh ada bagian yang menyusul setelah pintu terbuka.
- Tidak ada pergeseran tata letak setelah adegan tampil.

Supaya loading singkat
- Di beranda, muat lebih dulu aset level saat browser sedang menganggur (requestIdleCallback) dan saat tombol level disentuh atau difokus.
- Muat karakter pembeli berikutnya di latar belakang selama anak melayani pembeli sekarang, supaya pergantian pembeli tidak menunggu.

Keadaan lain
- Gagal memuat atau lebih dari 8 detik: tampilkan pesan ramah ("Warung belum bisa dibuka. Coba lagi ya.") dengan tombol "Coba lagi" dan "Kembali".
- Pakai komponen loading yang sama untuk layar hasil, menggantikan teks "Menyiapkan hasil...".
- `prefers-reduced-motion`: tanpa gerak pintu, cukup fade 150 ms.
- Teks loading memakai `role="status"` supaya terbaca pembaca layar. Fokus pindah ke judul layar permainan setelah pintu terbuka.
- Layar loading tidak boleh memunculkan scroll di 360x640.
- Jangan ubah isi `src/game` dan `src/data`.

Cek sebelum PR
- Uji dengan throttling "Slow 4G" dan cache kosong: rekam urutan dari ketuk level sampai pembeli pertama masuk. Tidak boleh ada frame dengan latar kosong.
- Uji kunjungan kedua (aset sudah di cache): loading tetap mulus, tidak berkedip.
- Pastikan lint, tes, dan build lolos.
````

Hasil AI:
- Diukur dulu pada build `main` (commit `fd5c9a3`) dengan Playwright, throttling "Slow 4G" (latensi 562,5 ms, unduh 1,44 Mbps), cache kosong, di 360x640, dengan mencatat setiap frame. Kunjungan pertama: teks "Menyiapkan warung..." di layar polos dari 106 sampai 1.287 ms setelah ketuk level, lalu layar main tampil tanpa latar sampai 1.923 ms, dan pembeli sudah mulai berjalan di latar kosong sejak 1.587 ms. Ada 109 frame kosong. Kunjungan kedua (cache terisi): 18 frame kosong.
- Layar loading baru (`src/components/LoadingScreen.jsx`, `src/components/OpeningGate.jsx`): pintu gulung warung tertutup dengan papan nama level dan teks "Membuka warung..." (`role="status"`) tampil langsung setelah level dipilih. Setelah semua siap, layar main dirender di belakang pintu, lalu pintu naik 500 ms; pembeli pertama baru berjalan masuk setelah pintu terbuka, dan fokus pindah ke judul layar permainan. Layar loading tampil minimal 600 ms (`src/lib/loadingGate.js`, dengan tes).
- Yang ditunggu sebelum pintu dibuka (`preparePlayScreen` di `src/screens/loadPlayScreen.js`): layar main (latar warung kini ikut di berkas yang sama), data dekorasi level, berkas karakter pembeli, fitur Motion (`src/lib/loadMotionFeatures.js`), dan font (`src/lib/fonts.js`). Data dekorasi ditandai selesai supaya `use()` tidak menunda satu frame pun (`loadDecor.js`).
- Gagal memuat atau lebih dari 8 detik: pesan "Warung belum bisa dibuka. Coba lagi ya." dengan tombol "Coba lagi" dan "Kembali". Ditemukan saat uji: Chromium mengingat `import()` yang gagal dan tidak mengunduh ulang, jadi "Coba lagi" selalu gagal walaupun jaringan sudah pulih. Diperbaiki dengan `src/lib/importWithRetry.js` (dengan tes): kalau import gagal dan pesan errornya menyebut alamat berkas, berkas itu diminta lagi dengan alamat yang sedikit berbeda. Safari tidak menyebut alamat di pesan errornya; perilaku di Safari (tidak dapat diverifikasi).
- Layar hasil memakai komponen loading yang sama ("Menyiapkan hasil...") menggantikan teks lama. `prefers-reduced-motion`: pintu tidak bergerak, hanya memudar 150 ms. Di beranda, berkas ketiga level dimuat lebih dulu saat browser senggang (`requestIdleCallback`) dan saat kartu level disentuh, ditunjuk, atau difokus. Selama anak melayani, berkas karakter dimuat untuk pembeli berikutnya (satu berkas berisi kedelapan tokoh, jadi biasanya sudah ada), dan layar hasil dimuat saat pembeli terakhir.
- Sesudah, Slow 4G dan cache kosong di 360x640 (level 1, diketuk langsung setelah halaman dimuat): pintu tampil 126 ms setelah ketuk, latar siap 1.438 ms, pintu mulai naik 1.501 ms dan hilang 2.005 ms, pembeli mulai berjalan 2.017 ms; 0 frame kosong, 0 frame pembeli berjalan sebelum pintu terbuka, dan CLS 0 setelah adegan tampil. Hasil yang sama (0 frame kosong, CLS 0) untuk level 2 di 360x640 dan level 3 di 1280x800 (diketuk langsung dan 200 ms setelah dimuat). Kunjungan kedua (aset di cache): pintu tampil 58 sampai 65 ms setelah ketuk dan mulai naik 732 sampai 745 ms (batas minimal 600 ms), tanpa frame kosong. Selama satu level penuh tidak ada unduhan saat pembeli berganti; satu-satunya unduhan adalah layar hasil saat pembeli terakhir.
- Dicek juga: layar loading tanpa scroll di 320x568, 360x640, dan 1280x800; target tombol 48 px; fokus ke "Coba lagi" saat gagal; "Kembali" membuka beranda; pesan muncul sekitar 8,5 detik setelah ketuk kalau berkas tidak pernah selesai; axe-core tanpa pelanggaran di layar loading, layar gagal, dan semua layar permainan (360x640 dan 1280x800); ketiga level dimainkan sampai hasil di 360x640 dan 1280x800; konsol bersih.
- Ukuran bundle gzip (sebelum dan sesudah): JS awal 84,35 menjadi 85,57 kB; CSS 7,96 menjadi 8,15 kB; `PlayScreen` 13,39 menjadi 15,66 kB karena `WarungScene` (2,82 kB) kini ikut di dalamnya; total semua chunk 141,12 menjadi 141,97 kB. README diperbarui. `src/game` dan `src/data` tidak diubah.
- `npm test` (17 berkas, 119 tes), `npm run build`, dan `npm run lint` lulus dengan Node 24.21.0. Uji di HP asli: (tidak dapat diverifikasi).

Yang saya ubah atau tolak:

Commit terkait:
- `db9425a` feat: add loading helpers for fonts, Motion, and wait limits
- `7492b53` fix: add an import helper that re-downloads a file after a failed import
- `ed5c786` feat: prepare everything the play and result screens need before showing them
- `23c20cd` perf: preload level files from home when idle or when a level card is touched
- `21d5298` feat: open the warung with a rolling door loading screen
- `6602b77` docs: describe the warung opening screen in README
- `eaf7af3` chore: add loading screen recordings for the PR
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P23, 7 Oktober 2026, 08.05 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: perbaikan hasil uji situs dan lengan karakter (di luar daftar tugas bagian 4; terkait Tugas 5 sampai 8)
Prompt:

````text
Perbaiki tujuh hal berikut dari hasil uji situs. Kerjakan di satu PR.

1. Pergantian pembeli
- Tidak boleh ada frame meja kosong dengan latar terpotong. Tata letak adegan langkah Sapa sudah terpasang sebelum pembeli baru berjalan masuk.
- Tombol "Mulai melayani", gelembung sapaan, dan papan nama baru muncul setelah pembeli berhenti dan menghadap depan.
- Putaran badan jangan menyempit sampai jadi garis. Sempitkan paling jauh sampai 60% sambil crossfade antara tampak samping dan depan, sekitar 180 ms.

2. Kepala terpotong
- Di langkah Ambil buah, Hitung, dan Kembalian, penutup kepala tokoh tidak boleh tertutup bar langkah. Beri jarak minimal 8 px di atas kepala untuk semua tokoh, di 360x640 dan 1280x800.

3. Momen jawaban benar
- Setelah kembalian benar: bungkusan belanja dan uang kembalian berpindah dari meja ke pembeli, lalu angka poin ("+10") muncul sebentar di dekat skor. Meja tidak boleh kosong melompong.

4. Tata letak desktop
- Di lebar 1024 px ke atas, pakai dua kolom: pembeli dan gelembung di kiri, area kerja (keranjang, kantong, nota, laci uang) di kanan. Tombol jawaban dan tombol aksi memenuhi lebar area kerja, tinggi minimal 56 px.

5. Tombol kembali
- Saat permainan sedang berjalan, tombol ← membuka dialog buatan sendiri (bukan window.confirm): "Tutup warung sekarang? Skor level ini belum tersimpan." dengan tombol "Lanjut main" dan "Tutup warung". Fokus terkunci di dialog dan Esc menutupnya. Tombol kembali browser berperilaku sama.

6. Beranda di HP
- Di 360x640, tombol untuk mulai main harus terlihat tanpa scroll. Ringkas bagian judul dan deskripsi, atau tambahkan tombol "Main sekarang" yang membuka level terakhir yang belum tuntas.

7. Layar hasil
- Tambahkan tombol utama "Lanjut ke <nama level berikutnya>" bila ada level berikutnya. "Main lagi" jadi tombol kedua.

Lengan karakter sekarang berupa persegi panjang lurus di samping badan dengan lingkaran di ujungnya, sehingga terlihat seperti benda asing, bukan lengan. Gambar ulang lengan dan tangan di rangka karakter bersama. Kerjakan di satu PR.

Lengan
- Lengan menyambung ke bahu dan menempel pada siluet badan, tidak terpisah seperti batang.
- Bentuknya melengkung dan mengecil ke arah pergelangan, dengan tekukan siku. Garis tepi warna tinta setebal garis badan.
- Warna lengan tetap mengikuti baju atasan tokoh. Beri garis lipatan atau manset kecil supaya terbaca sebagai lengan baju.

Tangan
- Ganti lingkaran polos dengan bentuk sarung tangan sederhana: telapak membulat dan jempol terpisah.
- Warna tangan sama dengan warna wajah tokoh itu.

Pose di belakang meja
- Siku menekuk dan kedua tangan bertumpu di atas tepi meja kasir, di depan meja, bukan terpotong di belakangnya.
- Papan nama tidak boleh menutupi tangan.

Aturan
- Jangan ubah isi `src/game` dan `src/data`.
- Hormati `prefers-reduced-motion` untuk semua gerak baru.
- Cek dengan screenshot tiap butir di 360x640 dan 1280x800. Untuk butir 1, rekam frame demi frame pergantian pembeli.
- Pastikan lint, tes, dan build lolos.
- Lengan dan tangan tetap ikut animasi yang ada: berayun saat berjalan, melambai saat datang, menerima bungkusan saat jawaban benar.
- Terapkan di tampak depan dan tampak samping untuk kedelapan tokoh.
- Jangan ubah ukuran karakter dan komposisi meja kasir.
````

Prompt tambahan (dikirim di tengah pengerjaan prompt ini):

````text
Perbaiki tujuh hal berikut dari hasil uji situs. Kerjakan di satu PR.

1. Pergantian pembeli
- Tidak boleh ada frame meja kosong dengan latar terpotong. Tata letak adegan langkah Sapa sudah terpasang sebelum pembeli baru berjalan masuk.
- Tombol "Mulai melayani", gelembung sapaan, dan papan nama baru muncul setelah pembeli berhenti dan menghadap depan.
- Putaran badan jangan menyempit sampai jadi garis. Sempitkan paling jauh sampai 60% sambil crossfade antara tampak samping dan depan, sekitar 180 ms.

2. Kepala terpotong
- Di langkah Ambil buah, Hitung, dan Kembalian, penutup kepala tokoh tidak boleh tertutup bar langkah. Beri jarak minimal 8 px di atas kepala untuk semua tokoh, di 360x640 dan 1280x800.

3. Momen jawaban benar
- Setelah kembalian benar: bungkusan belanja dan uang kembalian berpindah dari meja ke pembeli, lalu angka poin ("+10") muncul sebentar di dekat skor. Meja tidak boleh kosong melompong.

4. Tata letak desktop
- Di lebar 1024 px ke atas, pakai dua kolom: pembeli dan gelembung di kiri, area kerja (keranjang, kantong, nota, laci uang) di kanan. Tombol jawaban dan tombol aksi memenuhi lebar area kerja, tinggi minimal 56 px.

5. Tombol kembali
- Saat permainan sedang berjalan, tombol ← membuka dialog buatan sendiri (bukan window.confirm): "Tutup warung sekarang? Skor level ini belum tersimpan." dengan tombol "Lanjut main" dan "Tutup warung". Fokus terkunci di dialog dan Esc menutupnya. Tombol kembali browser berperilaku sama.

6. Beranda di HP
- Di 360x640, tombol untuk mulai main harus terlihat tanpa scroll. Ringkas bagian judul dan deskripsi, atau tambahkan tombol "Main sekarang" yang membuka level terakhir yang belum tuntas.

7. Layar hasil
- Tambahkan tombol utama "Lanjut ke <nama level berikutnya>" bila ada level berikutnya. "Main lagi" jadi tombol kedua.

Aturan
- Jangan ubah isi `src/game` dan `src/data`.
- Hormati `prefers-reduced-motion` untuk semua gerak baru.
- Cek dengan screenshot tiap butir di 360x640 dan 1280x800. Untuk butir 1, rekam frame demi frame pergantian pembeli.
- Pastikan lint, tes, dan build lolos.
````

````text
Try again
````

Hasil AI:
- Sebelum menulis kode, AI bertanya dua hal dan pemilik proyek memilih: satu PR untuk seluruh pesan ini (tujuh butir dan lengan), dan untuk butir 6 bagian judul beranda diringkas (bukan tombol "Main sekarang").
- Pada 7 Oktober 2026 sesi sempat terhenti karena batas pemakaian. Pemilik proyek lalu mengirim ulang bagian tujuh butir dari prompt ini dan, setelah menghentikan satu giliran, menulis "Try again". Keduanya dikerjakan sebagai lanjutan prompt yang sama di PR yang sama.
- Lengan dan tangan (`src/components/character/characterParts.jsx`, dengan tes baru `characterParts.test.js`): lengan atas dan lengan bawah kini bentuk melengkung yang mengecil ke pergelangan, menyambung di bahu, dengan siku menekuk, garis lipatan, dan manset. Warnanya mengikuti baju atasan; garis tepi tinta setebal garis badan. Tangan berupa sarung tangan sederhana (telapak bulat dan jempol terpisah) dengan warna kulit tokoh. Berlaku di tampak depan dan tampak samping untuk kedelapan tokoh. Lengan tetap ikut animasi: berayun saat berjalan, melambai saat datang dan pergi, dan menerima bungkusan.
- Pose di belakang meja: garis meja di gambar (`COUNTER_Y` = 94, setinggi perut) tepat di tepi atas meja. Badan di bawah garis itu dipotong, sedangkan lengan digambar di lapisan terpisah di depan meja, jadi kedua tangan bertumpu di tepi meja dan tidak terpotong. Ukuran karakter tidak diubah; karakter kini berdiri sekitar 7 satuan lebih rendah terhadap meja. Papan nama dipindah supaya tidak menutupi tangan (dicek untuk kedelapan tokoh di 360x640 dan 1280x800).
- Butir 1, pergantian pembeli (direkam frame demi frame dengan requestAnimationFrame dan screencast, seed tetap, 360x640 dan 1280x800). Sebelum, di 360x640: 27 frame meja kosong dengan latar terpotong, 27 frame pembeli berjalan saat panggung masih membesar, 89 frame tombol "Mulai melayani" terlihat sebelum pembeli sampai, dan badan menyempit sampai skala 0,06 (216 ms, tanpa crossfade); 1280x800 serupa (26, 26, 89). Sesudah: pembeli lama pergi dulu sementara meja masih menampilkan nota lunas, panggung berubah ke tata letak Sapa, baru pembeli baru masuk. Hasil: 0 frame meja kosong, 0 frame berjalan saat panggung membesar, 0 frame tombol, balon, atau papan nama sebelum pembeli diam menghadap depan; putaran menyempit paling jauh ke skala 0,60 dengan crossfade tampak samping dan depan sekitar 183 ms (19 sampai 20 frame berisi dua tampak). Dengan "kurangi gerakan": tanpa jalan dan putar, hasil yang sama 0 frame.
- Butir 2, ruang kepala di langkah Ambil buah, Hitung, dan Kembalian (jarak puncak penutup kepala ke tepi atas panggung). 360x640 sebelum: -20,5 px (Diponegoro) sampai 3,9 px; sesudah: 8,4 px (Diponegoro, terkecil) sampai 32,6 px. 1280x800 sebelum: -51,2 sampai 0,7 px; sesudah: 191,5 sampai 242,9 px. Untuk itu panggung langkah kerja di HP 17 px lebih tinggi (161 menjadi 178 px) dan di tablet 335 menjadi 372 px.
- Butir 3, momen jawaban benar: nota tetap di meja dengan cap "Lunas", bungkusan belanja dan uang kembalian terbang dari meja ke tangan pembeli (`HandoverFlight.jsx`, sekitar 1,2 detik), lalu "+10" muncul sebentar di dekat skor. Tempat barang lalu berisi "Sudah diterima pembeli.", jadi meja tidak kosong. Pembeli memegang bungkusan, melambai, dan membawanya saat pergi. Dengan "kurangi gerakan" barang tidak terbang dan langsung diterima (sekitar 200 ms).
- Butir 4, layar 1024 px ke atas: dua kolom. Kiri: pembeli, balon, dan sepotong meja kasir; kanan: urutan langkah, area kerja, dan bar aksi. Tombol jawaban dan tombol aksi memenuhi lebar area kerja dengan tinggi 56 px (diukur di 1024x768, 1280x800, dan 1440x900; misalnya "Bungkus pesanan" 570x56 px di 1280x800). Di kolom kanan langkah Sapa ada petunjuk singkat supaya tidak kosong. Ditemukan saat uji: di layar laptop yang pendek (misalnya 1280x720, 1366x650) balon bicara menimpa kepala sampai 151 px. Diperbaiki dengan utilitas `figure-fit` (`src/index.css`): tinggi gambar pembeli mengikuti tinggi panggung, jadi ukurannya tetap di 1280x800 ke atas dan mengecil di layar yang lebih pendek. Sesudahnya tidak ada balon yang menimpa kepala di 1024x768, 1280x720, 1366x768, 1366x650, 1536x730, 1920x950, dan 1024x600 (paling dekat: ujung ekor balon menyentuh puncak sorban Diponegoro).
- Butir 5: tombol ← saat permainan berjalan membuka dialog buatan sendiri (`ExitDialog.jsx`, elemen `<dialog>`, bukan `window.confirm`) "Tutup warung sekarang?" / "Skor level ini belum tersimpan." dengan tombol "Lanjut main" dan "Tutup warung". Fokus mulai di "Lanjut main" dan terkunci di dialog (Tab dan Shift+Tab berputar di dua tombol), Esc menutup dialog dan fokus kembali ke tombol ←. Tombol kembali browser membuka dialog yang sama; "Tutup warung" membuka beranda.
- Butir 6: judul dan deskripsi beranda diringkas di layar HP. Di 360x640 bagian bawah tombol "Buka warung" level 1 ada di y 573 (sebelum y 801, perlu scroll).
- Butir 7: layar hasil punya tombol utama "Lanjut ke <nama level berikutnya>" kalau ada level berikutnya, lalu "Main lagi" sebagai tombol kedua dan "Kembali ke beranda". Di level 3 tetap "Main lagi" dan "Kembali ke beranda". "Lanjut ke Warung Ramai" membuka pintu warung level 2.
- Dicek di build produksi: axe-core tanpa pelanggaran di semua layar dan langkah, dialog, serta momen serah terima (360x640 dan 1280x800); ketiga level dimainkan sampai hasil di 360x640 dan 1280x800 (skor 36/40, 44/50, 54/60, konsol bersih); isi meja kerja tidak perlu digeser di 1024x768, 1280x800, dan 1366x768.
- Yang menjadi lebih buruk: di 360x640 meja kerja 17 px lebih pendek (213 menjadi 196 px), jadi pada keadaan yang memang perlu digeser, isi meja perlu digeser 19 px lebih jauh (diukur dengan seed tetap di build sebelum dan sesudah; misalnya level 2 dengan pesan salah 78 menjadi 97 px, dan level 1 dengan pesan salah 6 menjadi 25 px).
- Ukuran bundle gzip: JS dan CSS awal 93,72 menjadi 94,67 kB; `PlayScreen` 15,66 menjadi 18,01 kB; berkas karakter 10,23 menjadi 12,21 kB (lengan baru dan bungkusan); total semua chunk 141,97 menjadi 147,32 kB. Tidak ada dependency baru. README diperbarui. `src/game` dan `src/data` tidak diubah.
- `npm test` (18 berkas, 125 tes), `npm run build`, dan `npm run lint` (0 peringatan) lulus dengan Node 24.21.0. Uji di HP asli: (tidak dapat diverifikasi).

Yang saya ubah atau tolak:

Commit terkait:
- `88350b7` feat: redraw character arms with elbows, cuffs, and mitten hands resting on the counter
- `8faba29` feat: hand the bag and change to the customer after a correct answer
- `9e1ea3c` feat: sequence customer switch and use two columns on wide screens
- `df09960` feat: confirm before closing the warung and offer the next level
- `c44b513` style: compact the home header so the start button fits on phones
- `d573b2c` docs: describe arms, handover, exit dialog, and desktop layout in README
- `c7f146f` chore: add before and after screenshots for site test fixes
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P24, 7 Oktober 2026, 08.58 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: gambar ulang mesin kasir (di luar daftar tugas bagian 4; terkait Tugas 4 dan 8)
Prompt:

````text
Mesin kasir di meja terlalu kecil dan kurang bagus. Gambar ulang. Kerjakan di satu PR.

Bentuk (SVG, gaya sticker sesuai AGENTS.md)
- Mesin kasir warung model lama: badan kotak membulat, layar miring di atas, deretan tombol angka, laci uang di bawah, dan gulungan kertas nota di bagian atas.
- Warna dari token yang ada: badan terpal-tua, layar tinta dengan angka pisang, tombol kapur, laci kayu, aksen jingga.

Ukuran dan posisi
- Di 360x640 lebar mesin minimal 110 px, kira-kira sepertiga lebar layar. Di 1280x800 minimal 200 px.
- Berdiri di atas meja kasir di sisi kanan, di depan pembeli, tidak menutupi wajah pembeli, gelembung bicara, atau area kerja.
- Angka di layar minimal setinggi 14 px dan terbaca jelas.

Interaksi (hanya sebagai respons aksi anak)
- Layar: "Rp ?" sebelum total diketahui, lalu total belanja di langkah Hitung.
- Langkah Hitung: tombol mesin berkedip bergantian sebentar dan kertas nota keluar dari atas.
- Langkah Kembalian: laci terbuka dan memperlihatkan uang di dalamnya, lalu menutup setelah kembalian benar.

Aturan
- Mesin bersifat dekoratif (`aria-hidden="true"`), karena total sudah ada di teks.
- Hormati `prefers-reduced-motion`.
- Di 360x640 tidak boleh muncul scroll halaman, dan ukuran karakter tidak boleh mengecil.
- Jangan ubah isi `src/game` dan `src/data`.
- Cek dengan screenshot langkah Ambil buah, Hitung, dan Kembalian di 360x640 dan 1280x800.
- Pastikan lint, tes, dan build lolos.
````

Hasil AI:
- Mesin kasir baru (`src/components/CashRegister.jsx`), SVG bergaya stiker dengan token warna yang ada: alas, laci kayu dengan pegangan jingga, badan kotak membulat terpal-tua dengan deretan tombol kapur dan satu tombol jumlah jingga, layar miring (rumah layar terpal-tua, layar tinta dengan angka pisang), dan gulungan kertas nota di atas yang dijepit dua penyangga jingga. Mesin hanya hiasan (`aria-hidden="true"`); total tetap tertulis di nota dan teks. Kalkulator, timbangan, dan kucing warung lama tetap ada di tablet.
- Ukuran (diukur di build produksi): sebelumnya 84x40 px di 360x640 dan 96x46 px di 1280x800. Sesudah: 120x72 px di 360x640 (sepertiga layar), 202x121 px di 1280x800 (41% lebar kolom kiri, 150 sampai 220 px), 179x107 px di 1024x768, dan 176x106 px di tablet 768x1024. Angka layar memakai font 20 satuan: 20 px di HP, jadi angka setinggi 14,8 px (tinggi angka Lilita One 0,74 em, diukur dengan canvas), dan sekitar 25 px di 1280x800.
- Posisi: di HP dan tablet mesin berdiri di atas meja kasir di sisi kanan, di atas area kerja. Di layar 1024 px ke atas mesin ada di panggung pembeli, di kanan bawah, di depan pembeli. Supaya wajah tidak tertutup, pembeli di layar lebar digeser ke kiri secukupnya (utilitas `stage-fit` di `src/index.css`, dengan setengah lebar wajah per langkah); ukuran pembeli tidak berubah (460 dan 386 px di 1280x800, 182 dan 260 px di 360x640). Papan nama ikut ke bawah pembeli.
- Ditemukan saat uji di 360x640: balon bicara menimpa mesin kasir sampai 21 px (pesanan level 3 dua baris, dan balon Kembalian dengan beberapa lembar uang). Diperbaiki tanpa mengubah ukuran karakter atau panggung: di HP chip pesanan dan padding balon sedikit lebih ringkas (tiga jenis buah muat satu baris), di balon Kembalian jumlah uang ditulis langsung setelah "Uangku:" dan gambar uang turun ke baris berikutnya, balon dimulai 6 px lebih kiri (masih tidak menyentuh kepala), dan papan nama langkah kerja lebih sempit (nama boleh dua baris).
- Hasil pengukuran (12 kombinasi level dan tokoh per langkah, juga setelah jawaban salah): mesin tidak menimpa wajah, tangan, balon, papan nama, atau area kerja di 360x640, 768x1024, 1024x768, 1280x800, dan 1366x650. Jarak terkecil balon ke mesin di 360x640: 27 px (Ambil buah), 14 px (Hitung, dengan kertas nota keluar), 20 px (Kembalian). Tidak ada scroll halaman di 360x640. Jarak kepala, ruang balon, dan papan nama dari PR sebelumnya tetap sama.
- Interaksi, diturunkan dari langkah lewat fungsi baru `getRegisterMotion` di `src/lib/registerScreen.js` (dengan tes). Layar tetap "Rp ?" sampai total diketahui: di level 1 total tampil di langkah Hitung; di level 2 dan 3 setelah anak memilih total yang benar, supaya jawaban tidak bocor. Setelah pesanan dibungkus (langkah Hitung) tombol berkedip bergantian sekali, satu tombol menyala pada satu waktu, sekitar 0,2 sampai 1,1 detik, lalu kertas nota naik keluar dari atas. Nota itu lalu ada di meja, jadi di langkah Kembalian kertasnya sudah tidak ada. Di langkah Kembalian laci terbuka dan memperlihatkan uang (lembaran berwarna dan koin), tetap terbuka saat jawaban salah, dan menutup setelah kembalian benar. Sebelumnya laci hanya terbuka 700 ms setelah tombol "Berikan kembalian".
- Direkam frame demi frame di 360x640 dan 1280x800. Dengan "kurangi gerakan": 0 frame tombol menyala, 0 frame kertas atau laci bergerak; keadaan langsung berganti. Konsol bersih.
- Dicek juga: axe-core tanpa pelanggaran di semua layar dan langkah (360x640 dan 1280x800); ketiga level dimainkan sampai hasil di 360x640 dan 1280x800 (skor 36/40, 44/50, 54/60); isi meja kerja yang perlu digeser di HP sama persis dengan sebelum perubahan (seed tetap). Ukuran bundle gzip: JS dan CSS awal 94,69 menjadi 95,03 kB; `PlayScreen` 18,01 menjadi 18,63 kB; total 147,32 menjadi 148,28 kB. Tidak ada dependency baru. README diperbarui. `src/game` dan `src/data` tidak diubah.
- `npm test` (18 berkas, 128 tes), `npm run build`, dan `npm run lint` (0 peringatan) lulus dengan Node 24.21.0. Uji di HP asli: (tidak dapat diverifikasi).

Yang saya ubah atau tolak:

Commit terkait:
- `8063e6e` style: make phone order chips and bubble padding more compact
- `59fd1b1` feat: redraw the cash register with blinking keys, a receipt roll, and a money drawer
- `a500644` docs: describe the new cash register in README
- `0482663` chore: add cash register screenshots for the PR
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P25, 7 Oktober 2026, 09.18 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: efek suara dari rekaman CC0 (Tugas 9, fitur tambahan suara)
Prompt:

````text
Ganti efek suara buatan Web Audio dengan rekaman berlisensi CC0. Kerjakan di satu PR.

Sumber
- Hanya berkas berlisensi CC0. Utamakan paket Kenney (RPG Audio, Interface Sounds, Casino Audio). Untuk bunyi yang tidak ada di sana, ambil dari Freesound atau OpenGameArt dengan filter CC0.
- Kalau kamu tidak punya akses internet untuk mengunduh, berhenti dan beri saya daftar berkas yang harus saya taruh di `public/sfx/`.

Bunyi yang dibutuhkan
- Rolling door naik saat warung dibuka.
- Lonceng pintu saat pembeli datang.
- Langkah kaki saat pembeli berjalan masuk dan keluar, selaras dengan ayunan langkah.
- Ambil buah ke kantong, dan keluarkan buah.
- Bungkus pesanan (kertas atau kantong).
- Tombol mesin kasir saat total muncul.
- Laci mesin kasir terbuka ("ka-ching") di langkah Kembalian.
- Uang kertas dan koin saat menyusun kembalian.
- Jawaban benar, jawaban salah (lembut, bukan buzzer), dan fanfare di layar hasil.

Pengolahan
- Konversi ke MP3 mono 96 kbps, karena OGG tidak selalu bisa diputar di Safari iPhone. Potong hening di awal dan akhir, samakan kekerasannya.
- Tiap berkas maksimal 1,5 detik dan 30 kB. Total semua berkas maksimal 300 kB.
- Muat setelah sentuhan pertama anak, bukan saat halaman dibuka. Putar lewat Web Audio (decodeAudioData) supaya tidak ada jeda.
- Bila berkas gagal dimuat, pakai bunyi Web Audio yang lama sebagai cadangan.

Halaman uji
- Buat halaman tersembunyi `/?sfx` berisi daftar semua bunyi dengan tombol putar, nama berkas, dan sumbernya, supaya saya bisa mendengarkan dan meminta ganti.

Kredit
- Buat `docs/kredit-aset.md`: nama berkas, judul asli, pembuat, tautan sumber, dan lisensi. Tambahkan bagian "Kredit aset" di README yang menaut ke berkas itu.

Aturan
- Tombol Suara, mati saat tab tersembunyi, dan umpan balik visual tetap seperti sekarang.
- Jangan ubah isi `src/game` dan `src/data`.
- Laporkan ukuran total berkas suara dan pengaruhnya ke waktu muat.
- Pastikan lint, tes, dan build lolos.
````

Hasil AI:
- Akses internet tersedia, jadi berkas diunduh langsung. Dipakai lima paket Kenney berlisensi CC0: RPG Audio, Interface Sounds, Casino Audio, Impact Sounds, dan Music Jingles; tiap paket berisi `License.txt` "Creative Commons Zero, CC0". Tiga bunyi yang tidak ada di Kenney diambil dari Freesound dengan filter CC0, dan lisensinya dicek di halaman tiap bunyi: rolling door ("Rolling shutter" oleh Areti18), lonceng pintu ("Ryuuzan_shop_door_bell00.wav" oleh ryuuzan), dan laci "ka-ching" ("Cash Register Fake.wav" oleh CapsLok). "Cash Register Purchase" oleh Zott820 sengaja tidak dipakai: berkas itu CC0, tetapi menurut deskripsinya memakai bunyi lain berlisensi CC BY 4.0. Dari Freesound diambil berkas pratinjau MP3 128 kbps yang tersedia tanpa akun. OpenGameArt tidak dipakai.
- Pengolahan dengan ffmpeg dan skrip Python kecil (tidak ikut repo): mono, hening di awal dan akhir dipotong, kekerasan disamakan (RMS bagian yang berbunyi -18 dBFS, puncak paling tinggi -1 dBFS, limiter untuk bunyi berpuncak tajam), lalu MP3 mono 96 kbps. Hasilnya 15 berkas di `public/sfx/`, 0,05 sampai 1,49 detik dan 1,0 sampai 17,8 kB per berkas, total 112,4 kB (115.274 byte). Pilihan bunyi Kenney berdasarkan ukuran dan karakter bunyi (durasi, kekerasan, kecerahan), bukan didengarkan; halaman `/?sfx` disediakan supaya pemilik proyek bisa mendengarkan dan meminta ganti.
- Daftar berkas beserta asalnya ada di `src/lib/sfxFiles.js`, dengan tes: berkas ada, paling besar 30 kB, total paling besar 300 kB, berlisensi CC0, dan bersumber.
- Pemutaran (`src/lib/sfx.js`): berkas baru dimuat setelah sentuhan atau tombol keyboard pertama (sekali saja, dan tidak dimuat kalau suara dimatikan), lalu di-decode dengan `decodeAudioData` (juga bentuk callback untuk Safari lama) dan diputar lewat `AudioBufferSourceNode`. Selama berkas belum siap atau kalau gagal dimuat, bunyi Web Audio lama dipakai sebagai cadangan. Bunyi baru yang belum punya versi lama diberi cadangan sintetis sederhana. Tombol Suara dan berhenti saat tab tersembunyi tetap seperti sebelumnya.
- Bunyi yang dipasang: pintu gulung saat pintu mulai naik (layar loading, juga sebelum layar hasil); lonceng pintu saat pembeli mulai masuk (sebelumnya saat pembeli sampai); langkah kaki bergantian dua rekaman, dijadwalkan pada titik kaki menapak (enam tapak saat masuk, empat saat keluar) dari irama jalan yang kini ada di `src/components/character/walkCycle.js` (dengan tes). Selanjutnya: buah masuk dan keluar kantong, bungkus saat pesanan benar dibungkus, tombol mesin kasir 0,2 detik kemudian (bersamaan dengan kedip tombolnya), dan "ka-ching" laci 0,35 detik setelah masuk langkah Kembalian. Lalu uang kertas atau koin (di bawah Rp1.000) saat menyusun kembalian, jawaban benar, jawaban salah yang lembut (`bong_001` dari Interface Sounds), fanfare di layar hasil, dan klik tombol.
- Dicek di Chromium (build produksi, 360x640): 0 permintaan `/sfx` sebelum sentuhan pertama, 15 permintaan setelah ketuk kartu level, semua 15 berkas berhasil di-decode, 0 nada cadangan, dan konsol bersih. Urutan bunyi tercatat sesuai aksi selama satu pembeli dilayani dan pembeli berikutnya datang. Dengan semua `/sfx/*` diblokir, 52 nada cadangan berbunyi dan permainan tetap jalan. Dengan "kurangi gerakan" tidak ada langkah kaki (pembeli tidak berjalan), lonceng tetap berbunyi.
- Pengaruh ke waktu muat (Slow 4G, cache kosong, 360x640, tiga kali): beranda tetap selesai dimuat sekitar 1,72 detik dan tanpa berkas suara; unduhan beranda naik 2,4 kB (kode pemuat dan daftar berkas). Dari ketuk level sampai pembeli mulai berjalan tetap sekitar 1,29 detik (sebelum: 1,28 sampai 1,30; sesudah: 1,27 sampai 1,30). Ke-15 berkas (115 kB) selesai dimuat di latar belakang 2,2 detik setelah ketuk; di koneksi cepat 0,12 sampai 0,13 detik. Pada Slow 4G, bunyi pintu gulung pertama masih memakai cadangan karena berkasnya belum selesai.
- Halaman tersembunyi `/?sfx` (`src/screens/SfxScreen.jsx`, dimuat terpisah 1,1 kB gzip, ikut build produksi): daftar ke-15 bunyi dengan tombol "Putar", tombol "Cadangan" (bunyi Web Audio lama), nama berkas, status pemuatan, judul asli, pembuat, tautan sumber, dan lisensi. Dicek di 360x640 dan 1280x800: semua berstatus siap setelah tombol pertama, axe-core tanpa pelanggaran, konsol bersih.
- Kredit: `docs/kredit-aset.md` baru (nama berkas, kegunaan, judul asli, pembuat, tautan sumber, lisensi, hasil olahan, dan cara pengolahan), bagian "Kredit aset" di README, dan AGENTS.md diperbarui (struktur folder, aturan berkas `docs/kredit-aset.md`, status fitur suara). `vercel.json`: berkas `/sfx/` di-cache satu hari (`stale-while-revalidate` satu minggu), supaya berkas yang diganti dengan nama sama tetap cepat sampai.
- Dicek juga: ketiga level dimainkan sampai hasil di 360x640 dan 1280x800 (skor 36/40, 44/50, 54/60); axe-core tanpa pelanggaran di semua layar dan langkah. `src/game` dan `src/data` tidak diubah. Tidak ada dependency npm baru.
- `npm test` (20 berkas, 145 tes), `npm run build`, dan `npm run lint` (0 peringatan) lulus dengan Node 24.21.0. Bunyi tidak didengarkan oleh AI (tidak dapat diverifikasi); uji di HP asli, termasuk Safari iPhone: (tidak dapat diverifikasi).

Yang saya ubah atau tolak:

Commit terkait:
- `b978062` feat: add CC0 sound recordings with their sources
- `40c8d18` feat: play recorded sounds through Web Audio with the old tones as fallback
- `adfb670` feat: add hidden sound test page at /?sfx
- `ec5a6ed` docs: credit the sound recordings and describe the new sounds
- `c2e17e3` chore: add sound test page screenshot for the PR
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P26, 7 Oktober 2026, 09.27 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: hapus konteks belajar coding dari aplikasi dan dokumen (di luar daftar tugas bagian 4; terkait Tugas 7 dan 11)
Prompt:

````text
Hilangkan konteks "belajar coding / berpikir seperti programmer" dari seluruh aplikasi karena terasa dipaksakan. Kerjakan di satu PR.

Yang dihapus
- Bagian "Belajar coding di warung" di beranda, termasuk tabel konsep coding (urutan, perulangan, percabangan, variabel).
- Kata "programmer" dan "coding" di tagline beranda, meta description, og:description, twitter:description, teks alt og:image, dan README.
- Sisa referensi lain di src. Cari kata: coding, programmer, sequence, loop, if/else, variable, variabel, perulangan, percabangan.

Yang menggantikan
- Tagline beranda: "Jadi penjaga warung buah, layani para pahlawan Indonesia, sambil berlatih berhitung dan mengenal sejarah."
- Ganti bagian yang dihapus dengan bagian pendek "Yang kamu latih" berisi empat butir dengan ikon SVG kecil:
  - Berhitung: menjumlah dan mengalikan harga buah.
  - Uang rupiah: menghitung kembalian.
  - Teliti dan runtut: melayani pembeli langkah demi langkah.
  - Kenal pahlawan: cerita singkat dari tiap tokoh.
- Meta description: "Game web untuk anak SD: jaga warung buah, layani tokoh pahlawan Indonesia, sambil berlatih berhitung, menghitung kembalian, dan mengenal sejarah."

Dokumen
- Sesuaikan bagian Tujuan dan tabel pemetaan konsep di AGENTS.md supaya tidak lagi menyebut coding.
- Jangan ubah `docs/prompt-log.md` dan entri lama di `docs/jurnal-prompt.md`.
- Bila og-image memuat tulisan tentang coding, buat ulang gambarnya.

Aturan
- Empat langkah permainan (Sapa, Ambil buah, Hitung, Kembalian) dan bagian "Cara main" tetap.
- Beranda di 360x640 tetap menampilkan tombol main tanpa scroll.
- Jangan ubah isi `src/game` dan `src/data`.
- Pastikan lint, tes, dan build lolos.
````

Hasil AI:
- Sebelum mengubah apa pun, AI bertanya dua hal karena ada pertentangan dengan AGENTS.md. Pertama: teks konsep coding (`CODING_CONCEPTS`) ada di `src/data/guide.js`, padahal prompt melarang mengubah `src/data`. Pemilik proyek memilih "Boleh ubah guide.js": `CODING_CONCEPTS` dihapus dan daftar "Yang kamu latih" (`PRACTICE`) ditambahkan di sana; `HOW_TO_PLAY` dan `describeLevel` tidak diubah, `src/game` tidak disentuh. Kedua: baris subtema di header AGENTS.md menyebut "coding for kids". Pemilik proyek memilih "Hapus coding for kids", jadi baris itu kini "Subtema: Web Education for Kids (untuk anak SD)".
- Beranda (`src/screens/HomeScreen.jsx`): bagian "Belajar coding di warung" beserta tabel konsep coding dihapus. Tagline diganti "Jadi penjaga warung buah, layani para pahlawan Indonesia, sambil berlatih berhitung dan mengenal sejarah." Bagian baru "Yang kamu latih" berisi empat butir dengan ikon SVG kecil buatan sendiri (`src/components/PracticeIcon.jsx`, aria-hidden): Berhitung (papan hitung dengan tanda tambah dan kali), Uang rupiah (uang kertas), Teliti dan runtut (daftar langkah dengan centang), Kenal pahlawan (bintang dengan pita). Bagian "Cara main" dan empat langkah permainan tidak berubah.
- `index.html`: meta description, og:description, dan twitter:description diganti dengan teks dari prompt. Teks alt og:image dan twitter:image tidak menyebut coding, jadi tidak diubah. og-image.png bertuliskan "Layani para pahlawan, hitung uang, dan berpikir runtut" (tanpa kata coding atau programmer), jadi tidak dibuat ulang.
- Pencarian kata coding, programmer, sequence, loop, if/else, variable, variabel, perulangan, dan percabangan di `src`, `index.html`, dan `public`: sisa satu kata "perulangannya" di komentar kode animasi (`AnimeCharacter.jsx`, tentang gerak diam yang berulang) diganti "gerak berulangnya". Setelahnya tidak ada lagi kecocokan di `src` dan `index.html`. Satu-satunya kecocokan di `public` adalah kata "encoding" di `sitemap.xml`, bukan sisa konteks coding.
- AGENTS.md: bagian Tujuan dan tantangan pendidikan ditulis ulang tanpa coding (berhitung, uang dan kembalian, teliti langkah demi langkah, tokoh sejarah), kata "(algoritma)" di alur game dihapus, dan tabel "Hubungan dengan konsep coding" diganti tabel "Yang dilatih" (Berhitung, Uang rupiah, Teliti dan runtut, Kenal pahlawan). Aturan kode "Nama variabel dan fungsi dalam bahasa Inggris" tetap karena itu aturan kerja, bukan isi aplikasi. README: deskripsi dan butir fitur Beranda tidak lagi menyebut programmer atau konsep coding, dan screenshot beranda di `.github/readme/beranda.jpg` (yang memuat tagline lama) diambil ulang. Nama lomba "M-ONE Telkomsel Coding Competition 2026" di AGENTS.md dan README tetap karena itu nama resmi lomba. `docs/prompt-log.md` (selain entri ini) dan entri lama `docs/jurnal-prompt.md` tidak diubah.
- Dicek di build produksi: di 360x640 kartu level 1 dan tombol "Buka warung" tetap terlihat tanpa scroll (kartu berakhir di y 593, sama seperti sebelumnya); tinggi halaman beranda turun dari 2.688 menjadi 2.356 px di 360x640 dan dari 1.698 menjadi 1.426 px di 1280x800. axe-core tanpa pelanggaran di beranda dan semua layar permainan (360x640 dan 1280x800).
- `npm test` (20 berkas, 145 tes), `npm run build`, dan `npm run lint` (0 peringatan) lulus dengan Node 24.21.0. Tidak ada dependency baru.

Yang saya ubah atau tolak:

Commit terkait:
- `1c5d248` feat: replace the coding section on home with what kids practice
- `7fc48e3` fix: describe counting, change, and heroes in the page description
- `bf74165` docs: drop the coding framing from AGENTS.md and README
- `a249d05` chore: add home screen screenshots for the PR
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P27, 7 Oktober 2026, 13.13 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: perbaiki animasi lambaian saat menyapa dan pamit (di luar daftar tugas bagian 4; terkait Tugas 4 dan 8)
Prompt:

````text
Animasi lambaian tangan saat pembeli menyapa (dan saat pamit) rusak sejak lengan digambar ulang. Di pose puncak, tangan menempel di pipi, menutupi wajah, dan telapak tangan terputar jadi garis tipis. Perbaiki. Kerjakan di satu PR.

Penyebab yang saya lihat
- Sudut lambaian (lengan atas -90, lengan bawah -126 sampai -136) dibuat untuk lengan lama yang lurus. Dengan pose istirahat baru yang sikunya menekuk, sudut itu melipat lengan ke wajah.
- Tangan tidak punya varian "greet" dan "farewell", jadi ikut terputar bersama lengan bawah.

Pose yang benar
- Di puncak lambaian, tangan berada di samping kepala, setinggi telinga sampai ubun-ubun, dan di luar siluet kepala. Beri jarak minimal 4 unit viewBox dari kepala, penutup kepala, dan kacamata.
- Lengan atas terangkat ke samping luar, siku kira-kira setinggi bahu, lengan bawah mengarah ke atas.
- Telapak tangan tetap tegak menghadap depan selama melambai. Tambahkan putaran penyeimbang pada tangan untuk varian greet dan farewell.
- Gerak lambaian: lengan bawah berayun kiri dan kanan sekitar 15 derajat dari posisi tegak, 2 sampai 3 ayunan, total sekitar 0,8 detik, lalu kembali bertumpu di meja dengan halus.
- Tangan yang satunya tetap di atas meja.
- Hitung sudut dari posisi sendi di pose istirahat yang sekarang, bukan dari angka lama.

Berlaku untuk semua tokoh
- Periksa tokoh dengan penutup kepala lebar (sorban Diponegoro, kerudung Cut Nyak Dhien, blangkon) dan yang berkacamata (Hatta, Ki Hajar). Tangan tidak boleh menimpa penutup kepala.
- Perbaiki juga lambaian pamit sebelum pembeli berjalan keluar.

Aturan
- Jangan ubah bentuk lengan, ukuran karakter, dan komposisi meja kasir.
- `prefers-reduced-motion`: tanpa lambaian.
- Cek dengan menangkap frame pose puncak (bekukan animasi di tengah) untuk Hatta, Diponegoro, dan Cut Nyak Dhien di 360x640 dan 1280x800, lalu lampirkan di PR.
- Pastikan lint, tes, dan build lolos.
````

Prompt tambahan (dikirim di tengah pengerjaan prompt ini):

````text
I hit my usage limit while you were working, but it has reset now. Please continue from where you left off.
````

Hasil AI:
- Sebelum mengubah kode, AI menghitung jangkauan lengan dari sendi pose istirahat (bahu, siku, dan tangan di `FRONT_ARM`; jarak bahu ke tangan paling jauh 26,8 satuan viewBox) dan menyimpulkan tangan tidak bisa sampai setinggi telinga dengan jarak 4 satuan dari kepala. AI lalu bertanya dua hal. Pemilik proyek memilih "Samping rahang (Recommended)" (di puncak, tangan di samping rahang, di luar siluet kepala) dan "Boleh di depan juntaian (Recommended)" (untuk Cut Nyak Dhien dan Pattimura, tangan boleh berada di depan kerudung atau ikat kepala yang menjuntai di bawah telinga, tetapi tetap berjarak dari wajah dan dari penutup kepala di atas telinga).
- Saat mengukur di browser, AI menemukan dua hal. Pertama, siluet kepala yang dipakai untuk pertanyaan tadi terukur 4 satuan terlalu rendah. Kedua, penyebab utama lambaian rusak: fungsi `pivot()` di `AnimeCharacter.jsx` mengurangi titik putar dengan `VIEW_BOX.y` (4), padahal Chromium 141 mengukur transform-origin `transform-box: view-box` dari titik (0, 0). Akibatnya semua sendi berputar pada titik 4 satuan di atas sendinya, sehingga putaran besar seperti lambaian melempar tangan ke wajah. Setelah keduanya dikoreksi, hitungan diulang: dengan jarak minimal 4 satuan sepanjang ayunan, ujung atas tangan paling tinggi sekitar y 60, sedangkan garis mata y 50. Jadi tinggi telinga tetap tidak terjangkau, dan pose samping rahang dipertahankan.
- Perbaikan titik putar: viewBox svg tokoh kini dimulai di (0, 0) (`0 0 100 132`) dan gambar digeser 4 satuan ke atas, sehingga titik putar sama di browser yang mengukur dari (0, 0) maupun dari pojok viewBox. Tampilan diam tidak berubah. Pose lain dicek di galeri dengan "kurangi gerakan": pose memegang bungkusan sedikit berubah (bungkusan sedikit lebih rendah, tangan di pegangan), pose tampak samping membawa bungkusan praktis sama.
- Lambaian baru dihitung di `src/components/character/wavePose.js` dari sendi pose istirahat yang sekarang (dengan tes di `wavePose.test.js`). Lengan atas berputar -62 derajat, sehingga siku keluar ke samping di (76,9; 75,5), 1,7 satuan di atas bahu. Lengan bawah condong ke atas dan ke luar, 50 derajat dari tegak, lalu berayun 15 derajat ke luar dan ke dalam. Tangan mendapat putaran penyeimbang (-50, -35, dan -65 derajat) di varian greet dan farewell, sehingga telapak tetap tegak dengan jari ke atas. Urutan: naik 0,3 detik, dua kali ayunan luar-dalam 0,8 detik, lalu turun bertumpu di meja 0,35 detik (total 1,45 detik; jeda 0,05 detik saat menyapa dan 0,15 detik saat pamit, seperti sebelumnya). Tangan yang satunya tetap di meja (saat pamit memegang bungkusan). Bentuk lengan, ukuran karakter, dan meja kasir tidak diubah. Dengan `prefers-reduced-motion`, lengan tidak bergerak saat menyapa maupun saat pamit (dicek di permainan).
- Jarak tangan dan lengan bawah ke kepala diukur di browser dari galeri (pose lambaian, gerak diam dimatikan, 6,4 px per satuan, tepi garis ke tepi garis, terhadap kepala, rambut, penutup kepala, dan kacamata di atas y 70). Hasil untuk ayun dalam / puncak / ayun luar: Kartini, Soekarno, Hatta, Ki Hajar Dewantara, Diponegoro, dan Sudirman 4,2 / 5,4 / 5,4 satuan; Cut Nyak Dhien 5,1 / 8,4 / 12,0; Pattimura 5,6 / 9,0 / 12,7 (juntaian kerudung dan ikat kepala di bawah y 52 dan di kanan wajah tidak dihitung, sesuai jawaban pemilik proyek). Ujung atas tangan di y 59,2. Tangan tidak menimpa sorban Diponegoro, blangkon Sudirman, peci, maupun kacamata Hatta dan Ki Hajar.
- Frame pose puncak dibekukan dengan jam palsu Playwright (lengan atas -62, lengan bawah -116, tangan -50 derajat) untuk Hatta, Diponegoro, dan Cut Nyak Dhien di 360x640 dan 1280x800, saat menyapa dan saat pamit, ditambah perbandingan sebelum dan sesudah untuk Hatta dan galeri kedelapan tokoh. Semuanya di `.github/pr-assets/lambaian/`.
- Yang belum beres dan tidak diubah, karena prompt melarang mengubah komposisi meja kasir. Di 1280x800, mesin kasir (di depan pembeli) menutupi separuh bawah tangan yang melambai; telapak dan jari tetap terlihat di atas mesin kasir. Di 360x640 saat pamit, papan nama menutupi sebagian lengan bawah. Tangan tidak bisa dinaikkan lagi tanpa mendekati kepala.
- Dicek juga: ketiga level dimainkan sampai hasil di 360x640 dan 1280x800 (skor 36/40, 44/50, 54/60), dan lambaian pamit tetap berjalan sebelum pembeli berbalik dan keluar. Di server dev muncul peringatan React "flushSync was called from inside a lifecycle method"; peringatan yang sama juga muncul di commit sebelum PR ini (2492add), jadi bukan dari perubahan ini.
- `npm test` (21 berkas, 150 tes), `npm run build`, dan `npm run lint` (0 peringatan) lulus dengan Node 24.21.0. Tidak ada dependency baru. `src/game` dan `src/data` tidak diubah. Uji di HP asli dan di Safari/Firefox: (tidak dapat diverifikasi).

Yang saya ubah atau tolak:

Commit terkait:
- `4f5872f` fix: rotate character joints around the real joint in every browser
- `ba64e06` fix: wave beside the jaw with the palm kept upright
- `ff39841` chore: add frozen wave frames for the PR
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.

### P28, 8 Oktober 2026, 07.45 WIB (dari riwayat commit: waktu commit pertama untuk prompt ini)
Tugas: dokumentasi pembagian peran AI di AGENTS.md (di luar daftar tugas bagian 4; terkait Tugas 11)
Prompt:

````text
Tambahkan bagian "Pembagian peran AI" di AGENTS.md. Kerjakan di satu PR.

Isi bagian itu dengan tabel tiga kolom: Alat AI, Dipakai untuk, Contoh hasil.
(Tulis sesuai kenyataan, jangan mengarang.)
- (nama alat chat AI): menyusun dokumen acuan, menulis prompt untuk agen coding, dan menguji situs yang sudah tayang.
- (nama agen coding dan modelnya): menulis kode, tes, dan PR.

Tambahkan satu kalimat: "Semua prompt ke agen coding dicatat apa adanya di docs/prompt-log.md."
Jangan ubah isi bagian lain, jangan ubah docs/prompt-log.md, dan jangan menambah klaim yang tidak bisa dibuktikan dari riwayat repo.
````

Hasil AI:
- Sebelum mengubah apa pun, AI bertanya tiga hal. Pertama, nama alat chat AI: repo tidak mencatatnya; satu-satunya petunjuk adalah `docs/sumber-fakta.md` yang menyebut cek fakta oleh "AI (Claude)". Pemilik proyek memilih "Claude (claude.ai)". Kedua, nama model agen coding: lingkungan kerja AI melarang menulis nama model ke berkas di repo. Pemilik proyek memilih "Claude Code saja (Recommended)", jadi kolom itu berisi "Claude Code (Anthropic)" tanpa nama model. Ketiga, prompt melarang mengubah `docs/prompt-log.md`, padahal AGENTS.md bagian 8 mewajibkan entri prompt di setiap PR. Pemilik proyek memilih "Tetap tambah entri (Recommended)", jadi entri ini ditambahkan di bagian paling bawah tanpa mengubah entri lama.
- AGENTS.md mendapat bagian baru "10. Pembagian peran AI" di paling akhir, supaya nomor bagian lain tidak bergeser. Isinya tabel Alat AI, Dipakai untuk, Contoh hasil, ditambah kalimat yang diminta. Isi bagian lain tidak diubah.
- Isi kolom "Dipakai untuk" diambil dari prompt. Isi kolom "Contoh hasil" dicek ke riwayat repo. Untuk Claude (claude.ai): versi pertama `AGENTS.md` ada di commit `6f11e03` (author Lim), prompt P1 sampai P28 ada di `docs/prompt-log.md`, dan prompt P8 serta P23 berisi temuan uji situs. Untuk Claude Code: commit dengan author `Claude <noreply@anthropic.com>` (145 commit di main sebelum PR ini) dan PR #1 sampai #26 dari branch `claude/confident-babbage-bpzr6d`; contohnya, PR #3 menambah logika game dan tesnya di `src/game/`.
- `npm test` (21 berkas, 150 tes), `npm run build`, dan `npm run lint` (0 peringatan) lulus dengan Node 24.21.0. Tidak ada dependency baru dan tidak ada perubahan kode.

Yang saya ubah atau tolak:

Commit terkait:
- `705f3d1` docs: describe how AI tools were used in AGENTS.md
- Commit log prompt ini dan PR untuk prompt ini; hash ada di riwayat PR.
