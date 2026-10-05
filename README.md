# Warung Pahlawan

Game web untuk anak SD. Anak menjadi penjaga warung buah, dan pembelinya adalah tokoh sejarah Indonesia. Sambil melayani pembeli, anak berlatih berpikir runtut seperti programmer dan mengenal para pahlawan.

Dibuat untuk M-ONE Telkomsel Coding Competition 2026, Kategori Umum, tema "Innovating Education Through Technology", subtema Web Education for Kids.

Situs: https://wp.itslim.dev

## Status pengembangan

Proyek ini masih di tahap awal. Yang sudah ada baru kerangka proyek dan beranda sementara berisi judul serta satu kalimat penjelasan. Game belum bisa dimainkan.

Rencana dan urutan pengerjaan ada di [AGENTS.md](AGENTS.md), bagian 4.

## Dokumen

- [AGENTS.md](AGENTS.md): docs acuan untuk AI Agent, berisi tujuan, alur game, aturan kerja, dan desain.
- [docs/jurnal-prompt.md](docs/jurnal-prompt.md): lima prompt terkurasi untuk juri.
- [docs/prompt-log.md](docs/prompt-log.md): log prompt mentah dari awal sampai akhir.

## Menjalankan di komputer sendiri

Butuh Node.js 24. Versinya juga tertulis di `.nvmrc`, jadi kalau memakai nvm cukup jalankan `nvm use`.

```bash
npm install      # pasang dependency
npm run dev      # jalankan server pengembangan, lalu buka alamat yang muncul
npm run build    # buat versi siap deploy di folder dist
```

## Stack

- React dan Vite, JavaScript tanpa TypeScript
- Tailwind CSS 4 lewat plugin Vite resminya; token warna dan font ada di `src/index.css`
- Font Lilita One dan Atkinson Hyperlegible, dimuat lokal lewat Fontsource
- Hosting di Vercel, deploy otomatis dari branch `main`
