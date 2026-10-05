# Warung Pahlawan

Game web untuk anak SD. Anak menjadi penjaga warung buah, dan pembelinya adalah tokoh sejarah Indonesia. Sambil melayani pembeli, anak berlatih berpikir runtut seperti programmer (urutan, perulangan, percabangan, variabel), berhitung uang dan kembalian, serta mengenal para pahlawan.

Dibuat untuk M-ONE Telkomsel Coding Competition 2026, Kategori Umum, tema "Innovating Education Through Technology", subtema Web Education for Kids.

Situs: https://wp.itslim.dev

## Yang bisa dimainkan

- **Tiga level warung.** Warung Kecil (4 pembeli, 1 jenis buah, total sudah dihitung di nota), Warung Ramai (5 pembeli, 2 jenis buah, hasil kali tiap baris dibantu), dan Pasar Besar (6 pembeli, 3 jenis buah, tanpa bantuan). Semua level bisa langsung dipilih dari beranda.
- **Empat langkah melayani satu pembeli,** dengan penanda urutan langkah:
  1. Sapa: tokoh datang dan membagikan satu fun fact.
  2. Ambil buah: ketuk buah di keranjang, keluarkan lagi kalau kelebihan, lalu bungkus. Kalau belum pas, game menyebut buah yang kurang atau lebih.
  3. Hitung: pilih total belanja dari tiga pilihan.
  4. Kembalian: susun kembalian dari laci uang, atau pilih "Tidak perlu kembalian" kalau uangnya pas.
- **Delapan tokoh pembeli** (R.A. Kartini, Ir. Soekarno, Mohammad Hatta, Ki Hajar Dewantara, Cut Nyak Dhien, Pangeran Diponegoro, Jenderal Sudirman, Kapitan Pattimura), masing-masing dengan dua fun fact dari [docs/sumber-fakta.md](docs/sumber-fakta.md).
- **Skor dan bintang.** Tiap pembeli bernilai 10 poin, dikurangi 2 untuk tiap kesalahan (paling sedikit 4). Bintang terbaik tiap level disimpan di browser; game tetap jalan kalau penyimpanan browser tidak tersedia.
- **Layar hasil:** skor, bintang, dan daftar tokoh yang dilayani beserta fun fact-nya.
- **Mode Susun Langkah:** latihan menyusun empat langkah melayani pembeli dalam urutan yang benar, dengan penjelasan konsep urutan (sequence).
- **Beranda** menjelaskan cara main dan hubungan game dengan konsep coding dalam bahasa anak.
- **Bisa dipakai dengan sentuhan, mouse, dan keyboard.** Umpan balik selalu berupa teks dan diumumkan untuk pembaca layar, target sentuh minimal 48 px, dan animasi mengikuti pengaturan "kurangi gerakan". Di HP, tiap langkah muat dalam satu layar dengan tombol aksi selalu terlihat di bawah.
- Semua ilustrasi (buah, uang, tokoh) adalah SVG buatan sendiri. Desain uang tidak meniru uang rupiah asli.

## Menjalankan di komputer sendiri

Butuh Node.js 24. Versinya juga tertulis di `.nvmrc`, jadi kalau memakai nvm cukup jalankan `nvm use`.

```bash
npm install      # pasang dependency
npm run dev      # jalankan server pengembangan, lalu buka alamat yang muncul
npm test         # jalankan tes logika game (Vitest)
npm run lint     # periksa kode (oxlint)
npm run build    # buat versi siap deploy di folder dist
npm run preview  # coba hasil build di komputer sendiri
```

## Stack

- React dan Vite, JavaScript tanpa TypeScript
- Tailwind CSS 4 lewat plugin Vite resminya; token warna dan font ada di `src/index.css`
- Font Lilita One dan Atkinson Hyperlegible, dimuat lokal lewat Fontsource
- Motion untuk animasi pembeli dan karakter (dimuat ringan lewat `LazyMotion`)
- Vitest untuk tes logika game; oxlint untuk pemeriksaan kode
- Hosting di Vercel, deploy otomatis dari branch `main`

## Struktur singkat

- `src/data/`: isi game (tokoh, buah, uang, level, teks panduan, kartu Susun Langkah)
- `src/game/`: logika game sebagai fungsi murni beserta tesnya
- `src/components/` dan `src/screens/`: tampilan
- Penjelasan lengkap ada di [AGENTS.md](AGENTS.md), bagian 7.

## Status pengembangan

Tugas 1 sampai 8 selesai, Tugas 9 baru satu fitur (Susun Langkah), dan Tugas 10 (audit aksesibilitas, performa, dan SEO) sudah dikerjakan di PR #10. Status lengkap tiap tugas ada di [AGENTS.md](AGENTS.md), bagian 4 dan 5.

Keterbatasan yang diketahui: di layar sangat kecil (320×568), beberapa langkah perlu digeser di dalam area kerja; tanda "Geser ke bawah" baru ada di layar main, belum di mode Susun Langkah.

## Dokumen

- [AGENTS.md](AGENTS.md): docs acuan untuk AI Agent, berisi tujuan, alur game, aturan kerja, desain, dan status tugas.
- [docs/jurnal-prompt.md](docs/jurnal-prompt.md): lima prompt terkurasi untuk juri.
- [docs/prompt-log.md](docs/prompt-log.md): log prompt mentah dari awal sampai akhir.
- [docs/sumber-fakta.md](docs/sumber-fakta.md): teks dan sumber tiap fun fact tokoh.
