# 🎓 TrainHub — Portal Pelatihan Karyawan

<p align="center">
  <strong>Platform Learning Management System (LMS) internal perusahaan untuk mengelola, mengikuti, dan memantau program pelatihan karyawan secara digital.</strong>
</p>

---

## 📖 Deskripsi Project

**TrainHub** adalah aplikasi web portal pelatihan karyawan (*enterprise employee training platform*) yang dirancang untuk mendukung proses pembelajaran dan pengembangan kompetensi sumber daya manusia dalam sebuah organisasi. Aplikasi ini menyediakan pengalaman belajar yang interaktif, terstruktur, dan terukur — mulai dari pendaftaran pelatihan, akses materi multimedia, pengerjaan kuis & tugas, hingga sertifikasi otomatis.

Sistem ini memiliki **dua peran utama**:
- **Karyawan** — Mengikuti pelatihan, menyelesaikan materi, mengerjakan kuis & tugas, serta memantau progres belajar.
- **Admin / Trainer** — Mengelola katalog pelatihan, mereview submission tugas karyawan, memberikan evaluasi & nilai, serta memantau dashboard statistik keseluruhan.

---

## ✨ Fitur Utama

### 🔐 Autentikasi & Otorisasi
- Login berdasarkan **email & password**
- Switch role cepat antara **Karyawan** dan **Admin** (untuk testing)
- Sesi tersimpan di `localStorage`
- Logout dengan reset sesi

### 🏠 Dashboard Home
- Statistik ringkasan: total pelatihan, pelatihan aktif, sertifikat diperoleh, jam belajar
- Daftar pelatihan yang sedang diikuti (*In Progress*)
- Rekomendasi pelatihan baru
- Aktivitas terakhir

### 📚 Katalog Pelatihan
- Grid katalog seluruh pelatihan yang tersedia
- **Filter** berdasarkan kategori dan level (Beginner / Intermediate / Advanced)
- **Pencarian** berdasarkan judul pelatihan
- Badge level & kategori pada setiap kartu pelatihan

### 📋 Detail Pelatihan (Course Detail)
- Informasi lengkap pelatihan: deskripsi, mentor, durasi, skill yang dipelajari
- Daftar modul & materi per modul
- Tombol **Daftar / Enroll** & **Batal Daftar / Unenroll**
- Indikator progres jika sudah terdaftar

### 🎒 Classroom (Ruang Belajar)
- Viewer materi multi-tipe: **Teks/Artikel**, **Video**, **Dokumen**
- **Kuis interaktif** (multiple choice) dengan scoring & feedback
- **Formulir pengumpulan tugas** (assignment submission) dengan text editor & simulasi file upload
- Navigasi modul & materi bersusun (sidebar tree)
- Tombol **Tandai Selesai** per materi dengan progress bar real-time

### 📊 Halaman Progress
- Ringkasan total: pelatihan terdaftar, rata-rata progres, total materi selesai
- Kartu progress per pelatihan dengan **progress bar persentase**
- Status: *In Progress* / *Completed*

### 💬 Forum Diskusi
- Thread diskusi per pelatihan
- Buat thread baru (judul + konten)
- Reply / balasan per thread
- Filter thread berdasarkan pelatihan tertentu

### 👤 Profil Pengguna
- Informasi profil: nama, email, departemen, jabatan, bio
- Daftar pencapaian (achievements/badge)
- Edit profil

### 🛡️ Admin Dashboard
- **Statistik global**: total karyawan, total pelatihan, total submission, completion rate
- **Tabel manajemen pelatihan** (CRUD): tambah, edit, hapus/arsipkan pelatihan
- **Tabel review submission** karyawan: evaluasi, beri nilai (0–100), berikan feedback
- **Modal form** untuk pembuatan & pengeditan pelatihan

### 🏆 Sertifikat
- Modal sertifikat otomatis ketika semua materi pelatihan selesai (100%)
- Desain sertifikat digital dengan nama peserta, judul pelatihan, dan tanggal

### 🧪 Enrollment & Testing Suite
- Modal testing interaktif yang bisa diakses dari navbar
- **One-click role switch** antara Karyawan ↔ Admin
- **Enroll / Unenroll testing** langsung dari panel
- **Auto-complete course** (otomatis menyelesaikan semua materi suatu pelatihan)
- **Database re-seed** (reset semua data ke kondisi awal)
- Status health check server

### 🔔 Notifikasi Toast
- Notifikasi pop-up real-time untuk setiap aksi (sukses, error, info)
- Auto-dismiss dengan animasi

---

## 🛠️ Tech Stack

| Layer | Teknologi | Keterangan |
|-------|-----------|------------|
| **Frontend** | React 19 | Library UI berbasis komponen |
| **Bundler** | Vite 6 | Build tool super cepat untuk development |
| **Styling** | Vanilla CSS | Custom design system dengan CSS Variables |
| **Icons** | Lucide React | Icon library modern & ringan |
| **Font** | Google Fonts (Inter) | Tipografi modern & clean |
| **Backend** | Express.js 4 | REST API server untuk Node.js |
| **Database** | In-Memory DataStore | Penyimpanan data sementara di memory (seed data) |
| **CORS** | cors middleware | Cross-Origin Resource Sharing handler |
| **Dev Tools** | Concurrently | Menjalankan backend & frontend bersamaan |
| **Runtime** | Node.js 26+ | JavaScript runtime |

---

## 📁 Struktur Project

```
IPPL/
├── backend/                        # Backend Express.js
│   ├── controllers/                # Controller layer (MVC pattern)
│   │   ├── authController.js       # Handler autentikasi (login, logout, me)
│   │   ├── trainingController.js   # Handler CRUD pelatihan
│   │   ├── enrollmentController.js # Handler pendaftaran & unenroll
│   │   └── materialController.js   # Handler materi & modul
│   ├── db/
│   │   ├── seedData.js             # Data awal (users, trainings, modules, dll.)
│   │   └── dataStore.js            # In-memory repository engine
│   ├── routes/
│   │   └── api.js                  # Definisi seluruh REST API endpoints
│   └── server.js                   # Express server entry point
├── src/                            # Frontend React
│   ├── components/                 # Komponen UI reusable
│   │   ├── Navbar.jsx              # Navigasi atas (sticky header)
│   │   ├── CourseCard.jsx          # Kartu pelatihan (grid item)
│   │   ├── StatCard.jsx            # Kartu statistik dashboard
│   │   ├── Toast.jsx               # Notifikasi pop-up
│   │   ├── CertificateModal.jsx    # Modal sertifikat digital
│   │   └── EnrollmentTestingModal.jsx # Panel testing interaktif
│   ├── context/
│   │   └── AuthContext.jsx         # Global state management (auth, nav, toast)
│   ├── pages/                      # Halaman-halaman aplikasi
│   │   ├── LoginPage.jsx           # Halaman login
│   │   ├── HomePage.jsx            # Dashboard utama karyawan
│   │   ├── CatalogPage.jsx         # Katalog semua pelatihan
│   │   ├── CourseDetailPage.jsx    # Detail pelatihan & pendaftaran
│   │   ├── ClassroomPage.jsx       # Ruang belajar (viewer materi/kuis/tugas)
│   │   ├── ProgressPage.jsx        # Progres pelatihan user
│   │   ├── ForumPage.jsx           # Forum diskusi
│   │   ├── ProfilePage.jsx         # Profil pengguna
│   │   └── AdminDashboardPage.jsx  # Dashboard admin/trainer
│   ├── services/
│   │   └── api.js                  # API client (fetch wrapper)
│   ├── App.jsx                     # Root component & routing
│   ├── main.jsx                    # React DOM entry point
│   └── index.css                   # Design system (tokens, layout, components)
├── index.html                      # HTML shell
├── vite.config.js                  # Konfigurasi Vite + proxy API
├── package.json                    # Dependencies & scripts
└── README.md                       # Dokumentasi ini
```

---

## 🚀 Cara Menjalankan

### Prasyarat

- **Node.js** versi 18 atau lebih baru
- **npm** versi 8 atau lebih baru

### 1. Clone & Install

```bash
# Clone repository (atau buka folder project)
cd "d:\Universirtas Islam Riau\Project\IPPL"

# Install semua dependencies
npm install
```

### 2. Jalankan Aplikasi (Development Mode)

```bash
# Jalankan backend + frontend secara bersamaan
npm run dev
```

Perintah ini akan menjalankan:
- ⚙️ **Backend** Express API di `http://localhost:5000`
- 🌐 **Frontend** Vite dev server di `http://localhost:5173`

### 3. Buka di Browser

Akses aplikasi di: **[http://localhost:5173](http://localhost:5173)**

### Menjalankan Terpisah (Opsional)

```bash
# Jalankan backend saja
npm run start:backend

# Jalankan frontend saja (di terminal terpisah)
npm run dev:frontend
```

### Build untuk Production

```bash
# Build frontend menjadi static files
npm run build

# Preview hasil build
npm run preview
```

---

## 🔑 Akun Login Testing

Aplikasi sudah dilengkapi **seed data** dengan akun-akun berikut:

| Role | Email | Password |
|------|-------|----------|
| **Karyawan** | `karyawan@trainhub.com` | `password123` |
| **Karyawan 2** | `karyawan2@trainhub.com` | `password123` |
| **Admin / Trainer** | `admin@trainhub.com` | `password123` |

> **Tips:** Gunakan tombol **🧪 Testing Suite** di navbar untuk berpindah peran (role switch) tanpa perlu logout & login ulang.

---

## 🔌 API Endpoints

### Autentikasi
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/auth/login` | Login dengan email & password |
| `GET` | `/api/auth/me` | Ambil data user dari session |
| `POST` | `/api/auth/logout` | Logout |

### Pelatihan
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/trainings` | Daftar semua pelatihan (+ filter) |
| `GET` | `/api/trainings/:id` | Detail pelatihan by ID |
| `POST` | `/api/trainings` | Buat pelatihan baru (Admin) |
| `PUT` | `/api/trainings/:id` | Update pelatihan (Admin) |
| `DELETE` | `/api/trainings/:id` | Arsipkan pelatihan (Admin) |

### Pendaftaran (Enrollment)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/trainings/:id/enroll` | Daftar ke pelatihan |
| `DELETE` | `/api/trainings/:id/enroll` | Batal daftar |
| `GET` | `/api/my/trainings` | Ringkasan progres pelatihan user |

### Materi & Modul
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/materials/:id/complete` | Tandai materi selesai |
| `POST` | `/api/trainings/:id/modules` | Tambah modul (Admin) |
| `POST` | `/api/modules/:moduleId/materials` | Tambah materi ke modul (Admin) |

### Tugas & Evaluasi
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/assignments/:id/submit` | Kumpulkan tugas |
| `GET` | `/api/submissions` | Daftar semua submission |
| `POST` | `/api/submissions/:id/evaluate` | Evaluasi & beri nilai (Admin) |

### Diskusi
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/discussions` | Daftar diskusi (+ filter) |
| `POST` | `/api/discussions` | Buat thread diskusi baru |
| `POST` | `/api/discussions/:id/replies` | Balas thread diskusi |

### Profil
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/users/profile` | Ambil data profil |
| `PUT` | `/api/users/profile` | Update profil |

### Testing
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/testing/seed` | Reset database ke seed data awal |
| `POST` | `/api/testing/auto-complete` | Otomatis selesaikan semua materi |

---

## 📸 Halaman yang Tersedia

| # | Halaman | Deskripsi |
|---|---------|-----------|
| 1 | **Login** | Halaman autentikasi pengguna |
| 2 | **Home / Dashboard** | Statistik & pelatihan aktif karyawan |
| 3 | **Katalog Pelatihan** | Grid pelatihan dengan filter & search |
| 4 | **Detail Pelatihan** | Info lengkap & tombol enroll |
| 5 | **Classroom** | Ruang belajar (materi, kuis, tugas) |
| 6 | **Progress** | Tracking progres per pelatihan |
| 7 | **Forum Diskusi** | Thread diskusi & balasan |
| 8 | **Profil** | Info & pengaturan profil pengguna |
| 9 | **Admin Dashboard** | Manajemen pelatihan & evaluasi (Admin only) |

---

## 🏗️ Arsitektur Aplikasi

```
┌──────────────────────────────────────────────┐
│              Browser (Client)                │
│  ┌──────────────────────────────────────┐    │
│  │     React 19 + Vite Dev Server       │    │
│  │     (http://localhost:5173)           │    │
│  │                                      │    │
│  │  AuthContext ─► Pages ─► Components  │    │
│  │       │                              │    │
│  │  API Service (fetch)                 │    │
│  └──────────┬───────────────────────────┘    │
│             │ /api/* (proxy)                 │
└─────────────┼────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────┐
│          Express.js Backend                  │
│          (http://localhost:5000)              │
│                                              │
│  Routes ─► Controllers ─► DataStore (Memory) │
│                              │               │
│                         Seed Data            │
└──────────────────────────────────────────────┘
```

---

## 👥 Tim Pengembang

**IPPL Team** — Universitas Islam Riau

---

## 📄 Lisensi

Project ini menggunakan lisensi **ISC**.

---

<p align="center">
  Dibuat dengan ❤️ untuk mendukung pengembangan kompetensi karyawan
</p>
