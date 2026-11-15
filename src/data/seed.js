// Data awal aplikasi (dipindahkan dari legacy/js/dataBahanAjar.js, nilai identik).

export const upbjjList = [
  { id: "Jakarta", nama: "UT Jakarta", ekspedisi: ["Kirim UT (Internal)", "JNE Regular", "JNE Express", "GrabExpress", "Gojek Instant", "SiCepat Gokil", "Pos Indonesia", "TIKI Regular", "Anteraja", "Ninja Xpress"] },
  { id: "Makassar", nama: "UT Makassar", ekspedisi: ["Kirim UT (Internal)", "JNE Regular", "JNE Express", "J&T Express", "Pos Indonesia Cargo", "TIKI Regular", "Wahana Express"] },
  { id: "Bandung", nama: "UT Bandung", ekspedisi: ["Kirim UT (Internal)", "JNE Regular", "J&T Express", "SiCepat Cargo", "Pos Indonesia", "Anteraja Regular", "Ninja Xpress"] },
  { id: "Surabaya", nama: "UT Surabaya", ekspedisi: ["Kirim UT (Internal)", "JNE Regular", "JNE Express", "J&T Express", "SiCepat Gokil", "Pos Indonesia Courier", "Wahana"] },
  { id: "Medan", nama: "UT Medan", ekspedisi: ["Kirim UT (Internal)", "JNE Regular", "J&T Express", "Pos Indonesia Cargo", "TIKI Regular", "Anteraja Cargo"] }
];

export const paket = [
  {
    kode: "PKT-01",
    nama: "Paket Ekonomi Pembangunan",
    harga: 150000,
    detail: [
      "EKMA4216 - Manajemen Keuangan (Edisi 3)",
      "ISIP4110 - Pengantar Sosiologi (Edisi 2)",
      "ESPA4111 - Pengantar Ekonomi Mikro (Edisi 1)"
    ]
  },
  {
    kode: "PKT-02",
    nama: "Paket Ilmu Komunikasi",
    harga: 180000,
    detail: [
      "ASIP4301 - Pengantar Ilmu Komunikasi (Edisi 2)",
      "SKOM4101 - Pengantar Hubungan Masyarakat (Edisi 4)",
      "SKOM4322 - Perkembangan Teknologi Komunikasi (Edisi 1)"
    ]
  },
  {
    kode: "PKT-03",
    nama: "Paket Manajemen Bisnis",
    harga: 220000,
    detail: [
      "EKMA4216 - Manajemen Keuangan (Edisi 3)",
      "EKMA4310 - Kepemimpinan (Edisi 1)",
      "EKMA4111 - Pengantar Bisnis (Edisi 5)"
    ]
  },
  {
    kode: "PKT-04",
    nama: "Paket Sastra Inggris",
    harga: 195000,
    detail: [
      "BING4101 - Basic English (Edisi 1)",
      "BING4211 - English for Social Sciences (Edisi 3)",
      "BING4312 - Translation I (Edisi 2)"
    ]
  }
];

export const initialStocks = [
  {
    kode: "ASIP4301",
    judul: "Pengantar Ilmu Komunikasi",
    Kategori: "BMP",
    upbjj: "Jakarta",
    lokasiRak: "Rak A-12",
    qty: 548,
    safety: 100,
    harga: 45000,
    catatanHTML: "Edisi terbaru, pastikan cover berwarna <strong>biru</strong>",
    foto: "/assets/pengantar_komunikasi.jpg"
  },
  {
    kode: "EKMA4216",
    judul: "Manajemen Keuangan",
    Kategori: "BMP",
    upbjj: "Jakarta",
    lokasiRak: "Rak B-04",
    qty: 392,
    safety: 150,
    harga: 60000,
    catatanHTML: "Terdapat CD suplemen di cover belakang",
    foto: "/assets/manajemen_keuangan.jpg"
  },
  {
    kode: "EKMA4310",
    judul: "Kepemimpinan",
    Kategori: "BMP PLUS",
    upbjj: "Makassar",
    lokasiRak: "Rak C-01",
    qty: 25,
    safety: 50,
    harga: 55000,
    catatanHTML: "<span class='text-amber-500 font-bold'>Stok menipis, segera ajukan suplai tambahan</span>",
    foto: "/assets/kepemimpinan.jpg"
  },
  {
    kode: "BIOL4211",
    judul: "Mikrobiologi Dasar",
    Kategori: "BA DIGITAL",
    upbjj: "Bandung",
    lokasiRak: "Rack D-10",
    qty: 0,
    safety: 30,
    harga: 85000,
    catatanHTML: "<span class='text-red-600 font-bold'>KOSONG! Segera order cetak ulang</span>",
    foto: "/assets/mikrobiologi.jpg"
  },
  {
    kode: "PAUD4401",
    judul: "Perkembangan Anak Usia Dini",
    Kategori: "BAI",
    upbjj: "Surabaya",
    lokasiRak: "Rak A-02",
    qty: 204,
    safety: 40,
    harga: 50000,
    catatanHTML: "Disediakan audio kaset suplemen",
    foto: "/assets/paud_perkembangan.jpeg"
  },
  {
    kode: "MKWI4111",
    judul: "Belajar di Era Digital",
    Kategori: "BMP",
    upbjj: "Medan",
    lokasiRak: "Rak F-03",
    qty: 85,
    safety: 100,
    harga: 40000,
    catatanHTML: "Edisi ke-3, revisi tahun 2024",
    foto: "/assets/Belajar di Era Digital.jpg"
  },
  {
    kode: "KTIK2021",
    judul: "Kit Praktik Kompensasi Dinamis",
    Kategori: "KIT PRAKTIK",
    upbjj: "Medan",
    lokasiRak: "Gudang B-02",
    qty: 12,
    safety: 15,
    harga: 120000,
    catatanHTML: "Kelengkapan kit harus diperiksa secara manual",
    foto: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=150&auto=format&fit=crop"
  }
];

export const dataPengguna = [
  { id: 1, nama: "Rina Wulandari", email: "rina@ut.ac.id", password: "rina123", role: "UPBJJ-UT", lokasi: "UPBJJ Jakarta" },
  { id: 2, nama: "Agus Pranoto", email: "agus@ut.ac.id", password: "agus123", role: "UPBJJ-UT", lokasi: "UPBJJ Makassar" },
  { id: 3, nama: "Siti Marlina", email: "siti@ut.ac.id", password: "siti123", role: "Puslaba", lokasi: "Pusat" },
  { id: 4, nama: "Doni Setiawan", email: "doni@ut.ac.id", password: "doni123", role: "Fakultas", lokasi: "FISIP" },
  { id: 5, nama: "Admin SITTA", email: "admin@ut.ac.id", password: "admin123", role: "Administrator", lokasi: "Pusat" },
  { id: 6, nama: "Dija Arrahmah", email: "mahasiswa@ut.ac.id", password: "mahasiswa123", role: "Mahasiswa", lokasi: "UPBJJ Jakarta", nim: "052664742" }
];

const dataBahanAjar = [
  { kodeLokasi: "0TMP01", kodeBarang: "ASIP4301", namaBarang: "Pengantar Ilmu Komunikasi", jenisBarang: "BMP", edisi: "2", stok: 548, cover: "/assets/pengantar_komunikasi.jpg" },
  { kodeLokasi: "0JKT01", kodeBarang: "EKMA4216", namaBarang: "Manajemen Keuangan", jenisBarang: "BMP", edisi: "3", stok: 392, cover: "/assets/manajemen_keuangan.jpg" },
  { kodeLokasi: "0SBY02", kodeBarang: "EKMA4310", namaBarang: "Kepemimpinan", jenisBarang: "BMP", edisi: "1", stok: 278, cover: "/assets/kepemimpinan.jpg" },
  { kodeLokasi: "0MLG01", kodeBarang: "BIOL4211", namaBarang: "Mikrobiologi Dasar", jenisBarang: "BMP", edisi: "2", stok: 165, cover: "/assets/mikrobiologi.jpg" },
  { kodeLokasi: "0UPBJJBDG", kodeBarang: "PAUD4401", namaBarang: "Perkembangan Anak Usia Dini", jenisBarang: "BMP", edisi: "4", stok: 204, cover: "/assets/paud_perkembangan.jpeg" }
];

const dataTracking = {
  "DO2026-001":  {
    doNum: "DO2026-001",
    studentName: "Amir Nasution",
    nim: "041234567",
    date: "2026-05-20",
    moduleCode: "PKT-01",
    packageName: "Paket Ekonomi Pembangunan",
    status: "Finished",
    address: "Jl. Merdeka No. 45, Kebon Jeruk, Jakarta Barat",
    ekspedisi: "JNE Express",
    total: "Rp 150.000"
  },
 "DO2026-002": {
    doNum: "DO2026-002",
    studentName: "Siti Rahma",
    nim: "042345678",
    date: "2026-05-22",
    moduleCode: "PKT-02",
    packageName: "Paket Ilmu Komunikasi",
    status: "In Transit",
    address: "Komp. Dosen UT No. 12, Pamulang, Tangerang Selatan",
    ekspedisi: "JNE Regular",
    total: "Rp 180.000"
  },
 "DO2026-003": {
    doNum: "DO2026-003",
    studentName: "Budi Santoso",
    nim: "043456789",
    date: "2026-05-24",
    moduleCode: "PKT-03",
    packageName: "Paket Manajemen Bisnis",
    status: "Pending Approval",
    address: "Jl. Sudirman Lama No. 9A, Makassar",
    ekspedisi: "JNE Express",
    total: "Rp 220.000"
  },

    "2023001234": {
    nomorDO: "2023001234",
    nama: "Rina Wulandari",
    status: "In Transit",
    ekspedisi: "JNE",
    tanggalKirim: "2025-08-25",
    paket: "0JKT01",
    total: "Rp 180.000",
    perjalanan: [
      { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka" },
      { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: TANGERANG SELATAN" },      
      { waktu: "2025-08-25 10:12:20", keterangan: "Diteruskan ke Kantor Jakarta Selatan" }
    ]
  },
  "2023005678": {
    nomorDO: "2023005678",
    nama: "Agus Pranoto",
    status: "Delivered",
    ekspedisi: "Pos Indonesia",
    tanggalKirim: "2025-08-25",
    paket: "0UPBJJBDG",
    total: "Rp 220.000",
    perjalanan: [
      { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka" },
      { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: TANGERANG SELATAN" },      
      { waktu: "2025-08-25 16:30:10", keterangan: "Diteruskan ke Kantor Kota Bandung" },
      { waktu: "2025-08-26 12:15:33", keterangan: "Tiba di Hub: Kota BANDUNG" },
      { waktu: "2025-08-26 15:06:12", keterangan: "Proses antar ke Cimahi" },
      { waktu: "2025-08-26 20:00:00", keterangan: "Selesai Antar. Penerima: Agus Pranoto" }
    ]
  }
};

export const ADMIN_ROLES = ['Admin', 'UPBJJ-UT', 'Puslaba', 'Fakultas', 'Administrator']

// Pemetaan sama dengan initGlobalData() versi lama.
export const initialOrders = Object.values(dataTracking).map((t) => {
  const id = t.nomorDO || t.doNum
  return {
    id,
    doNum: id,
    nim: t.nim || '052664742',
    date: t.tanggalKirim ? t.tanggalKirim + 'T10:00:00Z' : t.date || new Date().toISOString(),
    moduleCode: t.paket || t.moduleCode,
    moduleName:
      t.packageName ||
      (dataBahanAjar.find((b) => b.kodeBarang === (t.paket || t.moduleCode)) || {}).namaBarang ||
      'Modul UT',
    studentName: t.nama || t.studentName,
    status: t.status,
    qty: t.qty || 1,
    address: t.address || 'Alamat Pengiriman Terdaftar',
    ekspedisi: t.ekspedisi || 'JNE Express',
    total: t.total || 'Rp 150.000',
  }
})
