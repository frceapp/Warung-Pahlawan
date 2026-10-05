# Jurnal prompt terkurasi

Lima prompt pilihan untuk juri, satu untuk tiap jenis pekerjaan. Teks prompt disalin persis dari [prompt-log.md](prompt-log.md). "Konteks", "Prompt", dan "Hasil" hanya memuat fakta yang ada di repo (riwayat commit, PR, dan hasil tes). "Keputusan saya", "Dugaan saya", dan "Yang saya pelajari" diisi pemilik proyek.

## Status

| No. | Jenis | Prompt di log | Status |
| --- | --- | --- | --- |
| 1 | Ide dan PRD | P1 | Konteks, Prompt, Hasil terisi; catatan pemilik belum |
| 2 | Debugging | P6 | Konteks, Prompt, Hasil terisi; catatan pemilik belum |
| 3 | Audit dan optimasi | - | belum |
| 4 | Finishing | - | belum |
| 5 | Bebas | P5 | Konteks, Prompt, Hasil terisi; catatan pemilik belum |

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


### Dugaan saya


### Yang saya pelajari


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


### Dugaan saya


### Yang saya pelajari


## 3. Audit dan optimasi

Status: belum. Diisi setelah pekerjaannya terjadi.

### Konteks


### Prompt


### Hasil


### Keputusan saya


### Dugaan saya


### Yang saya pelajari


## 4. Finishing

Status: belum. Diisi setelah pekerjaannya terjadi.

### Konteks


### Prompt


### Hasil


### Keputusan saya


### Dugaan saya


### Yang saya pelajari


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


### Dugaan saya


### Yang saya pelajari
