# Product Requirements Document (PRD)
# TrainHub — Portal Pelatihan Karyawan

## 1. Overview

TrainHub adalah portal pelatihan internal perusahaan berbasis web yang mendukung proses pembelajaran karyawan secara terpusat. Fokus sistem adalah distribusi materi, tugas/submission, evaluasi capaian, tracking progress, dan interaksi dua arah melalui forum diskusi.

Project ini merupakan MVP untuk mata kuliah Implementasi dan Pengujian Perangkat Lunak. Analisis dan desain menggunakan pendekatan Object-Oriented. Sistem harus sederhana, stabil, mudah diuji, dan memiliki dokumentasi pengujian yang lengkap.

Arah UI/UX diperbarui dari konsep landing page menjadi **learning dashboard**. Referensi visualnya adalah pola dashboard platform pembelajaran seperti Cisco Networking Academy: navbar horizontal di atas, card sederhana, informasi mudah dipindai, whitespace cukup, dan fokus pada aktivitas belajar.

## 2. Problem Statement

Dibutuhkan portal terpusat yang memungkinkan karyawan menemukan dan mengikuti pelatihan, mengakses materi, mengerjakan tugas, memperoleh evaluasi, memantau progress, dan berdiskusi.

Admin/Trainer membutuhkan mekanisme untuk membuat pelatihan, menyusun modul, menambahkan PDF/video/artikel, membuat kuis opsional, membuat tugas, menilai submission, memberikan feedback, dan memantau peserta.

## 3. Goals

1. Menyediakan portal pelatihan internal terpusat.
2. Memudahkan karyawan menemukan dan menyelesaikan pelatihan.
3. Mendukung materi PDF, video, dan artikel/rich text.
4. Mendukung kuis pilihan ganda opsional pada akhir modul.
5. Mendukung tugas/submission dan evaluasi.
6. Menyediakan tracking progress otomatis.
7. Menyediakan forum diskusi dua arah.
8. Memudahkan Admin mengelola konten pelatihan.

## 4. Roles

### Karyawan
Melihat katalog, mengikuti pelatihan, membaca/menonton materi, mengerjakan kuis, mengumpulkan tugas, melihat nilai/feedback, melihat progress, berdiskusi, dan mengelola profil.

### Admin/Trainer
Membuat/mengelola pelatihan, modul, materi, kuis, tugas, submission, evaluasi, progress peserta, dan forum.

## 5. Navigation

Navbar global berada di atas, bukan sidebar:

```text
[TrainHub]  Home  Pelatihan  Progress  Forum Diskusi       [Search] [Avatar]
```

Menu utama:
- Home
- Pelatihan
- Progress
- Forum Diskusi

Sidebar hanya digunakan pada halaman kelas sebagai navigasi modul pembelajaran.

## 6. Information Architecture

```text
Karyawan
Home
├── Ringkasan
├── Pelatihan Berlangsung
├── Tugas Perlu Dikumpulkan
└── Aktivitas Terbaru

Pelatihan
├── Semua
├── Sedang Diikuti
├── Belum Diikuti
└── Telah Selesai

Detail Pelatihan
├── Overview
├── Mentor
├── Curriculum / Modul
├── Resources
├── Achievement
├── Skills
├── Submission History
├── Exam History
└── Forum

Kelas
├── Modul
│   ├── Artikel
│   ├── PDF
│   ├── Video
│   └── Kuis Opsional
├── Tugas
└── Ujian Akhir

Progress
├── Statistik
└── Progress per Pelatihan

Forum Diskusi
├── Semua Thread
├── Search/Filter
├── Buat Thread
└── Detail Thread

Profil
├── Informasi
├── Achievement
├── Sertifikat
├── Kelas Selesai
└── Kelas Berlangsung
```

## 7. MVP Features

### 7.1 Home/Dashboard
Menampilkan:
- jumlah pelatihan sedang diikuti;
- tugas yang perlu dikumpulkan;
- capaian/progress keseluruhan;
- pelatihan selesai;
- pelatihan yang sedang berjalan;
- tugas terdekat;
- aktivitas terbaru.

### 7.2 Katalog Pelatihan
Daftar course card berisi cover, judul, kategori, level, mentor, durasi, status, dan progress.

Tersedia search bar dan filter:
- Semua Pelatihan;
- Sedang Diikuti;
- Belum Diikuti;
- Telah Selesai;
- kategori/jenis;
- level.

### 7.3 Detail Pelatihan
Berisi judul, deskripsi, mentor, overview, curriculum, resources, skills, achievement, durasi, level, dan CTA `Start Course`/`Continue Course`.

Tersedia card riwayat submission/tugas, riwayat ujian, dan forum diskusi.

### 7.4 Halaman Kelas
Layout dua area: sidebar modul + content viewer.

Sidebar menggunakan accordion dan menampilkan progress modul. Setiap submateri mempunyai indikator status/progress.

Tracking progress:
- artikel: dapat selesai setelah pengguna mencapai bagian akhir halaman;
- video: progress playback dapat digunakan dan selesai setelah threshold yang ditetapkan;
- PDF: selesai setelah kondisi penyelesaian yang ditetapkan sistem.

Di akhir pelatihan tersedia ujian akhir.

### 7.5 Materi
Admin dapat menambahkan:

**PDF** — upload file, judul, deskripsi.

**Video** — upload file atau sumber URL yang didukung, judul, deskripsi.

**Article/Rich Text** — editor dengan:
- Heading 1;
- Heading 2;
- Heading 3;
- Normal/Paragraph;
- Bold;
- Italic;
- Underline;
- bulleted list;
- numbered list;
- link;
- blockquote.

### 7.6 Kuis Modul
Kuis bersifat opsional. Admin dapat memilih menambahkan atau tidak.

MVP menggunakan single-choice multiple choice:
- pertanyaan;
- beberapa opsi;
- satu jawaban benar;
- skor.

Sistem menghitung hasil kuis secara otomatis.

### 7.7 Assignment/Submission
Admin dapat membuat:
- judul;
- instruksi;
- deadline;
- reference attachment opsional;
- status aktif/nonaktif.

Karyawan dapat melihat instruksi, mengirim jawaban/file, dan melihat status.

Admin dapat melihat submission, memberi nilai, dan feedback.

Status:
- Belum Dikumpulkan;
- Sudah Dikumpulkan;
- Dinilai;
- Terlambat.

### 7.8 Progress
Ringkasan:
- jumlah pelatihan selesai;
- rata-rata nilai;
- total tugas dinilai;
- jam pembelajaran.

Progress per course menampilkan persentase, modul selesai, nilai, status, dan aktivitas terakhir.

### 7.9 Forum Diskusi
Semua thread dari berbagai pelatihan dapat ditampilkan dalam satu halaman.

Fitur:
- search;
- filter pelatihan;
- buat thread;
- buka thread;
- balas thread;
- author;
- timestamp;
- jumlah balasan.

### 7.10 Profil
Berisi foto, nama, headline/title jabatan, tentang saya, achievement, sertifikat, kelas selesai, dan kelas sedang berlangsung.

## 8. Admin CRUD

### Training
Admin dapat membuat, mengubah, dan mengarsipkan pelatihan.

Field utama:
- cover;
- title;
- description;
- category;
- level;
- mentor;
- duration;
- skills;
- achievement;
- status.

### Module
Admin dapat menambah, mengubah, mengurutkan, dan mengarsipkan modul.

### Material
Admin dapat menambah, mengubah, mengurutkan, dan mengarsipkan PDF, video, atau artikel.

### Quiz
Admin dapat mengaktifkan/nonaktifkan kuis, menambah soal, opsi, jawaban benar, dan skor.

### Assignment
Admin dapat membuat/mengubah tugas, instruksi, deadline, attachment, melihat submission, menilai, dan memberi feedback.

## 9. Functional Requirements

| ID | Requirement | Actor |
|---|---|---|
| FR-01 | Login/logout | Karyawan, Admin |
| FR-02 | Role-based authorization | Sistem |
| FR-03 | Melihat dashboard | Karyawan, Admin |
| FR-04 | Melihat katalog pelatihan | Karyawan |
| FR-05 | Search pelatihan | Karyawan |
| FR-06 | Filter pelatihan | Karyawan |
| FR-07 | Melihat detail pelatihan | Karyawan |
| FR-08 | Mengikuti pelatihan | Karyawan |
| FR-09 | Mencatat enrollment | Sistem |
| FR-10 | Membuat pelatihan | Admin |
| FR-11 | Mengubah/mengarsipkan pelatihan | Admin |
| FR-12 | Membuat modul | Admin |
| FR-13 | Menambahkan PDF | Admin |
| FR-14 | Menambahkan video | Admin |
| FR-15 | Membuat artikel rich text | Admin |
| FR-16 | Mengatur urutan materi | Admin |
| FR-17 | Menambahkan kuis opsional | Admin |
| FR-18 | Mengerjakan kuis | Karyawan |
| FR-19 | Menghitung hasil kuis | Sistem |
| FR-20 | Membuat tugas | Admin |
| FR-21 | Menulis instruksi tugas | Admin |
| FR-22 | Mengumpulkan tugas | Karyawan |
| FR-23 | Melihat submission | Admin |
| FR-24 | Memberi nilai | Admin |
| FR-25 | Memberi feedback | Admin |
| FR-26 | Melihat evaluasi | Karyawan |
| FR-27 | Tracking progress materi | Sistem |
| FR-28 | Melihat progress keseluruhan | Karyawan |
| FR-29 | Melihat progress per pelatihan | Karyawan |
| FR-30 | Membuat thread diskusi | Karyawan, Admin |
| FR-31 | Membalas diskusi | Karyawan, Admin |
| FR-32 | Melihat forum lintas pelatihan | Karyawan, Admin |
| FR-33 | Melihat/mengelola profil | Karyawan, Admin |
| FR-34 | Melihat achievement/sertifikat | Karyawan |
| FR-35 | Melihat riwayat kelas | Karyawan |

## 10. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | Berbasis web |
| NFR-02 | Responsive desktop/tablet/mobile |
| NFR-03 | UI sederhana, konsisten, mudah dipindai |
| NFR-04 | Navbar global di atas |
| NFR-05 | Sidebar hanya untuk navigasi modul kelas |
| NFR-06 | Authorization pada endpoint sensitif |
| NFR-07 | Validasi client dan server |
| NFR-08 | Validasi tipe/ukuran file upload |
| NFR-09 | Loading, empty, success, dan error state tersedia |
| NFR-10 | Mencegah duplikasi enrollment/submission sesuai business rule |
| NFR-11 | Password disimpan menggunakan hashing |
| NFR-12 | Critical flow memiliki test case |
| NFR-13 | Tidak ada defect Critical pada release MVP |
| NFR-14 | Requirement dapat ditelusuri ke test case |
| NFR-15 | Separation of concerns dan pendekatan berbasis objek diterapkan |

## 11. Out of Scope

- Chat realtime;
- video conference;
- AI recommendation;
- HRIS/SSO;
- gamifikasi kompleks;
- multi-tenant;
- analytics enterprise;
- live streaming;
- mobile native app.

Sertifikat otomatis bukan fitur inti MVP.

## 12. Critical User Journey

```text
Login
→ Home Dashboard
→ Pelatihan
→ Search/Filter
→ Detail Pelatihan
→ Start Course
→ Modul
→ Materi
→ Progress Tracking
→ Kuis Opsional
→ Tugas
→ Submission
→ Evaluasi
→ Ujian Akhir
→ Selesai
→ Achievement
```

## 13. Admin Content Journey

```text
Login Admin
→ Dashboard
→ Kelola Pelatihan
→ Tambah Pelatihan
→ Tambah Modul
→ Tambah Materi
   ├─ PDF
   ├─ Video
   └─ Article/Rich Text
→ Opsional: Tambah Kuis
→ Tambah Tugas
→ Publish
```

## 14. Success Criteria

MVP dianggap berhasil jika seluruh critical journey berjalan, materi dapat digunakan dalam tiga format, kuis opsional dapat dibuat/dikerjakan, tugas dapat dikumpulkan dan dinilai, progress dapat dihitung, forum dapat digunakan, dan tidak terdapat defect Critical yang menghambat alur utama.
