# Kredit aset

Semua rekaman efek suara Warung Pahlawan berlisensi CC0 1.0 (domain publik, [Creative Commons Zero](https://creativecommons.org/publicdomain/zero/1.0/)). Kredit tidak wajib, tetapi dicatat di sini sebagai terima kasih kepada para pembuatnya. Ilustrasi (buah, uang, tokoh, latar, mesin kasir) dan kode dibuat sendiri di repository ini.

Daftar yang sama dipakai oleh kode (`src/lib/sfxFiles.js`) dan halaman uji tersembunyi `/?sfx`, tempat setiap bunyi bisa diputar.

## Efek suara

| Berkas | Dipakai untuk | Judul asli | Pembuat | Sumber | Lisensi | Hasil olahan |
| --- | --- | --- | --- | --- | --- | --- |
| `public/sfx/pintu-gulung.mp3` | Pintu gulung naik saat warung dibuka | Rolling shutter (potongan 0,4 sampai 1,14 detik, frekuensi tinggi disaring) | Areti18 | [Freesound](https://freesound.org/people/Areti18/sounds/394947/) | CC0 1.0 | 0,78 s, 9,5 kB |
| `public/sfx/lonceng-pintu.mp3` | Lonceng pintu saat pembeli datang | Ryuuzan_shop_door_bell00.wav | ryuuzan | [Freesound](https://freesound.org/people/ryuuzan/sounds/192761/) | CC0 1.0 | 0,97 s, 11,7 kB |
| `public/sfx/langkah-1.mp3` | Langkah kaki (1) | footstep00.ogg | Kenney (kenney.nl) | [Kenney, paket RPG Audio](https://kenney.nl/assets/rpg-audio) | CC0 1.0 | 0,26 s, 3,4 kB |
| `public/sfx/langkah-2.mp3` | Langkah kaki (2) | footstep01.ogg | Kenney (kenney.nl) | [Kenney, paket RPG Audio](https://kenney.nl/assets/rpg-audio) | CC0 1.0 | 0,29 s, 3,7 kB |
| `public/sfx/buah-masuk.mp3` | Buah masuk kantong | impactSoft_medium_001.ogg | Kenney (kenney.nl) | [Kenney, paket Impact Sounds](https://kenney.nl/assets/impact-sounds) | CC0 1.0 | 0,21 s, 2,8 kB |
| `public/sfx/buah-keluar.mp3` | Buah dikeluarkan dari kantong | cloth2.ogg | Kenney (kenney.nl) | [Kenney, paket RPG Audio](https://kenney.nl/assets/rpg-audio) | CC0 1.0 | 0,39 s, 4,9 kB |
| `public/sfx/bungkus.mp3` | Pesanan dibungkus | cards-pack-open-2.ogg | Kenney (kenney.nl) | [Kenney, paket Casino Audio](https://kenney.nl/assets/casino-audio) | CC0 1.0 | 0,78 s, 9,5 kB |
| `public/sfx/tombol-kasir.mp3` | Tombol mesin kasir | click_005.ogg dan click_003.ogg, disusun tujuh ketukan | Kenney (kenney.nl) | [Kenney, paket Interface Sounds](https://kenney.nl/assets/interface-sounds) | CC0 1.0 | 0,78 s, 9,5 kB |
| `public/sfx/laci-kasir.mp3` | Laci mesin kasir terbuka ("ka-ching") | Cash Register Fake.wav | CapsLok | [Freesound](https://freesound.org/people/CapsLok/sounds/184438/) | CC0 1.0 | 1,41 s, 16,9 kB |
| `public/sfx/uang-kertas.mp3` | Uang kertas ke nampan kembalian | card-slide-2.ogg | Kenney (kenney.nl) | [Kenney, paket Casino Audio](https://kenney.nl/assets/casino-audio) | CC0 1.0 | 0,63 s, 7,7 kB |
| `public/sfx/koin.mp3` | Koin ke nampan kembalian | handleCoins2.ogg | Kenney (kenney.nl) | [Kenney, paket RPG Audio](https://kenney.nl/assets/rpg-audio) | CC0 1.0 | 0,37 s, 4,6 kB |
| `public/sfx/salah.mp3` | Jawaban salah (lembut) | bong_001.ogg | Kenney (kenney.nl) | [Kenney, paket Interface Sounds](https://kenney.nl/assets/interface-sounds) | CC0 1.0 | 0,16 s, 2,2 kB |
| `public/sfx/klik.mp3` | Tombol ditekan | click_002.ogg | Kenney (kenney.nl) | [Kenney, paket Interface Sounds](https://kenney.nl/assets/interface-sounds) | CC0 1.0 | 0,05 s, 1,0 kB |

Total 13 berkas, 87,5 kB.

## Bunyi buatan sendiri

Bunyi jawaban benar dan fanfare di layar hasil tidak memakai berkas. Keduanya dibuat sendiri di repository ini lewat Web Audio API (osilator), melodinya ada di `src/lib/sfxTunes.js`:

- Jawaban benar: do-mi-sol-do tinggi yang naik cepat, sekitar 0,5 detik.
- Fanfare: arpeggio naik lalu akor do mayor, 1,1 sampai 1,35 detik. Untuk 3 bintang ditambah lapisan dentingan naik; untuk 1 bintang suaranya lebih hangat, tetap naik dan berakhir di akor mayor.

Keduanya menggantikan rekaman sebelumnya (`benar.mp3` dari confirmation_001.ogg dan `fanfare.mp3` dari jingles_PIZZI01.ogg, Kenney). Melodi fanfare lama turun (A#4, G#4, F#4, E4, D4, C4) dan terdengar sedih.

## Paket dan halaman sumber

- Kenney, [RPG Audio](https://kenney.nl/assets/rpg-audio), [Interface Sounds](https://kenney.nl/assets/interface-sounds), [Casino Audio](https://kenney.nl/assets/casino-audio), dan [Impact Sounds](https://kenney.nl/assets/impact-sounds). Berkas `License.txt` di tiap paket: "License (Creative Commons Zero, CC0)".
- Freesound, tiap halaman bunyi berlabel "Creative Commons 0":
  - [Rolling shutter](https://freesound.org/people/Areti18/sounds/394947/) oleh Areti18 ("Rolling shutters up and opening").
  - [Ryuuzan_shop_door_bell00.wav](https://freesound.org/people/ryuuzan/sounds/192761/) oleh ryuuzan (menurut pembuatnya diolah dari lonceng lain yang juga CC0).
  - [Cash Register Fake.wav](https://freesound.org/people/CapsLok/sounds/184438/) oleh CapsLok (rekaman sendiri: printer, kotak berisi barang, ratchet, dan lonceng kecil).
- Dari Freesound diambil berkas pratinjau berkualitas tinggi (MP3 128 kbps) yang tersedia tanpa akun.
- Sengaja tidak dipakai: [Cash Register Purchase](https://freesound.org/people/Zott820/sounds/209578/) oleh Zott820. Berkas itu sendiri CC0, tetapi menurut deskripsinya memakai bunyi lain berlisensi CC BY 4.0.

## Pengolahan

Setiap berkas diolah dari rekaman aslinya dengan ffmpeg dan skrip kecil (tidak ikut repository):

1. Untuk pintu gulung, diambil potongan 0,4 sampai 1,14 detik dari rekaman aslinya (bagian saat pintu naik). Frekuensi di atas sekitar 4 kHz disaring supaya tidak tajam, lalu diberi fade in 40 ms dan fade out 150 ms. Panjangnya 0,78 detik termasuk padding MP3.
2. Untuk tombol mesin kasir, dua klik dari Interface Sounds (`click_005.ogg` dan `click_003.ogg`) disusun menjadi tujuh ketukan, 0,12 detik sekali.
3. Dijadikan mono 44,1 kHz. Hening di awal dan akhir (di bawah -45 dB dari puncak) dipotong, lalu diberi fade-out pendek.
4. Kekerasan disamakan: -20 LUFS (BS.1770, diukur sepanjang bunyi karena banyak bunyi lebih pendek dari 400 ms), true peak paling tinggi -3 dB. Bunyi berpuncak tajam diredam dengan limiter sederhana (paling banyak 16 dB). Tombol mesin kasir dan uang kertas tetap sekitar -25,5 LUFS karena puncaknya sangat tajam; selisihnya diimbangi di `src/lib/sfxGain.js`.
5. Disimpan sebagai MP3 mono 96 kbps (bisa diputar di Safari iPhone), paling panjang 1,5 detik dan 30 kB per berkas.

Volume tiap bunyi di game diatur di `src/lib/sfxGain.js`, dan kekerasan tiap bunyi bisa dilihat di halaman `/?sfx`.
