# TrainHub — Requirement Traceability Matrix

| Requirement | Use Case | Service | API | Test Case |
|---|---|---|---|---|
| FR-01 Login | UC-01 | AuthService | POST /api/auth/login | TC-AUTH-01..04 |
| FR-02 Role access | UC-01 | Auth/Middleware | Protected API | TC-SEC |
| FR-03 Lihat training | UC-02/03 | TrainingService | GET /api/trainings | TC-TRAIN |
| FR-04 Enrollment | UC-02 | EnrollmentService | POST /api/trainings/:id/enroll | TC-ENR-01..04 |
| FR-05 CRUD training | UC-08 | TrainingService | /api/trainings | TC-TRAIN-CRUD |
| FR-06 CRUD material | UC-09 | MaterialService | /api/materials | TC-MAT-CRUD |
| FR-07 Akses material | UC-03 | MaterialService | GET /api/trainings/:id/materials | TC-MAT |
| FR-08 Complete material | UC-04 | ProgressService | POST /api/materials/:id/complete | TC-MAT-01..03 |
| FR-09 CRUD assignment | UC-10 | AssignmentService | /api/assignments | TC-ASSIGN-CRUD |
| FR-10 Lihat tugas | UC-05 | AssignmentService | GET /api/trainings/:id/assignments | TC-ASSIGN |
| FR-11 Submit | UC-05 | AssignmentService | POST /api/assignments/:id/submit | TC-SUB-01..05 |
| FR-12 Lihat submission | UC-13 | AssignmentService | GET /api/submissions/:id | TC-SUB-VIEW |
| FR-13 Nilai | UC-07 | EvaluationService | POST /api/submissions/:id/evaluate | TC-EVAL-01..05 |
| FR-14 Feedback | UC-07 | EvaluationService | POST /api/submissions/:id/evaluate | TC-EVAL |
| FR-15 Lihat evaluasi | UC-07 | EvaluationService | GET /api/submissions/:id | TC-EVAL-VIEW |
| FR-16 Diskusi | UC-11 | DiscussionService | POST /api/trainings/:id/discussions | TC-DISC-01..02 |
| FR-17 Balasan | UC-12 | DiscussionService | POST /api/discussions/:id/replies | TC-DISC-03..04 |
| FR-18 Progress | UC-06 | ProgressService | GET /api/trainings/:id/progress | TC-PROG |

## Traceability Chain
```text
Requirement
→ Use Case
→ Class/Service
→ API
→ Test Case
→ Test Result
```
