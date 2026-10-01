# TrainHub — Object-Oriented Analysis

## Candidate Class → Responsibility

| Class | Responsibility |
|---|---|
| User | Akun pengguna |
| Karyawan | Role peserta |
| TrainerAdmin | Role pengelola |
| Training | Data pelatihan |
| Enrollment | Keikutsertaan peserta |
| Material | Materi pelatihan |
| ProgressMateri | Status penyelesaian materi |
| Assignment | Tugas pelatihan |
| Submission | Pengumpulan tugas |
| Evaluation | Nilai dan feedback |
| Discussion | Topik diskusi |
| DiscussionReply | Balasan diskusi |
| AuthService | Autentikasi |
| TrainingService | Business logic training |
| EnrollmentService | Business logic enrollment |
| MaterialService | Business logic materi |
| ProgressService | Progress |
| AssignmentService | Tugas/submission |
| EvaluationService | Evaluasi |
| DiscussionService | Diskusi |

## Attribute & Operation

### User
Attributes: `id, name, email, passwordHash, role`  
Operations: `authenticate(), logout()`

### Training
Attributes: `id, title, description, status, startDate, endDate, createdBy`  
Operations: `create(), update(), delete(), publish()`

### Enrollment
Attributes: `id, userId, trainingId, enrolledAt, status`  
Operations: `enroll(), cancel()`

### Material
Attributes: `id, trainingId, title, content, sequenceNumber`  
Operations: `create(), update(), delete(), view()`

### ProgressMateri
Attributes: `id, userId, materialId, status, completedAt`  
Operations: `markAsCompleted()`

### Assignment
Attributes: `id, trainingId, title, instruction, deadline`  
Operations: `create(), update(), delete()`

### Submission
Attributes: `id, assignmentId, userId, content, fileUrl, submittedAt, status`  
Operations: `submit()`

### Evaluation
Attributes: `id, submissionId, evaluatorId, score, feedback, evaluatedAt`  
Operations: `evaluate()`

### Discussion
Attributes: `id, trainingId, createdBy, title, content`  
Operations: `create(), update()`

### DiscussionReply
Attributes: `id, discussionId, createdBy, content`  
Operations: `reply()`

## Relationship & Multiplicity
| Relationship | Multiplicity |
|---|---|
| User — Enrollment | 1 : * |
| Training — Enrollment | 1 : * |
| Training — Material | 1 : * |
| User — ProgressMateri | 1 : * |
| Material — ProgressMateri | 1 : * |
| Training — Assignment | 1 : * |
| Assignment — Submission | 1 : * |
| User — Submission | 1 : * |
| Submission — Evaluation | 1 : 0..1 |
| User — Evaluation | 1 : * |
| Training — Discussion | 1 : * |
| Discussion — DiscussionReply | 1 : * |
| User — Discussion | 1 : * |
| User — DiscussionReply | 1 : * |

## Inheritance
```text
User
├── Karyawan
└── TrainerAdmin
```

Pada MVP, inheritance konseptual dapat direpresentasikan melalui `users.role`.

## Composition
```text
Training ◆── Material
Training ◆── Assignment
Discussion ◆── DiscussionReply
```

## Association
User terhadap Enrollment, Submission, Evaluation, Discussion, dan DiscussionReply merupakan association.

## Business Rules
- BR-01: Enrollment aktif tidak boleh duplikat.
- BR-02: Peserta hanya mengakses aktivitas training yang diikutinya.
- BR-03: Materi hanya dapat ditandai selesai oleh peserta terkait.
- BR-04: Submission hanya untuk peserta training terkait.
- BR-05: Submission mengikuti deadline.
- BR-06: Evaluasi hanya oleh Trainer/Admin berwenang.
- BR-07: Satu submission maksimal satu evaluasi aktif.
- BR-08: Diskusi dan balasan berada dalam konteks training.
- BR-09: Progress dihitung dari aktivitas pelatihan.
