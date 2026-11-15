# Migrasi Vue 3 + Vite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengubah aplikasi bahan ajar UT (7 halaman HTML) menjadi satu proyek Vue 3 + Vite dengan tampilan dan fitur yang sama, siap di-deploy ke GitHub Pages.

**Architecture:** SPA dengan `vue-router` (hash history), komponen cangkang bersama (sidebar, topbar, toast), dan store Pinia yang membungkus `localStorage`. Satu model stok dan satu model pesanan dipakai bersama semua halaman. Kode lama dipindah ke `legacy/` sebagai acuan perilaku dan dihapus di task terakhir.

**Tech Stack:** Vue 3, Vite, vue-router 4, Pinia, Tailwind CSS (paket, bukan CDN), Vitest + @vue/test-utils + jsdom, Node 20+.

**Spec:** `docs/superpowers/specs/2026-11-15-vue-migration-design.md`

## Global Constraints

- Router memakai `createWebHashHistory` (URL `/#/dashboard`); Vite `base: './'`. Tidak boleh ada path yang bergantung pada nama repo.
- Data tetap di `localStorage`; tanpa backend/database.
- Tampilan, teks, dan fitur sama dengan versi lama; tidak ada fitur baru.
- Peran admin = `Admin`, `UPBJJ-UT`, `Puslaba`, `Fakultas`, `Administrator`. Saat login, `Administrator` disimpan sebagai `Admin`. Menu Laporan dan Histori hanya untuk peran admin.
- Data awal (UPBJJ, paket, stok, pengguna, pesanan) hasilnya sama dengan `legacy/js/dataBahanAjar.js`.
- Satu model stok: field `kode, judul, Kategori, upbjj, lokasiRak, qty, safety, harga, catatanHTML, foto`. Kunci `localStorage` tunggal: `ut_stocks`. Kunci lama `ut_vue_stocks` tidak dipakai lagi.
- Deploy lewat GitHub Actions ke Pages (pemilik mengubah Settings → Pages → Source → GitHub Actions sekali).
- Gambar ada di `public/assets/` dan dirujuk lewat `assetUrl(path)` (memakai `import.meta.env.BASE_URL`), tidak pernah lewat path absolut `/assets/...`.

## Review Focus

- JSON `localStorage` rusak/kosong: aplikasi kembali ke data awal, tidak blank. (Task 2)
- Mahasiswa mengetik `#/laporan` atau `#/histori` langsung: dialihkan ke `/dashboard`. (Task 6)
- Pengguna belum login membuka rute mana pun: dialihkan ke `/login`; sudah login membuka `/login`: ke `/dashboard`. (Task 6)
- Konfirmasi pesanan dengan qty melebihi stok: ditolak dengan pesan dan stok tidak berubah; modul tanpa entri stok (kode paket `PKT-xx`) tetap bisa dikonfirmasi tanpa mengurangi stok, seperti versi lama. (Task 4)
- Tambah stok dengan kode yang sudah ada (tanpa memperhatikan huruf besar/kecil): ditolak. (Task 3)
- Muat ulang halaman di rute dalam (`/#/stok`) dan gambar tampil di subfolder Pages: tidak ada gambar rusak. (Task 1, 10)

---

## File Structure

- `index.html`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `package.json` — kerangka Vite
- `public/assets/` — gambar (pindahan dari `assets/`)
- `legacy/` — HTML/JS/CSS lama (sementara)
- `src/main.js`, `src/App.vue`, `src/router.js`
- `src/data/seed.js` — data awal; `src/lib/storage.js` — baca/tulis `localStorage` aman; `src/lib/assetUrl.js`
- `src/stores/` — `auth.js`, `theme.js`, `stocks.js`, `orders.js`, `reports.js`, `notify.js`
- `src/components/` — `AppShell.vue`, `Sidebar.vue`, `Topbar.vue`, `ToastHost.vue`, `StatusBadge.vue`
- `src/views/` — `LoginView, DashboardView, PesananView, StokView, TrackingView, LaporanView, HistoriView`
- `tests/` — cerminan `src/` (stores, router, smoke tiap view)
- `.github/workflows/deploy.yml`, `README.md`

---

### Task 1: Kerangka proyek dan pemindahan kode lama

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.js`, `src/App.vue`, `src/style.css`, `src/lib/assetUrl.js`, `tests/lib/assetUrl.test.js`, `.gitignore`
- Move: `*.html`, `js/`, `css/` → `legacy/`; `assets/` → `public/assets/` (`git mv`)

**Interfaces:**
- Produces: `assetUrl(path: string): string` — mengubah `"/assets/x.jpg"` atau `"assets/x.jpg"` menjadi `BASE_URL + "assets/x.jpg"`; URL `http(s)://` dikembalikan apa adanya.

- [ ] **Step 1:** `git mv` file lama ke `legacy/` dan `assets/` ke `public/assets/`. Salin `tailwind.config` dari blok `tailwind.config` di `legacy/index.html` (warna `primary`, `accent`, font Public Sans/Lexend, `darkMode: 'class'`) ke `tailwind.config.js`; pindahkan `legacy/css/style.css` ke `src/style.css`.
- [ ] **Step 2:** Tulis test `assetUrl`: `assetUrl('/assets/logo_ut.png')` berakhir `assets/logo_ut.png` tanpa `//` ganda; `assetUrl('https://images.unsplash.com/x')` sama persis dengan masukan. Jalankan `npx vitest run tests/lib/assetUrl.test.js` → FAIL.
- [ ] **Step 3:** Implementasi `assetUrl` di `src/lib/assetUrl.js`. Jalankan test → PASS.
- [ ] **Step 4:** Atur `vite.config.js` (`base: './'`, plugin Vue, `test.environment: 'jsdom'`), muat font Google dan Material Symbols di `index.html`, mount `App.vue` (berisi `<RouterView/>` kosong dulu) di `src/main.js`.
- [ ] **Step 5:** Verifikasi: `npm run build` sukses; `npm run preview` menampilkan halaman kosong tanpa error konsol.
- [ ] **Step 6:** Commit `chore: scaffold vue vite project, move legacy code`.

### Task 2: Data awal, util storage, store auth/tema/notifikasi

**Files:**
- Create: `src/data/seed.js`, `src/lib/storage.js`, `src/stores/auth.js`, `src/stores/theme.js`, `src/stores/notify.js`
- Test: `tests/lib/storage.test.js`, `tests/stores/auth.test.js`, `tests/stores/theme.test.js`

**Interfaces:**
- Produces:
  - `seed.js` mengekspor `upbjjList`, `paket`, `initialStocks` (7 item, model stok di Global Constraints), `dataPengguna`, `initialOrders` (hasil pemetaan `dataTracking` seperti `initGlobalData` lama), `ADMIN_ROLES: string[]`.
  - `storage.js`: `load<T>(key: string, fallback: T): T` (JSON rusak/kosong → `fallback`), `save(key: string, value: unknown): void`.
  - `useAuthStore`: state `user: {nama, role, lokasi, nim} | null`; `login(email, password): boolean`; `logout(): void`; getter `isLoggedIn`, `isAdmin`. Kunci `localStorage`: `userName, userRole, userLocation, userNim` (sama dengan versi lama).
  - `useThemeStore`: `isDark`, `toggle()`, `init()`; kunci `theme`; menambah/menghapus kelas `dark` di `<html>`.
  - `useNotifyStore`: `toast(message: string)`, state `message`, `visible` (hilang setelah 3 detik).

- [ ] **Step 1:** Tulis test: `load('x', [])` mengembalikan `[]` bila nilainya `"{bad"`; `login('admin@ut.ac.id','admin123')` → `true` dan `user.role === 'Admin'`; password salah → `false`; `login('mahasiswa@ut.ac.id','mahasiswa123')` → `isAdmin === false`; `toggle()` menyimpan `theme` ke `localStorage`. Jalankan → FAIL.
- [ ] **Step 2:** Pindahkan data dari `legacy/js/dataBahanAjar.js` ke `seed.js` (nilai identik) dan implementasikan `storage.js` dan ketiga store. Jalankan test → PASS.
- [ ] **Step 3:** Commit `feat: seed data, storage util, auth/theme/notify stores`.

### Task 3: Store stok

**Files:**
- Create: `src/stores/stocks.js`; Test: `tests/stores/stocks.test.js`

**Interfaces:**
- Consumes: `load/save`, `initialStocks`.
- Produces: `useStocksStore` — state `items: Stock[]` (disimpan otomatis ke `ut_stocks`); `add(stock): {ok: boolean, errors?: Record<string,string>}` (validasi: kode wajib, unik tanpa memperhatikan huruf besar/kecil, qty/safety/harga ≥ 0); `update(kode, patch)`; `remove(kode)`; `decrement(kode, qty): boolean` (false bila kode ada tetapi stok kurang; true bila berhasil atau kode tidak ada); getter `lowStock`, `empty`, `totalUnits`; `statusOf(item): 'aman'|'menipis'|'kosong'` (kosong bila `qty === 0`, menipis bila `qty < safety`).

- [ ] **Step 1:** Tulis test: `add` dengan kode `asip4301` (sudah ada `ASIP4301`) → `ok:false`; `decrement('BIOL4211', 1)` → `false` karena qty 0 dan qty tetap 0; `decrement('PKT-01', 1)` → `true` tanpa mengubah apa pun; `statusOf` sesuai tiga aturan di atas dengan data awal (`EKMA4310` menipis, `BIOL4211` kosong). → FAIL.
- [ ] **Step 2:** Implementasi dengan `watch` mendalam yang memanggil `save('ut_stocks', items)`; aturan validasi diambil dari `validateNewStock` di `legacy/js/stok-app.js`. → PASS.
- [ ] **Step 3:** Commit `feat: stocks store`.

### Task 4: Store pesanan

**Files:**
- Create: `src/stores/orders.js`; Test: `tests/stores/orders.test.js`

**Interfaces:**
- Consumes: `useStocksStore.decrement`, `initialOrders`, `paket`.
- Produces: `useOrdersStore` — state `items: Order[]` (kunci `ut_orders`); `generateDoNumber(): string` (aturan sama dengan `generateAutoDONumber` di `legacy/js/tracking-app.js`); `create(input): Order`; `setStatus(id, status): {ok: boolean, message?: string}`; `remove(id)`; `byStudent(nama)`; `findByDo(doNum)` (tanpa memperhatikan huruf besar/kecil); `STATUS_FLOW` = `Pending Approval → Confirmed → In Transit → Delivered → Finished`, plus `Rejected` dari `Pending Approval`.

- [ ] **Step 1:** Tulis test: `setStatus` ke `Confirmed` untuk pesanan modul `EKMA4310` qty 30 (stok 25) → `{ok:false}` dan stok tetap 25; qty 5 → stok jadi 20; pesanan modul `PKT-01` → ok tanpa mengubah stok; `findByDo('do2026-001')` menemukan pesanan; `generateDoNumber()` tidak bentrok dengan nomor yang ada. → FAIL.
- [ ] **Step 2:** Implementasi; logika pesan gagal `Gagal! Stok <kode> tidak mencukupi.` dari `legacy/pesanan.html`. → PASS.
- [ ] **Step 3:** Commit `feat: orders store`.

### Task 5: Store laporan masalah

**Files:**
- Create: `src/stores/reports.js`; Test: `tests/stores/reports.test.js`

**Interfaces:**
- Produces: `useReportsStore` — `items: Report[]` (kunci `ut_reports`, awal `[]`); `add({doNum, category, description, studentName}): Report` (id `REP-` + 4 digit, status `New`, tanggal ISO, ditaruh paling depan); `setStatus(id, status)`; `remove(id)`.

- [ ] **Step 1:** Test: `add` menaruh laporan baru di indeks 0 dengan status `New` dan id berpola `/^REP-\d{4}$/`; `remove` menghapus. → FAIL → implementasi → PASS.
- [ ] **Step 2:** Commit `feat: reports store`.

### Task 6: Router, guard, dan cangkang aplikasi

**Files:**
- Create: `src/router.js`, `src/components/AppShell.vue`, `Sidebar.vue`, `Topbar.vue`, `ToastHost.vue`, `StatusBadge.vue`; Modify: `src/App.vue`, `src/main.js`; Test: `tests/router.test.js`, `tests/components/Sidebar.test.js`

**Interfaces:**
- Consumes: `useAuthStore`, `useThemeStore`, `useNotifyStore`.
- Produces: rute `/login` (name `login`), `/dashboard`, `/pesanan`, `/stok`, `/tracking`, `/laporan`, `/histori`; `meta.adminOnly` pada `laporan` dan `histori`; `/` → `/dashboard`; rute tak dikenal → `/dashboard`. `AppShell` membungkus semua rute kecuali login dan berisi `<RouterView/>`. `Sidebar` menyembunyikan tautan Laporan/Histori bila bukan admin, tombol keluar memanggil `logout()` lalu ke `/login`.

- [ ] **Step 1:** Tulis test router: belum login ke `/stok` → berakhir di `/login`; mahasiswa ke `/laporan` → `/dashboard`; admin ke `/laporan` → tetap; sudah login ke `/login` → `/dashboard`. Test Sidebar: tautan `Laporan` tidak ada untuk mahasiswa. → FAIL.
- [ ] **Step 2:** Implementasi router dengan `beforeEach` guard dan komponen cangkang; markup/gaya sidebar, topbar (tanggal, salam, notifikasi, tombol tema), dan toast disalin dari `legacy/dashboard.html`. → PASS.
- [ ] **Step 3:** Commit `feat: router, guards, app shell`.

### Task 7: Halaman Login dan Dashboard

**Files:**
- Create: `src/views/LoginView.vue`, `src/views/DashboardView.vue`; Test: `tests/views/login-dashboard.test.js`

**Interfaces:**
- Consumes: semua store; `StatusBadge`.

- [ ] **Step 1:** Test: login dengan akun salah memunculkan toast `Email atau Password salah!` dan tetap di `/login`; akun benar → `/dashboard`. Dashboard admin menampilkan 4 statistik (total pesanan, `Pending Approval`, `In Transit`, laporan) dengan angka dari store; mahasiswa tidak melihat kartu stok dan hanya melihat pesanannya; pencarian DO yang tidak ada → toast `Nomor DO tidak ditemukan.`, yang ada → `/tracking?do=<nomor>`. → FAIL.
- [ ] **Step 2:** Port dari `legacy/index.html` dan `legacy/dashboard.html` (tab peran Mahasiswa/Admin, modal laporan masalah). → PASS.
- [ ] **Step 3:** Commit `feat: login and dashboard views`.

### Task 8: Halaman Stok dan Tracking

**Files:**
- Create: `src/views/StokView.vue`, `src/views/TrackingView.vue`; Test: `tests/views/stok-tracking.test.js`

**Interfaces:**
- Consumes: `useStocksStore`, `useOrdersStore`, `upbjjList`, `paket`.

- [ ] **Step 1:** Test Stok: filter pencarian/UPBJJ/kategori/"stok menipis saja" dan pengurutan menghasilkan daftar yang benar; hasil kosong menampilkan teks keadaan kosong; ubah `filterUPBJJ` mereset filter turunan seperti `watch filterUPBJJ` lama; tambah, edit, hapus memperbarui store. Test Tracking: pilih UPBJJ mengosongkan ekspedisi terpilih dan hanya menawarkan ekspedisi UPBJJ itu; total harga = harga paket yang dipilih; membuat pengiriman menambah pesanan dengan nomor DO baru. → FAIL.
- [ ] **Step 2:** Port dari `legacy/stok.html` + `legacy/js/stok-app.js` dan `legacy/tracking.html` + `legacy/js/tracking-app.js` (computed → `computed`, watcher → `watch`; `catatanHTML` dirender dengan `v-html` seperti sebelumnya; unggah foto stok sebagai data URL). → PASS.
- [ ] **Step 3:** Commit `feat: stok and tracking views`.

### Task 9: Halaman Pesanan, Laporan, Histori

**Files:**
- Create: `src/views/PesananView.vue`, `LaporanView.vue`, `HistoriView.vue`; Test: `tests/views/pesanan-laporan-histori.test.js`

**Interfaces:**
- Consumes: `useOrdersStore`, `useStocksStore`, `useReportsStore`, `STATUS_FLOW`.

- [ ] **Step 1:** Test Pesanan: admin melihat tabel dengan tombol aksi sesuai status (`TERIMA/TOLAK` saat `Pending Approval`, `KIRIM` saat `Confirmed`, `SAMPAI` saat `In Transit`, `SELESAI` saat `Delivered`); mahasiswa melihat modul bertanda stok dan hanya pesanannya; opsi modul berstok 0 tidak muncul di pilihan; menekan TERIMA melebihi stok menampilkan toast kegagalan. Laporan: ubah status dan hapus laporan. Histori: daftar pesanan terurut terbaru; tombol ekspor menampilkan toast `Menyiapkan file download...`. → FAIL.
- [ ] **Step 2:** Port dari `legacy/pesanan.html`, `legacy/laporan.html`, `legacy/histori.html` (panel pelacakan langsung mahasiswa memakai `STATUS_FLOW`). → PASS.
- [ ] **Step 3:** Commit `feat: pesanan, laporan, histori views`.

### Task 10: Deploy, bersih-bersih, verifikasi akhir

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`; Delete: `legacy/`

**Interfaces:** tidak ada.

- [ ] **Step 1:** Workflow Actions: pada push ke `main` (dan manual), `npm ci`, `npm test`, `npm run build`, unggah `dist` dengan `actions/upload-pages-artifact`, lalu `actions/deploy-pages`; izin `pages: write`, `id-token: write`.
- [ ] **Step 2:** Tulis `README.md` singkat: apa aplikasinya, akun demo (dari `dataPengguna`), cara menjalankan (`npm install`, `npm run dev`), cara deploy (ubah Pages → Source → GitHub Actions).
- [ ] **Step 3:** Verifikasi: `npm test` hijau; `npm run build` sukses; `npx vite preview --base ./` lalu buka `/#/dashboard` setelah login, muat ulang, semua gambar stok tampil; cocokkan tiap halaman dengan `legacy/` berdampingan sebelum menghapusnya.
- [ ] **Step 4:** `git rm -r legacy` lalu `npm run build` sekali lagi; commit `chore: remove legacy pages, add deploy workflow and README`.
