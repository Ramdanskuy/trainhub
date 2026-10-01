# TrainHub — System Design, API & UI/UX

## Arsitektur
```text
Presentation
    ↓
Controller
    ↓
Service
    ↓
Entity
    ↓
Repository
    ↓
Database
```

UI tidak mengakses database langsung. Controller menangani request/response, Service business logic, Repository data access, Entity domain, Middleware authentication/authorization, dan Validator validasi input.

## Struktur Project
```text
trainhub/
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── layouts/
│   ├── services/
│   └── assets/
├── backend/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── entities/
│   ├── routes/
│   ├── middleware/
│   └── validators/
├── database/
│   ├── migrations/
│   └── seeders/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── docs/
```

## Information Architecture

### Karyawan
```text
Dashboard
├── Pelatihan Saya
│   └── Detail Pelatihan
│       ├── Materi
│       ├── Tugas
│       ├── Diskusi
│       └── Progress
└── Profil
```

### Trainer/Admin
```text
Dashboard
├── Kelola Pelatihan
│   └── Detail Pelatihan
│       ├── Materi
│       ├── Tugas
│       ├── Peserta
│       ├── Submission
│       ├── Evaluasi
│       └── Diskusi
└── Profil
```

## API

### Auth
```http
POST /api/auth/login
POST /api/auth/logout
```

### Training
```http
GET    /api/trainings
GET    /api/trainings/:id
POST   /api/trainings
PUT    /api/trainings/:id
DELETE /api/trainings/:id
```

### Enrollment
```http
POST /api/trainings/:id/enroll
GET /api/my/trainings
```

### Material
```http
GET /api/trainings/:id/materials
POST /api/trainings/:id/materials
PUT /api/materials/:id
```

### Progress
```http
POST /api/materials/:id/complete
GET /api/trainings/:id/progress
```

### Assignment
```http
GET /api/trainings/:id/assignments
POST /api/trainings/:id/assignments
POST /api/assignments/:id/submit
```

### Evaluation
```http
GET /api/submissions/:id
POST /api/submissions/:id/evaluate
```

### Discussion
```http
GET /api/trainings/:id/discussions
POST /api/trainings/:id/discussions
POST /api/discussions/:id/replies
```

## Standard Response

```json
{
  "success": true,
  "message": "Operasi berhasil",
  "data": {}
}
```

```json
{
  "success": false,
  "message": "Data tidak valid",
  "errors": {}
}
```

## HTTP Status
| Status | Penggunaan |
|---|---|
| 200 | Berhasil |
| 201 | Berhasil membuat data |
| 400 | Request tidak valid |
| 401 | Belum login |
| 403 | Tidak berwenang |
| 404 | Tidak ditemukan |
| 409 | Konflik/duplikasi |
| 422 | Validation error |
| 500 | Internal server error |

## Authorization Matrix
| Fitur | Karyawan | Trainer/Admin |
|---|---:|---:|
| Login | ✓ | ✓ |
| Lihat training | ✓ | ✓ |
| Enrollment | ✓ | — |
| CRUD training | — | ✓ |
| Lihat material | ✓ | ✓ |
| CRUD material | — | ✓ |
| Complete material | ✓ | — |
| Lihat assignment | ✓ | ✓ |
| CRUD assignment | — | ✓ |
| Submit | ✓ | — |
| Lihat submission | Milik sendiri | ✓ |
| Evaluasi | — | ✓ |
| Lihat evaluasi | ✓ | ✓ |
| Diskusi | ✓ | ✓ |
| Balasan | ✓ | ✓ |
| Progress | Milik sendiri | ✓ |

## UI/UX Principles
- Navigasi berbasis konteks training.
- Progress mudah dipahami.
- CTA jelas.
- Error dekat input.
- Menu mengikuti role.
- Loading, empty, success, error state tersedia.
- Komponen konsisten.
- Responsive.

## Halaman Kunci
1. Login
2. Dashboard Karyawan
3. Dashboard Trainer/Admin
4. Daftar Training
5. Detail Training
6. Materi
7. Tugas
8. Submission
9. Evaluasi
10. Diskusi
11. Progress
12. Kelola Training
13. Kelola Materi
14. Kelola Tugas
