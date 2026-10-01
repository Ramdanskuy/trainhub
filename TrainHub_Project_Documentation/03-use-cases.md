# TrainHub — Use Case Specification

## Aktor
### Aktor Kunci
- **Karyawan** — aktor utama proses pembelajaran.
- **Trainer/Admin** — aktor utama pengelolaan dan evaluasi.

Penempatan aktor pada diagram dapat mengikuti aturan dosen: sisi utama untuk aktor kunci dan sisi berlawanan untuk aktor pendukung. Pada TrainHub MVP, Karyawan dan Trainer/Admin sama-sama merupakan aktor inti yang memiliki use case berbeda.

## Daftar Use Case
| ID | Use Case | Aktor |
|---|---|---|
| UC-01 | Login | Karyawan, Trainer/Admin |
| UC-02 | Mengikuti Pelatihan | Karyawan |
| UC-03 | Mengakses Materi | Karyawan |
| UC-04 | Menyelesaikan Materi | Karyawan |
| UC-05 | Mengumpulkan Tugas | Karyawan |
| UC-06 | Melihat Progress | Karyawan |
| UC-07 | Memberikan Evaluasi | Trainer/Admin |
| UC-08 | Mengelola Pelatihan | Trainer/Admin |
| UC-09 | Mengelola Materi | Trainer/Admin |
| UC-10 | Mengelola Tugas | Trainer/Admin |
| UC-11 | Membuat Diskusi | Karyawan, Trainer/Admin |
| UC-12 | Membalas Diskusi | Karyawan, Trainer/Admin |
| UC-13 | Melihat Submission | Trainer/Admin |

## Relasi Include/Extend
- Proses submission meng-include validasi enrollment dan deadline.
- Proses evaluasi meng-include validasi score.
- CRUD dapat dipecah menjadi create/read/update/delete bila diagram membutuhkan detail.

## Use Case Detail

### UC-01 Login
**Precondition:** User memiliki akun.

**Main Flow:** User memasukkan email/password → sistem validasi → session/token dibuat → dashboard.

**Alternative:** Kredensial salah → error.

### UC-02 Mengikuti Pelatihan
Karyawan memilih training → sistem memeriksa enrollment → enrollment dibuat jika belum ada → status terdaftar.

### UC-03 Mengakses Materi
Karyawan memilih training → memilih materi → sistem menampilkan materi.

### UC-04 Menyelesaikan Materi
Karyawan membuka materi → klik selesai → sistem mencatat progress → progress diperbarui.

### UC-05 Mengumpulkan Tugas
Karyawan membuka tugas → melihat instruksi/deadline → mengisi/upload → validasi → submission disimpan.

### UC-06 Melihat Progress
Sistem mengambil aktivitas materi/tugas → menghitung progress → menampilkan capaian.

### UC-07 Memberikan Evaluasi
Trainer/Admin membuka submission → input nilai/feedback → validasi → evaluasi disimpan.

### UC-08–UC-10 Pengelolaan
Trainer/Admin mengelola training, material, dan assignment melalui operasi CRUD.

### UC-11–UC-12 Diskusi
Karyawan atau Trainer/Admin membuat topik dan membalas thread dalam konteks training.

### UC-13 Submission
Trainer/Admin melihat submission peserta pada tugas yang dikelolanya.
