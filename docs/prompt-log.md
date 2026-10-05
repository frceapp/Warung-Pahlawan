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
