# Jurnal prompt terkurasi

Lima prompt pilihan untuk juri, satu untuk tiap jenis pekerjaan. Teks prompt disalin persis dari [prompt-log.md](prompt-log.md). "Konteks", "Prompt", dan "Hasil" hanya memuat fakta yang ada di repo (riwayat commit, PR, dan hasil tes). "Keputusan saya", "Dugaan saya", dan "Yang saya pelajari" diisi pemilik proyek.

## Status

| No. | Jenis | Prompt di log | Status |
| --- | --- | --- | --- |
| 1 | Ide dan PRD | P1 | Konteks, Prompt, Hasil terisi; catatan pemilik terisi |
| 2 | Debugging | P6 | Konteks, Prompt, Hasil terisi; catatan pemilik terisi |
| 3 | Audit dan optimasi | P20 | Konteks, Prompt, Hasil terisi; catatan pemilik terisi |
| 4 | Finishing | P21 | Konteks, Prompt, Hasil terisi; catatan pemilik terisi |
| 5 | Bebas | P5 | Konteks, Prompt, Hasil terisi; catatan pemilik terisi |

## 1. Ide dan PRD

Sumber: P1 di prompt-log.md; commit `d510fe6`, PR #1

### Konteks

Repository baru berisi docs acuan AI Agent (`AGENTS.md`) yang memuat ide game, alur, level, desain, dan urutan tugas, serta `docs/prompt-log.md` dan `docs/sumber-fakta.md` (commit `6f11e03`). Belum ada kode.

### Prompt

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

### Hasil

- Kerangka proyek React + Vite dengan Tailwind CSS 4, token warna dan font dari `AGENTS.md`, font yang dimuat lokal, dan beranda sementara berisi judul serta satu kalimat penjelasan.
- `npm run build` lulus (JS 220 kB, gzip 69 kB). Beranda dicek di lebar 360 px dan 1280 px. Belum ada tes pada tahap ini.
- Kerangka ini yang kemudian di-deploy ke https://wp.itslim.dev (P2 dan P3).

### Keputusan saya

- Membatasi prompt ini pada Tugas 1 saja (kerangka proyek), tanpa logika game atau layar lain.
- Menjadikan `AGENTS.md` satu-satunya acuan dan meminta AI membacanya sampai habis sebelum mengerjakan apa pun.
- Memilih React + Vite (JavaScript) dengan Tailwind CSS 4 lewat plugin Vite resmi.
- Menulis kriteria selesai yang bisa diperiksa: `npm run dev` tanpa error, `npm run build` lulus, beranda terbaca di 360 px dan 1280 px.
- Meminta AI bertanya bila `AGENTS.md` tidak jelas atau bertentangan, bukan menebak.

### Dugaan saya

- Saya menduga satu prompt pendek sudah cukup untuk kerangka, karena keputusan ide, alur, dan desain sudah tertulis di `AGENTS.md`. Hasil di repo sesuai: build lulus dan beranda terbaca di 360 px dan 1280 px.
- Saya menduga larangan membuat logika game perlu ditulis terang-terangan supaya kerangka tidak melebar ke tugas berikutnya.

### Yang saya pelajari

- Dokumen acuan yang ditulis lebih dulu membuat prompt berikutnya bisa pendek dan cukup merujuk ke bagian `AGENTS.md`.
- Kriteria selesai yang terukur memudahkan saya memeriksa hasil tanpa menebak.
- Ukuran build awal (JS 220 kB, gzip 69 kB) jadi pembanding untuk tugas berikutnya.

## 2. Debugging

Sumber: P6 di prompt-log.md; commit `efd33d0` dan `5d080b7`, PR #5

### Konteks

Game sudah bisa dimainkan dari beranda sampai layar hasil (PR #4) dan live di https://wp.itslim.dev. Saat diuji di HP, tombol aksi tiap langkah baru terlihat setelah scroll sampai bawah halaman.

### Prompt

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

### Hasil

- Temuan diagnosis (Playwright, 360x640, level 3): sebelum meja dimulai, sekitar 420 px dari 640 px sudah terpakai oleh terpal (76 px), header (84 px), penanda langkah (82 sampai 99 px), dan kolom tokoh (164 sampai 181 px). Di dalam meja, yang paling tinggi adalah kantong (340 px) dan keranjang (292 px), nota (286 px) dan pilihan total yang bertumpuk (192 px), serta daftar kembalian (284 sampai 366 px) dan laci uang (276 px). Umpan balik muncul di bawah tombol.
- Tinggi halaman di 360x640, sebelum dan sesudah: Sapa 750 px menjadi 640 px, Ambil buah 1369 px menjadi 640 px, Hitung 1295 px menjadi 640 px, Kembalian 1429 px menjadi 640 px. Sebelumnya tombol aksi utama di keempat langkah tidak terlihat tanpa scroll; sesudahnya selalu terlihat.
- Yang diubah: layar main memakai tinggi layar penuh (`100dvh`), dengan terpal tipis di HP, header satu baris, penanda langkah kompak, pembeli ringkas (fun fact penuh hanya di langkah Sapa), satu area kerja yang bisa di-scroll, dan bar aksi tetap di bawah berisi umpan balik dan tombol utama. Logika game (`src/game`) dan data (`src/data`) tidak diubah.
- Pengecekan: 5 ukuran layar (360x640 sampai 1280x800) x 3 level x 5 langkah. Di semua kombinasi halaman tidak bisa di-scroll dan tombol aksi utama terlihat; sisa geseran area kerja 6 sampai 9 px hanya berupa padding kosong. Satu level penuh dimainkan di 360x640. 78 tes lulus.
- Build `main` setelah perbaikan: JS 272 kB (gzip 84 kB), CSS 35 kB (gzip 10 kB). Versi ini yang sedang live di https://wp.itslim.dev.

### Keputusan saya

- Menggabungkan PR sebelumnya dan meminta perbaikan tata letak HP sebagai prompt tersendiri, bukan menambalnya di PR yang sama.
- Meminta diagnosis dan screenshot sebelum kode diubah, supaya perbaikan berdasarkan ukuran nyata, bukan tebakan.
- Menerima bagian dekoratif dikecilkan di HP (terpal tipis, tokoh ringkas, fun fact penuh hanya di langkah Sapa) demi tombol aksi yang selalu terlihat.
- Mempertahankan tata letak desktop dan tablet, serta melarang perubahan pada `src/game` dan `src/data`.
- Meminta PR dibuat tetapi tidak digabung otomatis.

### Dugaan saya

- Saya menduga masalahnya ada di satu atau dua elemen besar. Ternyata tinggi halaman datang dari banyak elemen sekaligus: kantong 340 px, keranjang 292 px, nota 286 px, dan daftar kembalian sampai 366 px.
- Saya menduga anak SD lebih terganggu oleh tombol yang tersembunyi daripada oleh dekorasi yang dikecilkan.

### Yang saya pelajari

- Mengukur dulu lebih berguna daripada langsung mengubah kode: tinggi halaman turun dari 750 sampai 1429 px menjadi tepat 640 px.
- Bar aksi tetap di bawah layar membuat tombol utama tidak bergantung pada panjang konten.
- Layar HP perlu dirancang sebagai satu layar, bukan halaman panjang yang dipotong.

## 3. Audit dan optimasi

Sumber: P20 di prompt-log.md; commit `e926ece` sampai `2464c84` dan PR untuk prompt ini; angka lengkap di [audit.md](audit.md)

### Konteks

Game sudah lengkap dan live: kamera dekat dengan meja kasir, latar per level, efek suara, dan pembeli bertampak samping. Tugas 10 pernah dikerjakan di PR #10. Angka sebelum audit ini diukur pada `main` commit `8f04e48`, dari build produksi dengan Lighthouse 13.5.0 mode mobile (median 5 run):

- **Beranda:**
  - Performance 98, Accessibility 100, Best Practices 100, SEO 100.
  - LCP 1.954 ms, CLS 0,020, TBT 0 ms.
- **Layar permainan** (alur pengguna dari ketukan "Buka warung"):
  - Performance 93, TBT 219 ms, INP 326 ms, CLS 0.
  - Accessibility, Best Practices, dan SEO masing-masing 100.
- **Bundle:** JS awal 101,08 kB gzip, CSS 11,88 kB gzip. Layar permainan masih ada di bundel awal.
- **Lima modul terbesar:** react-dom, motion-dom, framer-motion, `AnimeCharacter.jsx`, dan `characterParts.jsx`.
- **Temuan lain:**
  - Font ikut membawa subset latin-ext (10 berkas font).
  - Berkas yang tidak ada mendapat teks `NOT_FOUND` tanpa tautan.
  - Di 768 dan 1280 px, nama buah di keranjang meluber dan tombol "−" di kantong terjepit.

### Prompt

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

### Hasil

- **Beranda** (sesudah, median 5 run):
  - Performance 98, Accessibility 100, Best Practices 100, SEO 100.
  - LCP 1.855 ms, CLS 0,020, TBT 0 ms.
- **Layar permainan:** Performance 100, TBT 39 ms, INP 98 ms, CLS 0. Accessibility, Best Practices, dan SEO masing-masing 100.
- **Bundle:**
  - JS awal 84,44 kB + 0,56 kB gzip, CSS 7,96 kB gzip.
  - Yang dimuat saat halaman dibuka turun dari 112,96 kB ke 92,96 kB.
  - Total semua chunk JS naik 3,1 kB karena pemecahan chunk.
- **Perubahan:**
  - Layar permainan dimuat terpisah, dimuat lebih awal dari beranda, dan dibuka dengan `startTransition`.
  - Font hanya subset latin.
  - Halaman `404.html` ramah dengan tombol ke beranda, untuk berkas yang tidak ada. Alamat halaman tetap dialihkan ke beranda sesuai keputusan P16.
  - Keranjang dan kantong rapi di 768 dan 1280 px.
  - Area meja yang bisa digeser diberi nama untuk pembaca layar.
- **Yang tidak membaik:** CLS 0,020 (pergantian font) dan CSS yang memblokir render (sekitar 450 ms). Alasannya ada di audit.md.
- `npm test` (15 berkas, 109 tes), `npm run build`, dan `npm run lint` lulus.

### Keputusan saya

- Meminta pengukuran "sebelum" disimpan di `docs/audit.md` sebelum ada perubahan, supaya hasilnya bisa dibandingkan.
- Menetapkan 404 yang ramah hanya untuk berkas yang tidak ada; alamat halaman tetap dialihkan ke beranda (keputusan P16).
- Menerima CLS 0,020 dan CSS yang memblokir render (sekitar 450 ms) sebagai angka yang tidak membaik, dengan alasan tertulis di `audit.md`, daripada memaksakan perbaikan.
- Melarang penambahan fitur dan perubahan pada `src/game` dan `src/data` selama audit.

### Dugaan saya

- Saya menduga memisahkan layar permainan dari bundel awal akan menurunkan TBT di layar permainan. Hasilnya TBT turun dari 219 ms ke 39 ms dan INP dari 326 ms ke 98 ms.
- Saya menduga pemecahan chunk tidak akan menambah ukuran total. Ternyata total JS naik 3,1 kB, tetapi yang dimuat saat halaman dibuka turun dari 112,96 kB ke 92,96 kB.

### Yang saya pelajari

- Skor Performance beranda sudah 98 sejak awal, jadi keuntungan terbesar ada di layar permainan, bukan di beranda.
- Mengurangi yang dimuat di awal bisa menaikkan total ukuran, dan itu wajar.
- Font latin-ext tidak perlu ikut dibawa untuk situs berbahasa Indonesia.
- Tidak semua angka bisa diperbaiki, dan mencatat alasannya tetap berguna.

## 4. Finishing

Sumber: P21 di prompt-log.md; commit `d904732` sampai `ef5de6c` dan PR untuk prompt ini

### Konteks

Game sudah lengkap dan live di https://wp.itslim.dev setelah PR #19 (audit dan optimasi) digabung ke `main` (commit `9d84ef2`). Keadaan sebelum prompt ini:

- **Jurnal:** empat dari lima bagian sudah berisi Konteks, Prompt, dan Hasil. Catatan pemilik di semua bagian masih kosong.
- **Log prompt:** berisi P1 sampai P20.
- **README:**
  - masih menyebut Tugas 10 "dikerjakan di PR #10";
  - menyebut "buah masuk tas", padahal di game namanya kantong;
  - belum punya screenshot.
- **Data:** fun fact di `src/data/characters.js` sudah dites sama dengan `docs/sumber-fakta.md` sejak PR #3.

### Prompt

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

### Hasil

- **Gerbang kelayakan** (rinciannya di deskripsi PR):
  - Butir 1, 2, 4, 5, dan 6 lolos.
  - Repository bersifat public (API GitHub: `"visibility": "public"`).
  - Situs live menjawab 200 dan memakai berkas JS yang sama dengan build `main`.
  - Butir 3 belum: kelima bagian jurnal sudah berisi Konteks, Prompt, dan Hasil, tetapi catatan pemilik belum diisi.
- **Ketiga level dimainkan sampai layar hasil** di 360x640 dan 1280x800, dengan satu kesalahan di tiap langkah pada pembeli pertama.
  - Skor level 1, 2, dan 3: 36 dari 40, 44 dari 50, dan 54 dari 60.
  - Konsol bersih.
  - Fun fact di balon dan di layar hasil sama persis dengan sumbernya.
- **Bug yang ditemukan dan diperbaiki:**
  - Di 1280x800, pesan umpan balik membuat meja kasir harus digeser 16 sampai 61 px.
  - Tanda "Geser ke bawah" menutupi nama buah di keranjang.
  - Perbaikan: di layar lebar pesan ditaruh di samping tombol. Sesudahnya kelebihan 0 px di semua langkah dan level.
- **Teks:**
  - Daftar tiga buah di pesan salah kini memakai koma sebelum "dan".
  - "Kembaliannya kelebihan" menjadi "Kembaliannya terlalu banyak".
  - README memakai istilah kantong.
- **Kode:**
  - Tidak ada `console.log` atau komentar TODO.
  - Semua komponen dipakai.
  - Paket `@types/react` dan `@types/react-dom` dihapus karena proyek tidak memakai TypeScript.
- **README final:** fitur yang benar-benar ada, keterbatasan, tiga screenshot, dan tautan ke dokumen. Baris mode yang sudah dihapus juga dibuang dari AGENTS.md bagian 5.
- **Log prompt dicocokkan dengan riwayat commit:**
  - Semua hash di P1 sampai P20 ada di `main`, dan pesan commitnya cocok.
  - P7 tidak mencantumkan hash.
  - P8 sampai P20 tidak mencantumkan commit "docs: log prompt" miliknya sendiri.
- **Pemeriksaan otomatis:**
  - `npm test` (15 berkas, 110 tes), `npm run build`, dan `npm run lint` lulus.
  - axe-core tanpa pelanggaran di semua layar.

### Keputusan saya

- Meminta keenam butir Gerbang kelayakan diperiksa satu per satu dengan bukti, bukan hanya dianggap beres.
- Membiarkan butir 3 berstatus "belum", karena catatan pemilik (bagian ini) memang harus diisi sendiri.
- Tidak mengubah isi entri lama di log prompt, meski ada hash yang kosong (P7) atau tidak tercatat (commit "docs: log prompt").
- Memilih pesan umpan balik di samping tombol di layar lebar, supaya meja kasir tidak perlu digeser.
- Menghapus `@types/react` dan `@types/react-dom` karena proyek tidak memakai TypeScript.

### Dugaan saya

- Saya menduga bug yang tersisa tinggal sedikit karena sudah ada audit dan 109 tes. Ternyata masih ada dua masalah tata letak di 1280x800: pesan umpan balik memaksa geser 16 sampai 61 px, dan tanda "Geser ke bawah" menutupi nama buah.
- Saya menduga teks sudah rapi. Ternyata masih ada koma yang kurang dan kata "kelebihan" yang kurang tepat untuk anak.

### Yang saya pelajari

- Bermain langsung di dua ukuran layar menemukan bug yang tidak tertangkap tes otomatis.
- Dokumen mudah tertinggal dari kode: README masih menyebut PR yang salah dan istilah "tas" padahal di game namanya kantong.
- Mencocokkan log prompt dengan riwayat commit menunjukkan bahwa pencatatan hash perlu disiplin sejak awal.

## 5. Bebas

Sumber: P5 di prompt-log.md; commit `7e03a06`, `ccc93c1`, `c6e533a`, `d91ac1d`, `5b0cd96`, PR #4

### Konteks

Data game, logika murni dengan 50 tes, dan ilustrasi SVG buah, uang, dan tokoh sudah ada (PR #3), tetapi situs baru menampilkan beranda sementara. Game belum bisa dimainkan.

### Prompt

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

### Hasil

- Game bisa dimainkan penuh: beranda dengan tiga level dan bintang terbaik, empat langkah per pembeli (Sapa, Ambil buah, Hitung, Kembalian), lalu layar hasil dengan skor, bintang, dan fun fact tokoh yang dilayani.
- Bisa dicoba di https://wp.itslim.dev. Versi yang live sekarang sudah termasuk perbaikan tampilan HP dari P6.
- 12 berkas tes, 78 tes lulus. Build pada commit `5b0cd96`: JS 269 kB (gzip 83 kB), CSS 30 kB (gzip 9 kB); layar hasil dimuat terpisah.
- Uji di build produksi dengan Playwright: level 1 di 360 px selesai dengan skor 40 dari 40; level 3 di 1280 px dengan kesalahan disengaja selesai dengan skor 54 dari 60 (3 bintang). Dicek di 360, 768, dan 1280 px; animasi mati saat `prefers-reduced-motion` aktif.

### Keputusan saya

- Mengizinkan Tugas 5 sampai 8 dalam satu prompt dengan satu commit per tugas, bukan satu prompt per tugas.
- Meminta logika dan ilustrasi yang sudah ada dipakai ulang, bukan ditulis ulang.
- Meminta satu level dimainkan penuh dan hasilnya dilaporkan apa adanya, termasuk bagian yang belum berjalan.
- Berhenti di Tugas 8 dan tidak lanjut ke Tugas 9.

### Dugaan saya

- Saya menduga empat tugas dalam satu prompt cukup aman karena logika dan ilustrasinya sudah teruji (50 tes).
- Saya menduga tata letak yang bagus di 360, 768, dan 1280 px sudah cukup untuk HP. Ternyata layar HP sebenarnya masih terlalu panjang dan baru diperbaiki di prompt berikutnya (P6).

### Yang saya pelajari

- Satu prompt besar bisa menghasilkan game yang bisa dimainkan penuh, tetapi masalah penggunaan di HP baru kelihatan setelah diuji di perangkat sungguhan.
- Pengujian dengan Playwright di build produksi tidak menggantikan mencoba sendiri di HP.
- Beberapa tugas dalam satu prompt hanya aman kalau logika dan datanya sudah teruji lebih dulu.
