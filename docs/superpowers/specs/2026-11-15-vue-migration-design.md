# Desain: Migrasi Aplikasi Bahan Ajar UT ke Vue 3 + Vite

Tanggal: 2026-11-15

## Tujuan dan alasan
Repo ini berjudul "tugas2-vue-ut", tetapi baru 2 dari 7 halaman yang memakai Vue (CDN). Sisanya JavaScript biasa di dalam HTML, dan sidebar, konfigurasi Tailwind, serta logika login/tema disalin ke tiap halaman. Pemilik ingin repo yang rapi, fokus ke Vue, dan tetap bisa diakses lewat GitHub Pages.

## Tujuan / Bukan tujuan
- Tujuan: seluruh aplikasi menjadi satu proyek Vue 3; tampilan dan fitur sama seperti sekarang; deploy ke GitHub Pages tetap jalan.
- Bukan tujuan: database atau backend (cukup untuk demo tugas kuliah, data tetap di `localStorage`); mengubah desain visual; menambah fitur baru.
- Anti-tujuan: web tidak bisa dibuka di Pages setelah migrasi; data demo awal hilang atau berbeda.

## Batasan
- Hosting statis GitHub Pages.
- Nama repo akan diganti nanti (belum ditentukan), jadi build tidak boleh bergantung pada nama repo.

## Pendekatan yang dipertimbangkan
- **A. Vue 3 + Vite + vue-router (dipilih pemilik).** Paling rapi, Tailwind jadi paket, komponen bersama.
- B. Vue CDN satu `index.html` tanpa build: lebih sederhana tetapi tetap "setengah Vue".
- C. Tetap 7 halaman, semuanya Vue: duplikasi sidebar dan konfigurasi tetap ada.

## Rancangan (keputusan pemilik: pendekatan A; sisanya adalah pilihan saya)
- Struktur: `src/` berisi `main.js`, `App.vue`, `router.js`, `components/` (Sidebar, kerangka halaman, tombol tema), `views/` (Login, Dashboard, Pesanan, Stok, Tracking, Laporan, Histori), `stores/` (data bersama), `assets/` (gambar, logo).
- Routing: `vue-router` dengan `createWebHashHistory` (URL `/#/dashboard`) agar jalan di Pages tanpa konfigurasi server dan tanpa bergantung nama repo. Guard login menggantikan pengecekan `localStorage` di tiap halaman. Menu Laporan dan Histori hanya untuk peran admin, seperti sekarang.
- Data: satu store bersama (Pinia) yang membaca dan menulis `localStorage`. Kunci `ut_stocks` dan `ut_vue_stocks` disatukan sehingga stok, pesanan, dan dashboard memakai data yang sama. Data awal (UPBJJ, paket, stok, pesanan) dipindahkan dari `js/dataBahanAjar.js` ke modul data terpisah dan hasilnya sama.
- Gaya: Tailwind terpasang sebagai paket (bukan CDN). Satu `tailwind.config`. `css/style.css` dipindah ke `src/`.
- Build dan deploy: Vite dengan `base: './'`. Workflow GitHub Actions membangun dan men-deploy `dist` ke Pages. Pemilik mengubah sekali: Settings → Pages → Source → GitHub Actions.
- Hasil: halaman lama (`*.html`, `js/`, `css/`) dihapus setelah semua halaman baru terverifikasi sama perilakunya.

## Diserahkan ke pembangun
Detail komponen, nama store, urutan pengerjaan halaman, dan penyesuaian kecil pada gaya.

## Hal yang belum diputuskan
- Nama baru repo (ditunda oleh pemilik; tidak memblokir pekerjaan).
- Cara menyerahkan hasil: karena akses saya ke repo hanya baca, hasilnya perlu diserahkan sebagai file, atau pemilik memberi akses tulis agar bisa langsung di-push ke branch terpisah.
