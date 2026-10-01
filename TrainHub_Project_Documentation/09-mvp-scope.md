# TrainHub — MVP Scope

## Core Features
- Authentication: login/logout.
- Role Karyawan dan Trainer/Admin.
- Training: daftar, detail, enrollment, CRUD.
- Material: CRUD, baca, complete.
- Assignment: CRUD, lihat, submit, lihat submission.
- Evaluation: score, feedback, lihat hasil.
- Discussion: buat, lihat, balas.
- Progress: progress materi dan keseluruhan.

## Out of Scope
- Native mobile app.
- Video conference.
- Chat real-time kompleks.
- Gamification.
- Sertifikat otomatis.
- HRIS/SSO.
- Multi-tenant.
- Analytics tingkat lanjut.
- AI recommendation.

## Critical Journey
```text
Login
→ Training
→ Enrollment
→ Material
→ Complete
→ Assignment
→ Submit
→ Evaluation
→ Progress
```

## Definition of Done
1. Requirement jelas.
2. UI tersedia.
3. API tersedia.
4. Business rule diterapkan.
5. Validation tersedia.
6. Authorization diuji.
7. Unit test business logic utama tersedia.
8. Integration test endpoint penting tersedia.
9. Critical E2E berhasil.
10. Tidak ada defect Critical terbuka.
