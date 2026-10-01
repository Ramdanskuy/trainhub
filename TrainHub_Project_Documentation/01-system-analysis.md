# TrainHub — System Analysis

## Identitas
- Nama: TrainHub
- Jenis: Portal Pelatihan Karyawan berbasis web
- Pendekatan: Object-Oriented Analysis (OOA)
- Skala: Minimum Viable Product (MVP)

## Studi Kasus
TrainHub adalah portal interaksi dua arah untuk mendukung pelatihan karyawan. Fokus utama sistem adalah interaksi internal, distribusi materi/tugas, serta evaluasi capaian.

## Tujuan Sistem
1. Memusatkan proses pelatihan karyawan dalam satu portal.
2. Memudahkan karyawan mengikuti pelatihan dan memantau capaian.
3. Memudahkan Trainer/Admin mengelola pelatihan, materi, tugas, peserta, dan evaluasi.
4. Menyediakan interaksi dua arah melalui diskusi.
5. Menghasilkan MVP sederhana, stabil, dan mudah diuji.

## Stakeholder
| Stakeholder | Kepentingan |
|---|---|
| Karyawan | Mengikuti pelatihan, materi, tugas, diskusi, evaluasi |
| Trainer/Admin | Mengelola pelatihan, materi, tugas, submission, evaluasi, diskusi |
| Pengelola organisasi | Memantau proses pelatihan |

## Functional Requirements
| ID | Requirement |
|---|---|
| FR-01 | Login dan logout |
| FR-02 | Role Karyawan dan Trainer/Admin |
| FR-03 | Karyawan melihat pelatihan |
| FR-04 | Karyawan mengikuti pelatihan |
| FR-05 | Trainer/Admin CRUD pelatihan |
| FR-06 | Trainer/Admin CRUD materi |
| FR-07 | Karyawan membaca materi |
| FR-08 | Karyawan menandai materi selesai |
| FR-09 | Trainer/Admin CRUD tugas |
| FR-10 | Karyawan melihat tugas |
| FR-11 | Karyawan mengumpulkan tugas |
| FR-12 | Trainer/Admin melihat submission |
| FR-13 | Trainer/Admin memberi nilai |
| FR-14 | Trainer/Admin memberi feedback |
| FR-15 | Karyawan melihat evaluasi |
| FR-16 | Karyawan/Trainer/Admin membuat diskusi |
| FR-17 | Karyawan/Trainer/Admin membalas diskusi |
| FR-18 | Sistem menghitung dan menampilkan progress |

## Non-Functional Requirements
| ID | Requirement |
|---|---|
| NFR-01 | UI sederhana dan konsisten |
| NFR-02 | Input tervalidasi |
| NFR-03 | Authorization berdasarkan role |
| NFR-04 | Password disimpan sebagai hash |
| NFR-05 | HTTP status code konsisten |
| NFR-06 | Duplikasi data dicegah sesuai business rule |
| NFR-07 | Sistem dapat diuji pada unit, integration, dan E2E |
| NFR-08 | Presentation, controller, service, repository, entity terpisah |

## Batasan MVP
### Termasuk
Authentication, dua role, training, enrollment, materi, progress, tugas, submission, evaluasi, diskusi.

### Tidak termasuk
Native mobile app, video conference, chat real-time kompleks, gamifikasi kompleks, sertifikat otomatis, HRIS/SSO, multi-tenant, analytics tingkat lanjut, AI recommendation.
