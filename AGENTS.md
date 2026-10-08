# Warung Pahlawan: docs acuan AI Agent

Dokumen ini adalah acuan untuk setiap AI Agent yang mengerjakan proyek ini. Baca seluruhnya sebelum menulis kode. Kerjakan hanya tugas yang diminta di prompt. Kalau permintaan bertentangan dengan dokumen ini atau ada bagian yang tidak jelas, tanyakan dulu ke pemilik proyek dan jangan menebak. Kalau keputusan berubah, dokumen ini diperbarui bersamaan dengan kodenya.

- Disusun: 5 Oktober 2026, setelah garis start lomba (09.30 WIB)
- Lomba: M-ONE Telkomsel Coding Competition 2026, Kategori Umum
- Tema: Innovating Education Through Technology
- Subtema: Web Education for Kids (untuk anak SD)
- Batas pengumpulan: 15 Oktober 2026, 15.30 WIB

## 1. Tujuan

Warung Pahlawan adalah game web untuk anak SD. Anak menjadi penjaga warung buah, dan pembelinya adalah tokoh sejarah Indonesia. Sambil melayani pembeli, anak berlatih berhitung, menghitung kembalian, dan bekerja teliti langkah demi langkah, sekaligus mengenal tokoh sejarah.

Tantangan pendidikan yang dijawab:

1. Latihan berhitung (menjumlah dan mengalikan) sering berupa soal di kertas. Di sini anak mempraktikkannya dalam kegiatan yang sudah mereka kenal: jual beli di warung.
2. Menghitung uang dan kembalian jarang dilatih langsung. Di sini anak menyusun kembalian sendiri dari laci uang.
3. Tokoh sejarah biasanya dihafal. Di sini tokohnya datang sendiri dan bercerita singkat.

## 2. Pengguna

- Utama: anak SD kelas 2 sampai 5, bermain di HP atau laptop, dengan atau tanpa pendamping.
- Pendamping: guru dan orang tua yang memilih level dan melihat hasil.
- Penilai: dewan juri, membuka dari tautan deploy di HP dan desktop.

## 3. Alur game

Satu pembeli dilayani dalam empat langkah yang urutannya tetap. Urutan ini ditampilkan ke anak sebagai urutan langkah, dengan penanda langkah mana yang sedang dikerjakan.

1. **Sapa.** Pembeli datang dan menampilkan satu fun fact tentang dirinya. Anak menekan tombol untuk mulai melayani.
2. **Ambil buah.** Pembeli menampilkan pesanan berupa gambar buah dan angka. Anak mengambil buah dari keranjang ke kantong belanja, bisa mengeluarkannya lagi, lalu membungkus pesanan. Kalau isi kantong tidak sama dengan pesanan, game memberi tahu buah mana yang kurang atau lebih.
3. **Hitung.** Nota menampilkan harga tiap buah. Anak menentukan total belanja dari tiga pilihan.
4. **Kembalian.** Pembeli membayar dengan uang rupiah. Anak menyusun kembalian dari laci uang. Kalau uangnya pas, anak memilih "tidak perlu kembalian".

Setelah semua pembeli dalam satu level dilayani, layar hasil menampilkan skor, bintang, dan daftar tokoh yang tadi dilayani beserta fun fact-nya.

### Yang dilatih

Beranda menampilkannya sebagai bagian "Yang kamu latih", dengan ikon kecil dan bahasa anak (teksnya di `src/data/guide.js`).

| Yang dilatih | Wujudnya di game |
| --- | --- |
| Berhitung | Menjumlah dan mengalikan harga buah di langkah Hitung |
| Uang rupiah | Menghitung dan menyusun kembalian dari laci uang |
| Teliti dan runtut | Empat langkah melayani dikerjakan berurutan, pesanan dicocokkan dengan kantong |
| Kenal pahlawan | Tiap tokoh pembeli bercerita singkat (fun fact) |

### Level

| Level | Nama | Jenis buah per pesanan | Jumlah maks. per jenis | Pembeli | Total belanja | Uang pas |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Warung Kecil | 1 | 3 | 4 | langsung ditampilkan | tidak pernah |
| 2 | Warung Ramai | 2 | 3 | 5 | dipilih anak, hasil kali tiap baris dibantu | kira-kira 1 dari 5 pembeli |
| 3 | Pasar Besar | 3 | 4 | 6 | dipilih anak, tanpa bantuan | kira-kira 1 dari 5 pembeli |

Semua level bisa langsung dibuka, tanpa harus menamatkan level sebelumnya.

### Buah dan harga

| Buah | Harga per buah | Muncul mulai level |
| --- | --- | --- |
| Pisang | Rp1.000 | 1 |
| Apel | Rp2.000 | 1 |
| Mangga | Rp3.000 | 1 |
| Semangka | Rp5.000 | 2 |
| Rambutan | Rp500 | 3 |
| Jeruk | Rp1.500 | 3 |

### Uang

- Pembeli membayar dengan satu lembar uang terkecil yang lebih besar dari total (Rp2.000, Rp5.000, Rp10.000, Rp20.000, Rp50.000, atau Rp100.000), atau dengan uang pas.
- Laci uang level 1: Rp1.000, Rp2.000, Rp5.000. Level 2: ditambah Rp10.000 dan Rp20.000. Level 3: ditambah Rp500.
- Kembalian yang benar harus selalu bisa disusun dari isi laci level itu.
- Gambar uang dibuat sendiri dan sederhana (warna dan angka). Jangan meniru desain uang rupiah asli.
- Penulisan rupiah: `Rp7.000`, tanpa spasi, titik sebagai pemisah ribuan.

### Skor

- Tiap pembeli bernilai 10 poin, dikurangi 2 untuk tiap kesalahan, paling sedikit 4.
- Bintang level: 3 jika skor minimal 90% dari maksimum, 2 jika minimal 60%, selain itu 1.
- Bintang terbaik tiap level disimpan di `localStorage`. Game harus tetap jalan kalau `localStorage` tidak tersedia.
- Riwayat skor disimpan di `localStorage` (`warung-pahlawan:history`): satu entri per permainan yang selesai, paling banyak 50 entri terbaru, hanya data skor (level, skor, bintang, jumlah salah, waktu selesai). Beranda menampilkan lima permainan terakhir, halaman "Semua riwayat" menampilkan semuanya. Menghapus riwayat tidak menghapus bintang terbaik. Logikanya di `src/lib/scoreHistory.js`.

### Tokoh pembeli

Delapan tokoh, masing-masing dua fun fact. Teks fun fact dan sumbernya ada di `docs/sumber-fakta.md`. Pakai hanya fakta yang statusnya "sudah dicek".

| Tokoh | Asal | Ciri di gambar |
| --- | --- | --- |
| R.A. Kartini | Jepara, Jawa Tengah | sanggul, kebaya |
| Ir. Soekarno | Surabaya, Jawa Timur | peci hitam, jas putih |
| Mohammad Hatta | Bukittinggi, Sumatera Barat | kacamata bulat, jas |
| Ki Hajar Dewantara | Yogyakarta | peci, kacamata, kumis |
| Cut Nyak Dhien | Aceh | sanggul, selendang |
| Pangeran Diponegoro | Yogyakarta | sorban dan jubah putih |
| Jenderal Sudirman | Purbalingga, Jawa Tengah | blangkon, mantel |
| Kapitan Pattimura | Saparua, Maluku | ikat kepala merah |

Tokoh digambar sebagai ilustrasi kartun sederhana buatan sendiri, bukan foto dan bukan salinan lukisan atau gambar milik orang lain.

## 4. Urutan tugas

Satu prompt mengerjakan satu tugas. Jangan melompat ke tugas berikutnya tanpa diminta.

| No. | Tugas | Selesai jika | Status |
| --- | --- | --- | --- |
| 1 | Kerangka proyek: React, Vite, Tailwind, token desain, beranda sementara | `npm run dev` dan `npm run build` lulus; beranda terbaca di 360 px dan 1280 px | sudah (PR #1) |
| 2 | Deploy pertama ke Vercel | Tautan Vercel bisa dibuka dari HP | sudah (PR #2; https://wp.itslim.dev) |
| 3 | Data (tokoh, buah, level, uang) dan logika game sebagai fungsi murni, dengan tes | `npm test` lulus, termasuk tes bahwa kembalian selalu bisa disusun dari laci | sudah (PR #3) |
| 4 | Ilustrasi SVG: buah, uang, avatar tokoh | Semua gambar tampil rapi pada ukuran 40 px dan 160 px | sudah (PR #3; uang diperbarui di PR #7) |
| 5 | Layar main, langkah 1 dan 2 (sapa, ambil buah) | Satu pembeli bisa dilayani sampai pesanan dibungkus, dengan mouse, sentuhan, dan keyboard | sudah (PR #4) |
| 6 | Layar main, langkah 3 dan 4 (hitung, kembalian), skor | Satu level bisa dimainkan sampai habis | sudah (PR #4) |
| 7 | Beranda lengkap dan layar hasil | Alur beranda, main, hasil, lalu kembali ke beranda berjalan | sudah (PR #4) |
| 8 | Animasi, hover, dan responsivitas | Sudah dicek di 360, 768, dan 1280 px; `prefers-reduced-motion` dihormati | sudah (PR #4; tata letak HP diperbaiki di PR #5 dan PR #7) |
| 9 | Fitur tambahan (lihat bagian 5) | Disepakati per fitur | sebagian: efek suara (PR #14; diganti rekaman CC0 di prompt P25) |
| 10 | Audit: aksesibilitas, performa, SEO | Skor Lighthouse dicatat sebelum dan sesudah | sudah (PR #10; diulang di prompt P20 dengan angka sebelum dan sesudah di `docs/audit.md`) |
| 11 | Finishing: README, uji di hosting, cek gerbang kelayakan lomba | Semua butir bagian 9 terpenuhi | sebagian: README final, uji ketiga level, dan cek gerbang sudah (prompt P21); butir 3 bagian 9 belum terpenuhi sampai catatan pemilik di kelima bagian jurnal diisi |

## 5. Fitur tambahan yang direncanakan

Dikerjakan setelah tugas 1 sampai 8 selesai, sesuai waktu yang tersisa.

| Fitur | Status |
| --- | --- |
| Buku Tokoh: koleksi tokoh yang sudah pernah dilayani | rencana |
| Seret dan lepas buah (selain ketuk), suara, dan narasi fun fact | sebagian: efek suara (PR #14, diganti rekaman CC0 di prompt P25) dengan tombol Suara; seret dan lepas serta narasi fun fact masih rencana |
| Halaman untuk guru dan orang tua | rencana |

## 6. Stack

- React dan Vite versi stabil terbaru, JavaScript tanpa TypeScript
- Tailwind CSS 4 lewat plugin Vite resminya; token desain didefinisikan di `src/index.css`
- Font dimuat lokal (misalnya lewat Fontsource), tanpa permintaan ke CDN font
- Tes logika: Vitest
- Animasi pembeli dan karakter: Motion (`motion/react`), lewat `LazyMotion` dengan `domAnimation` dan komponen `m` supaya bundel awal kecil; `MotionConfig reducedMotion="user"` membungkus aplikasi
- Hosting: Vercel, deploy otomatis dari branch `main`
- Node.js versi LTS terbaru

Boleh memakai library pihak ketiga dari npm. Jangan menambah dependency tanpa menyebut alasannya ke pemilik proyek.

## 7. Struktur folder

```
AGENTS.md              docs acuan ini
README.md              cara menjalankan dan tautan penting
docs/
  img/                 screenshot untuk README
  prompt-log.md        log prompt mentah, dari awal sampai akhir
  jurnal-prompt.md     lima prompt terkurasi untuk juri
  sumber-fakta.md      teks dan sumber tiap fun fact tokoh
  audit.md             hasil audit dan optimasi (Tugas 10), sebelum dan sesudah
  kredit-aset.md       asal dan lisensi efek suara (CC0)
public/                aset statis (favicon, gambar pratinjau, robots.txt,
                       sitemap.xml, halaman 404)
  sfx/                 efek suara MP3 (daftarnya di src/lib/sfxFiles.js)
src/
  main.jsx             titik masuk, memuat font dan CSS
  App.jsx              pindah layar: beranda, main, hasil
  index.css            Tailwind, token warna dan font, animasi
  data/                isi game: tokoh, buah, uang, level
  game/                logika murni (tanpa React) dan tesnya
  lib/                 modul kecil di luar logika game, misalnya efek suara dan layar mesin kasir
  components/          potongan UI yang dipakai ulang
    scene/             latar warung di layar main dan data dekorasi tiap level
  screens/             satu berkas per layar
```

## 8. Aturan kerja untuk AI Agent

### Aturan lomba (wajib)

- Semua kode dan desain dibuat dari nol di repository ini. Jangan menyalin dari proyek lama, fork, atau template, termasuk milik pemilik proyek sendiri. Perintah pembuat proyek resmi seperti `npm create vite` boleh dipakai.
- Jangan pernah menjalankan `git push --force`, `rebase` pada commit yang sudah di-push, `commit --amend` setelah push, atau mengubah tanggal commit.
- Berkas di `docs/` tidak boleh diubah, kecuali dua hal berikut:
  - `docs/prompt-log.md`: AI Agent hanya boleh MENAMBAH entri baru di bagian paling bawah. Entri lama tidak boleh diubah, dihapus, atau dirapikan.
  - `docs/jurnal-prompt.md`: AI Agent boleh mengisinya, hanya dengan fakta yang ada di repo. Bagian "Keputusan saya", "Dugaan saya", dan "Yang saya pelajari" adalah milik pemilik proyek dan tidak diisi AI Agent.
  - `docs/kredit-aset.md`: diperbarui bersama berkas di `public/sfx/` dan `src/lib/sfxFiles.js`. Hanya rekaman berlisensi CC0.
  - `docs/img/`: screenshot untuk README, diambil dari situs yang berjalan dan dikompresi.
  - Berkas lain di `docs/`, termasuk `sumber-fakta.md`, tetap tidak boleh diubah.
- Di setiap PR, tambahkan entri untuk prompt yang sedang dikerjakan di bagian paling bawah `docs/prompt-log.md`, memakai format yang ada di berkas itu. Prompt disalin persis apa adanya, termasuk salah ketik, tanpa dirapikan atau diringkas. "Hasil AI" ditulis dari pekerjaan di PR itu. Bagian yang tidak bisa diverifikasi ditulis "(tidak dapat diverifikasi)"; jangan menebak.
- Jangan memalsukan dokumentasi prompt: jangan menulis prompt yang tidak pernah dikirim pemilik proyek, jangan mengubah urutan, dan jangan menambahkan kalimat ke dalam teks prompt.
- Di akhir tiap tugas, tuliskan ringkasan hasil: berkas yang dibuat atau diubah, perintah yang dijalankan beserta hasilnya, dan usulan pesan commit. Ringkasan ini menjadi dasar "Hasil AI" di log prompt.
- Setiap pekerjaan yang sudah berhasil (build dan tes lulus) diajukan
lewat pull request ke main. Agent tidak menggabungkan PR dan tidak
mem-push langsung ke main; pemilik proyek yang menggabungkan.

### Kode

- Logika game ditulis sebagai fungsi murni di `src/game/` dan wajib punya tes. Komponen React hanya menampilkan dan meneruskan aksi.
- Isi game (tokoh, buah, level) ada di `src/data/`, bukan ditulis langsung di komponen.
- Angka acak selalu lewat parameter supaya bisa dites dengan hasil yang tetap.
- Satu komponen satu berkas. Nama berkas komponen memakai PascalCase.
- Nama variabel dan fungsi dalam bahasa Inggris; teks yang dilihat anak dalam bahasa Indonesia.
- Sebelum menyatakan selesai: jalankan `npm test` dan `npm run build`, dan laporkan hasilnya apa adanya. Kalau ada yang gagal atau belum sempat dicek, katakan.

### Bahasa dan isi

- Kalimat pendek, kata sehari-hari, sapaan "kamu". Tokoh berbicara dengan "aku".
- Tombol menyebut hasilnya: "Bungkus pesanan", bukan "Kirim".
- Pesan salah menjelaskan apa yang kurang dan apa yang harus dilakukan, tanpa menyalahkan.
- Jangan mengarang fun fact. Pakai hanya teks dari `docs/sumber-fakta.md`.
- Tokoh digambarkan dengan hormat. Tidak ada lelucon tentang tokoh.

### Desain

Dunia visualnya warung buah di pasar: terpal bergaris biru dan jingga, papan nama dicat tangan, ilustrasi bergaris tepi tebal seperti stiker.

| Token | Nilai | Dipakai untuk |
| --- | --- | --- |
| `terpal` | `#1D5BBF` | terpal, papan nama, tombol kedua |
| `terpal-tua` | `#143F8A` | papan informasi |
| `jingga` | `#F47B20` | garis terpal, aksen |
| `pisang` | `#FFD23F` | tombol utama, langkah aktif |
| `kapur` | `#FFFDF5` | permukaan panel dan balon bicara |
| `langit` | `#DCEBFF` | latar halaman |
| `tinta` | `#17233F` | teks dan garis tepi |
| `daun` | `#1F8A4C` | benar, langkah selesai |
| `cabai` | `#D93636` | salah |
| `kayu` | `#B9793F` | meja warung |

- Font judul: Lilita One. Font teks: Atkinson Hyperlegible, dipilih karena angka dan hurufnya mudah dibedakan pembaca pemula.
- Terpal bergaris adalah satu-satunya elemen yang ramai. Bagian lain dibuat tenang.
- Jangan pakai: gradien ungu, kartu abu-abu berbayang lembut, label huruf kapital semua, emoji sebagai ilustrasi utama.
- Teks putih di atas `jingga` tidak cukup kontras. Di atas `jingga` dan `pisang` pakai `tinta`.
- Animasi hanya untuk menjawab aksi anak (buah masuk kantong, pembeli datang, jawaban salah). Hormati `prefers-reduced-motion`.
- Pengecualian: karakter pembeli boleh punya gerak diam yang berulang (napas pelan, kedip, rambut bergoyang halus). Gerak ini kecil dan pelan, berhenti saat tab tidak aktif, dan tidak ada saat `prefers-reduced-motion` aktif.

### Aksesibilitas

- Target sentuh minimal 48 × 48 px.
- Semua aksi bisa dilakukan dengan keyboard, dan fokus terlihat jelas.
- Benar dan salah tidak dibedakan dengan warna saja; selalu ada teks.
- Umpan balik diumumkan lewat `aria-live`.
- Kontras teks minimal WCAG AA.

### Performa dan SEO

- Ilustrasi berupa SVG, tanpa gambar raster berat. Kalau ada gambar raster, kompres dan beri `loading="lazy"`.
- Hanya memuat bobot font yang dipakai.
- Layar yang bukan inti dimuat dengan `React.lazy`.
- `index.html` punya `lang="id"`, judul, deskripsi, dan tag Open Graph.

### Commit

Format Conventional Commits, satu perubahan satu commit:

```
feat: add change-making step
fix: prevent negative fruit count in bag
docs: log prompt for task 3
style: tune awning stripes on mobile
test: cover exact-payment case
```

## 9. Gerbang kelayakan lomba

Keenam butir ini wajib terpenuhi saat pengumpulan. Satu saja tidak terpenuhi, karya tidak dinilai.

1. Docs acuan AI Agent ada (dokumen ini).
2. Repository GitHub bersifat public.
3. Jurnal prompt terkurasi (5 prompt) dan log prompt mentah dari awal sampai akhir ada.
4. Stack bebas (terpenuhi).
5. Website sesuai tema dan subtema.
6. Karya sudah di-deploy dan bisa dibuka juri.

## 10. Pembagian peran AI

| Alat AI | Dipakai untuk | Contoh hasil |
| --- | --- | --- |
| Claude (claude.ai) | Menyusun dokumen acuan, menulis prompt untuk agen coding, dan menguji situs yang sudah tayang | Versi pertama `AGENTS.md` (commit `6f11e03`); prompt P1 sampai P28 di `docs/prompt-log.md`; daftar temuan uji situs di prompt P8 dan P23 |
| Claude Code (Anthropic) | Menulis kode, tes, dan PR | Commit dengan author `Claude <noreply@anthropic.com>` dan PR #1 sampai #26, misalnya logika game beserta tesnya di `src/game/` (PR #3) |

Semua prompt ke agen coding dicatat apa adanya di docs/prompt-log.md.
