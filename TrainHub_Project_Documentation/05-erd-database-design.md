# TrainHub — ERD & Database Design

## Tabel
1. `users`
2. `trainings`
3. `enrollments`
4. `materials`
5. `material_progress`
6. `assignments`
7. `submissions`
8. `evaluations`
9. `discussions`
10. `discussion_replies`

## Schema

### users
```text
id PK
name
email UNIQUE
password_hash
role
created_at
updated_at
```

### trainings
```text
id PK
title
description
status
start_date
end_date
created_by FK -> users.id
created_at
updated_at
```

### enrollments
```text
id PK
user_id FK -> users.id
training_id FK -> trainings.id
enrolled_at
status
created_at
updated_at
UNIQUE(user_id, training_id)
```

### materials
```text
id PK
training_id FK -> trainings.id
title
content
sequence_number
created_at
updated_at
UNIQUE(training_id, sequence_number)
```

### material_progress
```text
id PK
user_id FK -> users.id
material_id FK -> materials.id
status
completed_at
created_at
updated_at
UNIQUE(user_id, material_id)
```

### assignments
```text
id PK
training_id FK -> trainings.id
title
instruction
deadline
created_at
updated_at
```

### submissions
```text
id PK
assignment_id FK -> assignments.id
user_id FK -> users.id
content
file_url
submitted_at
status
created_at
updated_at
```

### evaluations
```text
id PK
submission_id FK -> submissions.id
evaluator_id FK -> users.id
score
feedback
evaluated_at
created_at
updated_at
UNIQUE(submission_id)
```

### discussions
```text
id PK
training_id FK -> trainings.id
created_by FK -> users.id
title
content
created_at
updated_at
```

### discussion_replies
```text
id PK
discussion_id FK -> discussions.id
created_by FK -> users.id
content
created_at
updated_at
```

## Relationship
```text
users 1 --- * trainings
users 1 --- * enrollments
trainings 1 --- * enrollments
trainings 1 --- * materials
users 1 --- * material_progress
materials 1 --- * material_progress
trainings 1 --- * assignments
assignments 1 --- * submissions
users 1 --- * submissions
submissions 1 --- 0..1 evaluations
users 1 --- * evaluations
trainings 1 --- * discussions
discussions 1 --- * discussion_replies
users 1 --- * discussions
users 1 --- * discussion_replies
```

## Derived Data
```text
progress = jumlah materi selesai / jumlah materi × 100
```

## Integrity Rules
- Email unik.
- Enrollment user-training unik.
- Progress user-material unik.
- Sequence materi unik per training.
- Score 0–100.
- Satu submission maksimal satu evaluasi.
- Foreign key menjaga referential integrity.

## Deletion
Training yang sudah digunakan sebaiknya tidak dihapus permanen melalui UI. Gunakan status/arsip untuk menjaga histori.
