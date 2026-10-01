# TrainHub — Test Plan & QA Strategy

## Tujuan
Memastikan MVP memenuhi requirement, business rule, authorization, validation, dan critical user journey dengan dokumentasi yang dapat ditelusuri.

## Level Testing
1. Unit Test
2. Integration Test
3. System/E2E Test
4. Acceptance Test

## Authentication
| ID | Scenario | Expected |
|---|---|---|
| TC-AUTH-01 | Login valid | Berhasil |
| TC-AUTH-02 | Password salah | Ditolak |
| TC-AUTH-03 | Email tidak terdaftar | Ditolak |
| TC-AUTH-04 | Field kosong | Validation error |

## Enrollment
| ID | Scenario | Expected |
|---|---|---|
| TC-ENR-01 | Enrollment valid | Berhasil |
| TC-ENR-02 | Enrollment duplikat | Ditolak |
| TC-ENR-03 | Training tidak ditemukan | 404 |
| TC-ENR-04 | User tidak berwenang | 403 |

## Material/Progress
| ID | Scenario | Expected |
|---|---|---|
| TC-MAT-01 | Tandai materi selesai | Status berubah |
| TC-MAT-02 | Tidak ikut training | Ditolak |
| TC-MAT-03 | Materi tidak ditemukan | 404 |
| TC-MAT-04 | Progress dihitung | Persentase benar |

## Submission
| ID | Scenario | Expected |
|---|---|---|
| TC-SUB-01 | Submission valid | Tersimpan |
| TC-SUB-02 | Tidak terdaftar | Ditolak |
| TC-SUB-03 | Deadline lewat | Ditolak |
| TC-SUB-04 | Input/file invalid | Validation error |
| TC-SUB-05 | Submission duplikat | Ditangani sesuai aturan |

## Evaluation
| ID | Scenario | Expected |
|---|---|---|
| TC-EVAL-01 | Nilai 85 | Berhasil |
| TC-EVAL-02 | Nilai -1 | Ditolak |
| TC-EVAL-03 | Nilai 101 | Ditolak |
| TC-EVAL-04 | Karyawan menilai | 403 |
| TC-EVAL-05 | Submission tidak ditemukan | 404 |

## Discussion
| ID | Scenario | Expected |
|---|---|---|
| TC-DISC-01 | Diskusi valid | Berhasil |
| TC-DISC-02 | Judul kosong | Ditolak |
| TC-DISC-03 | Balasan valid | Berhasil |
| TC-DISC-04 | Diskusi tidak ditemukan | 404 |

## Boundary Value Analysis
### Score
Valid: `0`, `50`, `100`  
Invalid: `-1`, `101`

### Progress
Valid: `0`, `50`, `100`  
Invalid: `<0`, `>100`

## Equivalence Partitioning
Score:
- `<0` invalid
- `0–100` valid
- `>100` invalid

Email:
- format salah = invalid
- format benar = valid

## Authorization
- Karyawan tidak dapat CRUD training/material/assignment.
- Karyawan tidak dapat memberi evaluasi.
- Trainer/Admin dapat mengelola sesuai role.
- User tidak dapat mengakses data yang bukan kewenangannya.

## Critical E2E
```text
Login Karyawan
→ Dashboard
→ Training
→ Enrollment
→ Materi
→ Complete
→ Tugas
→ Submit
→ Login Trainer/Admin
→ Lihat Submission
→ Beri Evaluasi
→ Karyawan melihat Evaluasi
→ Karyawan melihat Progress
```

## Severity
| Severity | Contoh |
|---|---|
| Critical | Sistem/login utama tidak dapat digunakan |
| High | Submission/evaluasi gagal total |
| Medium | Behavior salah |
| Low | Minor UI/visual issue |

## Entry Criteria
- Build dapat dijalankan.
- Database tersedia.
- Requirement tersedia.
- Test environment siap.

## Exit Criteria
- Critical test case selesai.
- Tidak ada defect Critical terbuka.
- Defect High diselesaikan atau memiliki keputusan terdokumentasi.
- Regression test berhasil.
- Hasil testing terdokumentasi.
