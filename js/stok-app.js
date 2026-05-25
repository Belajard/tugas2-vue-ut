// Vue 3 Stock Management App Configuration
const { createApp } = Vue;

createApp({
  data() {
    return {
      stocks: [],
      upbjjs: [],
      categories: ["BMP", "BMP PLUS", "BA DIGITAL", "BAI", "KIT PRAKTIK"],
      
      // Filter & Sort State
      filterSearch: "",
      filterUPBJJ: "",
      filterKategori: "",
      filterLowStockOnly: false,
      sortBy: "judul",
      sortOrder: "asc",

      // Add Item Form State
      newKode: "",
      newJudul: "",
      newKategori: "BMP",
      newUPBJJ: "",
      newLokasiRak: "",
      newQty: 0,
      newSafety: 20,
      newHarga: 50000,
      newCatatan: "",
      newFoto: null,
      errors: {},

      // Edit Item Modal State
      showEditModal: false,
      editItem: {
        kode: "",
        judul: "",
        Kategori: "",
        upbjj: "",
        lokasiRak: "",
        qty: 0,
        safety: 0,
        harga: 0,
        catatanHTML: "",
        foto: null
      },
      editErrors: {},

      // UI Control & Session Details
      userName: "User",
      userRole: "Guest",
      userInitial: "U",
      isDark: false,
      notifications: [],
      showNotifBox: false
    };
  },

  computed: {
    // Vue computed properties are cached and only recomputed when dependencies change!
    filteredAndSortedStocks() {
      let result = this.stocks;

      // 1. Text Search Filter
      if (this.filterSearch) {
        const query = this.filterSearch.toLowerCase().trim();
        result = result.filter(
          item =>
            item.kode.toLowerCase().includes(query) ||
            item.judul.toLowerCase().includes(query) ||
            item.lokasiRak.toLowerCase().includes(query)
        );
      }

      // 2. UT-Daerah (UPBJJ) Filter
      if (this.filterUPBJJ) {
        result = result.filter(item => item.upbjj === this.filterUPBJJ);
      }

      // 3. Kategori Filter (Dependent Option, only filtered if UPBJJ matches and chosen)
      if (this.filterKategori) {
        result = result.filter(item => item.Kategori === this.filterKategori);
      }

      // 4. Low Stock Alert Filter (qty < safety and qty = 0)
      if (this.filterLowStockOnly) {
        result = result.filter(item => item.qty < item.safety || item.qty === 0);
      }

      // 5. Sorting (judul, stock/qty, harga)
      result.sort((a, b) => {
        let valA, valB;
        
        if (this.sortBy === "judul") {
          valA = a.judul.toLowerCase();
          valB = b.judul.toLowerCase();
        } else if (this.sortBy === "stock") {
          valA = a.qty;
          valB = b.qty;
        } else if (this.sortBy === "harga") {
          valA = a.harga || 0;
          valB = b.harga || 0;
        }

        if (valA < valB) return this.sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return this.sortOrder === "asc" ? 1 : -1;
        return 0;
      });

      return result;
    },

    // Summary Statistics Computed Properties
    totalJenisModul() {
      return this.stocks.length;
    },

    totalStokMenipis() {
      return this.stocks.filter(s => s.qty < s.safety && s.qty > 0).length;
    },

    totalStokKosong() {
      return this.stocks.filter(s => s.qty === 0).length;
    },

    totalUnitTersedia() {
      return this.stocks.reduce((acc, current) => acc + current.qty, 0);
    },

    isAdmin() {
      return this.userRole === 'Admin' || this.userRole === 'Administrator' || this.userRole === 'UPBJJ-UT' || this.userRole === 'Puslaba' || this.userRole === 'Fakultas';
    }
  },

  watch: {
    // WATCHER 1: Deep watch stocks list and automatically persist to localStorage
    stocks: {
      handler(newStocks) {
        localStorage.setItem("ut_vue_stocks", JSON.stringify(newStocks));
        // Sync and update the basic app.js 'ut_stocks' if other parts of the app read it
        const appCompatStocks = newStocks.map(s => ({
          foto: s.foto,
          kodeLokasi: s.lokasiRak,
          kodeBarang: s.kode,
          code: s.kode,
          name: s.judul,
          category: s.Kategori,
          edisi: "1",
          stock: s.qty,
          safety: s.safety,
          harga: s.harga
        }));
        localStorage.setItem("ut_stocks", JSON.stringify(appCompatStocks));
      },
      deep: true
    },

    // WATCHER 2: Watch selected UT-Daerah and automatically reset and update sub-category filter (dependent options logic)
    filterUPBJJ(newVal) {
      this.filterKategori = ""; // Reset Kategori when UPBJJ selection changes
      if (newVal) {
        this.addNotification(`Memfilter UT Daerah: ${newVal}`);
      }
    }
  },

  created() {
    this.initSession();
    this.loadData();
    this.initTheme();
    
    // Add landing notification
    this.addNotification("Selamat Datang di Portal Informasi Stok Bahan Ajar Vue.js");
  },

  methods: {
    initSession() {
      this.userName = localStorage.getItem("userName") || "Rina Wulandari";
      this.userRole = localStorage.getItem("userRole") || "Admin";
      this.userInitial = this.userName.charAt(0).toUpperCase();
    },

    loadData() {
      this.upbjjs = window.upbjjList || [];
      
      const storedStocks = localStorage.getItem("ut_vue_stocks");
      let loadedStocks = [];
      if (storedStocks) {
        try {
          loadedStocks = JSON.parse(storedStocks);
        } catch (e) {
          loadedStocks = window.dataBahanAjarStok || [];
        }
      } else {
        loadedStocks = window.dataBahanAjarStok || [];
      }

      // Automatically sync and merge any new materials from the JS data data file into localStorage
      if (window.dataBahanAjarStok && window.dataBahanAjarStok.length > 0) {
        window.dataBahanAjarStok.forEach(item => {
          const exists = loadedStocks.some(s => s.kode.toUpperCase() === item.kode.toUpperCase());
          if (!exists) {
            loadedStocks.push(item);
          }
        });
      }

      this.stocks = loadedStocks;
      localStorage.setItem("ut_vue_stocks", JSON.stringify(loadedStocks));
    },

    initTheme() {
      const storedTheme = localStorage.getItem("theme");
      this.isDark = storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      if (this.isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },

    toggleTheme() {
      this.isDark = !this.isDark;
      localStorage.setItem("theme", this.isDark ? "dark" : "light");
      if (this.isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      this.showToastNotification("Ganti tema berhasil.");
    },

    addNotification(text) {
      const timeStr = new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
      this.notifications.unshift({ text, time: timeStr });
    },

    clearNotifications() {
      this.notifications = [];
      this.showNotifBox = false;
      this.showToastNotification("Semua notifikasi dibersihkan.");
    },

    logout() {
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userLocation");
      window.location.href = "index.html?logout=true";
    },

    // Stock Status Helpers
    isAman(item) {
      return item.qty >= item.safety;
    },

    isMenipis(item) {
      return item.qty < item.safety && item.qty > 0;
    },

    isKosong(item) {
      return item.qty === 0;
    },

    getStatusLabel(item) {
      if (item.qty === 0) return "Kosong";
      if (item.qty < item.safety) return "Menipis";
      return "Aman";
    },

    // Dynamic Base64 file uploader reader
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newFoto = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    // Edit file image loader
    handleEditImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.editItem.foto = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    // Simple Form Validation
    validateNewStock() {
      this.errors = {};
      
      const codePattern = /^[A-Z]{4}\d{4}$/;
      if (!this.newKode) {
        this.errors.kode = "Kode barang wajib diisi.";
      } else if (!codePattern.test(this.newKode.toUpperCase().trim())) {
        this.errors.kode = "Format kode harus 4 huruf + 4 angka (contoh: ASIP4301).";
      } else if (this.stocks.some(s => s.kode.toUpperCase() === this.newKode.toUpperCase())) {
        this.errors.kode = "Kode barang sudah terdaftar!";
      }
      
      if (!this.newJudul) {
        this.errors.judul = "Nama bahan ajar wajib diisi.";
      }
      if (!this.newKategori) {
        this.errors.Kategori = "Kategori wajib dipilih.";
      }
      if (!this.newUPBJJ) {
        this.errors.upbjj = "UT-Daerah wajib dipilih.";
      }
      if (!this.newLokasiRak) {
        this.errors.lokasiRak = "Lokasi Rak wajib diisi.";
      }
      if (this.newQty === null || this.newQty === undefined || this.newQty < 0) {
        this.errors.qty = "Jumlah stok tidak boleh kosong atau < 0.";
      }
      if (this.newSafety === null || this.newSafety === undefined || this.newSafety < 0) {
        this.errors.safety = "Batas safety stok tidak boleh kosong atau < 0.";
      }
      if (this.newHarga === null || this.newHarga === undefined || this.newHarga <= 0) {
        this.errors.harga = "Harga satuan harus > 0.";
      }

      return Object.keys(this.errors).length === 0;
    },

    addNewStock() {
      if (!this.validateNewStock()) {
        this.showToastNotification("Gagal menyimpan data barang. Harap periksa form validasi!");
        return;
      }

      const item = {
        kode: this.newKode.toUpperCase().trim(),
        judul: this.newJudul.trim(),
        Kategori: this.newKategori,
        upbjj: this.newUPBJJ,
        lokasiRak: this.newLokasiRak.trim(),
        qty: parseInt(this.newQty) || 0,
        safety: parseInt(this.newSafety) || 0,
        harga: parseFloat(this.newHarga) || 0,
        catatanHTML: this.newCatatan ? this.newCatatan.trim() : "Tersedia",
        foto: this.newFoto || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200&auto=format&fit=crop"
      };

      this.stocks.unshift(item);
      this.addNotification(`Menambahkan bahan ajar baru: ${item.kode}`);
      this.showToastNotification("Bahan ajar baru berhasil terdaftar.");
      this.resetForm();
    },

    resetForm() {
      this.newKode = "";
      this.newJudul = "";
      this.newKategori = "BMP";
      this.newUPBJJ = "";
      this.newLokasiRak = "";
      this.newQty = 0;
      this.newSafety = 20;
      this.newHarga = 50000;
      this.newCatatan = "";
      this.newFoto = null;
      this.errors = {};
      
      const fileInput = document.getElementById("foto");
      if (fileInput) fileInput.value = "";
    },

    // Reset Filters
    resetFilters() {
      this.filterSearch = "";
      this.filterUPBJJ = "";
      this.filterKategori = "";
      this.filterLowStockOnly = false;
      this.sortBy = "judul";
      this.sortOrder = "asc";
      this.showToastNotification("Semua saringan filter di-reset kembali.");
    },

    // Edit Methods
    openEditModal(item) {
      this.editItem = { ...item };
      this.editErrors = {};
      this.showEditModal = true;
    },

    closeEditModal() {
      this.showEditModal = false;
      this.editErrors = {};
    },

    validateEditStock() {
      this.editErrors = {};
      if (!this.editItem.judul) this.editErrors.judul = "Nama bahan ajar wajib diisi.";
      if (!this.editItem.lokasiRak) this.editErrors.lokasiRak = "Lokasi Rak wajib diisi.";
      if (this.editItem.qty === null || this.editItem.qty === undefined || this.editItem.qty < 0) {
        this.editErrors.qty = "Jumlah stok tidak boleh < 0.";
      }
      if (this.editItem.safety === null || this.editItem.safety === undefined || this.editItem.safety < 0) {
        this.editErrors.safety = "Batas safety tidak boleh < 0.";
      }
      if (this.editItem.harga === null || this.editItem.harga === undefined || this.editItem.harga <= 0) {
        this.editErrors.harga = "Harga satuan harus > 0.";
      }

      return Object.keys(this.editErrors).length === 0;
    },

    saveEdit() {
      if (!this.validateEditStock()) {
        this.showToastNotification("Gagal melacak data form edit!");
        return;
      }

      const idx = this.stocks.findIndex(s => s.kode === this.editItem.kode);
      if (idx !== -1) {
        // Enforce safety limits
        this.editItem.qty = parseInt(this.editItem.qty) || 0;
        this.editItem.safety = parseInt(this.editItem.safety) || 0;
        this.editItem.harga = parseFloat(this.editItem.harga) || 0;
        
        this.stocks[idx] = { ...this.editItem };
        this.addNotification(`Mengupdate details bahan ajar: ${this.editItem.kode}`);
        this.showToastNotification("Update berhasil disimpan.");
        this.closeEditModal();
      }
    },

    deleteStock(id) {
      if (confirm(`Apakah Anda yakin ingin menghapus item ${id}?`)) {
        this.stocks = this.stocks.filter(s => s.kode !== id);
        this.addNotification(`Menghapus bahan ajar: ${id}`);
        this.showToastNotification("Bahan ajar berhasil dihapus dari stok.");
      }
    },

    showToastNotification(message) {
      const toast = document.getElementById("toast");
      const msgEl = document.getElementById("toast-message");
      if (!toast || !msgEl) return;
      msgEl.innerText = message;
      toast.classList.remove("translate-y-20", "opacity-0");
      setTimeout(() => {
        toast.classList.add("translate-y-20", "opacity-0");
      }, 3000);
    },

    formatToRupiah(value) {
      return (value || 0).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      });
    }
  }
}).mount("#app");
