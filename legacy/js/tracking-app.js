// Vue 3 Tracking Delivery Order App
const { createApp } = Vue;

const defaultOrders = [
  {
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
  {
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
  {
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
  }
];

createApp({
  data() {
    return {
      orders: [],
      upbjjs: [],
      packages: [],
      
      // Tracking Search State
      searchQuery: "",
      selectedOrder: null,
      statusFilter: "",

      // Add DO Form State (For Admin)
      nim: "",
      nama: "",
      selectedUPBJJ: "",
      ekspedisi: "",
      selectedPaketKode: "",
      tanggalKirim: new Date().toISOString().split("T")[0],
      alamat: "",
      formErrors: {},

      // App UI Context
      userName: "User",
      userRole: "Guest",
      userInitial: "U",
      isDark: false,
      notifications: [],
      showNotifBox: false
    };
  },

  computed: {
    isAdmin() {
      return this.userRole === 'Admin' || this.userRole === 'Administrator' || this.userRole === 'UPBJJ-UT' || this.userRole === 'Puslaba' || this.userRole === 'Fakultas';
    },

    // Return dynamic expeditions depending on the selected UPBJJ (Dependent Option pattern)
    availableEkspedisi() {
      const found = this.upbjjs.find(u => u.id === this.selectedUPBJJ);
      return (found && Array.isArray(found.ekspedisi)) ? found.ekspedisi : ["Kirim UT (Internal)", "JNE Regular", "JNE Express", "GrabExpress", "Gojek Instant", "SiCepat Gokil", "Pos Indonesia", "TIKI Regular", "Anteraja", "Ninja Xpress", "J&T Express", "Wahana"];
    },

    selectedPaketDetails() {
      if (!this.selectedPaketKode) return null;
      return this.packages.find(p => p.kode === this.selectedPaketKode) || null;
    },

    calculatedTotalHarga() {
      const pkg = this.selectedPaketDetails;
      return pkg ? pkg.harga : 0;
    },

    // Filtered order card list for Admin Panel
    filteredOrders() {
      let list = [...this.orders];
      if (this.statusFilter) {
        list = list.filter(o => o.status === this.statusFilter);
      }
      return list.reverse(); // Newest first
    },

    // Status percentage computed dynamically
    trackingPercentage() {
      if (!this.selectedOrder) return "0%";
      const maps = {
        "Pending Approval": "20%",
        "Confirmed": "40%",
        "In Transit": "70%",
        "Delivered": "90%",
        "Finished": "100%"
      };
      return maps[this.selectedOrder.status] || "10%";
    },

    // Dynamic Tracking Milestones list based on status
    trackingMilestones() {
      if (!this.selectedOrder) return [];
      
      const states = ["Pending Approval", "Confirmed", "In Transit", "Delivered", "Finished"];
      const descriptions = {
        "Pending Approval": "Pesanan Dibuat, menunggu Approval oleh petugas UT-Daerah.",
        "Confirmed": "Pesanan terkonfirmasi, barang dipersiapkan di Loket UT Pusat.",
        "In Transit": `Paket diserahkan ke ${this.selectedOrder.ekspedisi || 'Kurir'}, sedang dikirim ke Hub Logistik Utama.`,
        "Delivered": `Paket tiba di alamat tujuan (${this.selectedOrder.address || 'Alamat Mahasiswa'}).`,
        "Finished": `Selesai. Bahan Ajar diterima langsung oleh ${this.selectedOrder.studentName || 'Mahasiswa'}.`
      };

      const results = [];
      const currentIdx = states.indexOf(this.selectedOrder.status);
      
      for (let i = 0; i <= currentIdx; i++) {
        const stateName = states[i];
        results.push({
          status: stateName,
          title: this.getStatusMilestoneTitle(stateName),
          desc: descriptions[stateName],
          time: this.selectedOrder.date ? `${this.selectedOrder.date} 1${i}:00 WIB` : "Hari ini"
        });
      }
      
      return results.reverse(); // Show latest milestone at the top
    }
  },

  watch: {
    // WATCHER 1: Auto-persist orders to localStorage when items are modified
    orders: {
      handler(newOrders) {
        localStorage.setItem("ut_orders", JSON.stringify(newOrders));
      },
      deep: true
    },

    // WATCHER 2: Auto reset expedition selection when selected UPBJJ changes
    selectedUPBJJ(newVal) {
      this.ekspedisi = "";
      if (newVal) {
        this.addNotification(`Mengubah wilayah UPBJJ ke: ${newVal}`);
      }
    }
  },

  created() {
    this.initSession();
    this.loadData();
    this.initTheme();
    
    // Add default notify message
    this.addNotification("Pusat Layanan Tracking Delivery Order UT Siap.");
  },

  methods: {
    initSession() {
      this.userName = localStorage.getItem("userName") || "Rina Wulandari";
      this.userRole = localStorage.getItem("userRole") || "Admin";
      this.userInitial = this.userName.charAt(0).toUpperCase();

      const isStudent = this.userRole === 'Mahasiswa' || this.userRole === 'Student' || (this.userRole !== 'Admin' && this.userRole !== 'UPBJJ-UT' && this.userRole !== 'Puslaba' && this.userRole !== 'Fakultas' && this.userRole !== 'Administrator');
      if (isStudent) {
        this.$nextTick(() => {
          ['nav-laporan', 'nav-histori'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
          });
        });
      }
    },

    loadData() {
      // Load and sync UPBJJs
      const storedUpbjjs = localStorage.getItem('ut_upbjj_list');
      let loadedUpbjjs = [];
      if (storedUpbjjs) {
        try {
          loadedUpbjjs = JSON.parse(storedUpbjjs);
        } catch (e) {
          loadedUpbjjs = window.upbjjList || [];
        }
      } else {
        loadedUpbjjs = window.upbjjList || [];
      }
      
      if (window.upbjjList) {
        window.upbjjList.forEach(u => {
          const exists = loadedUpbjjs.some(item => item.id === u.id);
          if (!exists) {
            loadedUpbjjs.push(u);
          }
        });
      }
      this.upbjjs = loadedUpbjjs;
      localStorage.setItem('ut_upbjj_list', JSON.stringify(this.upbjjs));

      // Load and sync Packages
      const storedPackages = localStorage.getItem('ut_packages');
      let loadedPackages = [];
      if (storedPackages) {
        try {
          loadedPackages = JSON.parse(storedPackages);
        } catch (e) {
          loadedPackages = window.paket || [];
        }
      } else {
        loadedPackages = window.paket || [];
      }

      if (window.paket) {
        window.paket.forEach(p => {
          const exists = loadedPackages.some(item => item.kode === p.kode);
          if (!exists) {
            loadedPackages.push(p);
          }
        });
      }
      this.packages = loadedPackages;
      localStorage.setItem('ut_packages', JSON.stringify(this.packages));

      // Load orders
      const storedOrders = localStorage.getItem("ut_orders");
      if (storedOrders) {
        try {
          this.orders = JSON.parse(storedOrders);
        } catch (e) {
          this.orders = defaultOrders;
        }
      } else {
        this.orders = defaultOrders;
        localStorage.setItem("ut_orders", JSON.stringify(defaultOrders));
      }
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
      this.showToastNotification("Notifikasi dibersihkan.");
    },

    logout() {
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      window.location.href = "index.html?logout=true";
    },

    // Helper to format currency
    formatToRupiah(value) {
      return (value || 0).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      });
    },

    getStatusMilestoneTitle(status) {
      const map = {
        "Pending Approval": "Pendaftaran Delivery Order",
        "Confirmed": "Terkonfirmasi & Disiapkan Pusat",
        "In Transit": "Dalam Pengiriman",
        "Delivered": "Tiba di Alamat Mahasiswa",
        "Finished": "Paket Selesai Diterima"
      };
      return map[status] || status;
    },

    // Search DO
    triggerSearch() {
      if (!this.searchQuery) {
        this.showToastNotification("Silakan masukkan Nomor DO telebih dahulu.");
        return;
      }

      const found = this.orders.find(o => o.doNum.toUpperCase().trim() === this.searchQuery.toUpperCase().trim());
      if (found) {
        this.selectedOrder = found;
        this.addNotification(`Lolos pelacakan No. DO: ${found.doNum}`);
      } else {
        this.selectedOrder = null;
        this.showToastNotification("Nomor DO tidak ditemukan.");
      }
    },

    selectOrderCard(item) {
      this.searchQuery = item.doNum;
      this.selectedOrder = item;
      this.addNotification(`Memuat rincian DO: ${item.doNum}`);
    },

    // Update Status (Admin Actions)
    updateOrderStatus(status) {
      if (!this.selectedOrder) return;
      
      const idx = this.orders.findIndex(o => o.doNum === this.selectedOrder.doNum);
      if (idx !== -1) {
        this.orders[idx].status = status;
        this.selectedOrder.status = status;
        this.addNotification(`Update Status DO ${this.selectedOrder.doNum} -> ${status}`);
        this.showToastNotification(`Status DO berhasil diperbarui ke ${status}.`);
      }
    },

    // Delete Record (Admin Actions)
    deleteActiveOrder() {
      if (!this.selectedOrder) return;
      if (confirm(`Apakah Anda yakin ingin menghapus data pengiriman ${this.selectedOrder.doNum}?`)) {
        const doId = this.selectedOrder.doNum;
        this.orders = this.orders.filter(o => o.doNum !== doId);
        this.selectedOrder = null;
        this.searchQuery = "";
        this.addNotification(`Menghapus pengiriman: ${doId}`);
        this.showToastNotification("Data pengiriman berhasil dihapus.");
      }
    },

    // Auto DONumber sequence generator
    generateAutoDONumber() {
      const currentYear = new Date().getFullYear();
      
      // Calculate max sequence for this year in stored orders
      const yearPrefix = `DO${currentYear}-`;
      const matching = this.orders.filter(o => o.doNum && o.doNum.startsWith(yearPrefix));
      
      let maxSeq = 0;
      matching.forEach(o => {
        const parts = o.doNum.split("-");
        if (parts.length === 2) {
          const num = parseInt(parts[1]) || 0;
          if (num > maxSeq) maxSeq = num;
        }
      });

      const nextSeq = maxSeq + 1;
      const formattedSeq = String(nextSeq).padStart(3, "0");
      return `${yearPrefix}${formattedSeq}`;
    },

    // Form Submissions
    validateForm() {
      this.formErrors = {};

      if (!this.nim.trim()) {
        this.formErrors.nim = "NIM Mahasiswa wajib diisi.";
      } else if (this.nim.trim().length < 8) {
        this.formErrors.nim = "NIM harus memiliki minimal 8 digit.";
      }

      if (!this.nama.trim()) {
        this.formErrors.nama = "Nama Lengkap wajib diisi.";
      }

      if (!this.selectedUPBJJ) {
        this.formErrors.upbjj = "Banned! Pilih Wilayah UPBJJ Daerah.";
      }

      if (!this.ekspedisi) {
        this.formErrors.ekspedisi = "Ekspedisi Cargo Kurir wajib dipilih.";
      }

      if (!this.selectedPaketKode) {
        this.formErrors.paket = "Pilih Paket Bahan Ajar Akademis.";
      }

      if (!this.alamat.trim()) {
        this.formErrors.alamat = "Alamat Pengiriman Lengkap wajib diisi.";
      }

      return Object.keys(this.formErrors).length === 0;
    },

    createNewDelivery() {
      if (!this.validateForm()) {
        this.showToastNotification("Gagal menyimpan. Harap periksa form validasi!");
        return;
      }

      const generatedDO = this.generateAutoDONumber();
      const pkg = this.selectedPaketDetails;

      const newDOItem = {
        doNum: generatedDO,
        nim: this.nim.trim(),
        studentName: this.nama.trim(),
        date: this.tanggalKirim,
        moduleCode: pkg.kode,
        packageName: pkg.nama,
        status: "Pending Approval",
        address: `${this.alamat.trim()} (UT ${this.selectedUPBJJ})`,
        ekspedisi: this.ekspedisi,
        total: this.formatToRupiah(pkg.harga)
      };

      this.orders.push(newDOItem);
      this.addNotification(`Dibuat Delivery Order baru: ${generatedDO}`);
      this.showToastNotification(`Delivery Order ${generatedDO} sukses ditambahkan!`);
      
      // Set searched view automatically to see the new DO details
      this.searchQuery = generatedDO;
      this.selectedOrder = newDOItem;

      this.resetForm();
    },

    resetForm() {
      this.nim = "";
      this.nama = "";
      this.selectedUPBJJ = "";
      this.ekspedisi = "";
      this.selectedPaketKode = "";
      this.alamat = "";
      this.tanggalKirim = new Date().toISOString().split("T")[0];
      this.formErrors = {};
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
    }
  }
}).mount("#app");
