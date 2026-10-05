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
