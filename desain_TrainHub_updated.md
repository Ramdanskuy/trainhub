# TrainHub — UI/UX Design Specification

## 1. Design Direction

TrainHub menggunakan pendekatan **learning dashboard**, bukan landing page.

Referensi visual utamanya adalah dashboard platform pembelajaran seperti Cisco Networking Academy: navbar horizontal di bagian atas, course card sederhana, progress indicator, informasi padat tetapi mudah dipindai, whitespace cukup, dan fokus pada aktivitas belajar.

Navigasi global **tidak menggunakan sidebar**. Sidebar hanya digunakan pada halaman kelas untuk navigasi modul karena halaman tersebut membutuhkan struktur pembelajaran yang lebih dalam.

## 2. Global Layout

```text
┌──────────────────────────────────────────────────────────────────┐
│ TrainHub │ Home │ Pelatihan │ Progress │ Forum Diskusi │ Avatar │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                         PAGE CONTENT                             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

Navbar:
- sticky/fixed di atas;
- background putih;
- border bawah tipis;
- logo TrainHub di kiri;
- menu utama horizontal;
- utility/search dan avatar di kanan.

Menu:
1. Home
2. Pelatihan
3. Progress
4. Forum Diskusi

Avatar membuka dropdown Profil dan Logout.

## 3. Visual Style

Karakter visual:
- sederhana;
- profesional;
- modern;
- ringan;
- fokus pada pembelajaran;
- tidak terlalu dekoratif.

Hindari gradient berlebihan, hero marketing besar, dekorasi yang tidak membantu task, dan card dengan radius terlalu besar.

### Color Tokens

| Token | Value | Penggunaan |
|---|---|---|
| Primary | `#16A34A` | CTA, active state, progress |
| Primary Dark | `#15803D` | hover/pressed |
| Primary Soft | `#DCFCE7` | badge/status |
| Text Primary | `#111827` | heading |
| Text Secondary | `#6B7280` | description |
| Border | `#E5E7EB` | border/divider |
| Background | `#F8FAFC` | page background |
| Surface | `#FFFFFF` | card |
| Warning | `#F59E0B` | deadline |
| Danger | `#DC2626` | error |
| Info | `#2563EB` | informational state |

## 4. Typography

Gunakan Inter, system-ui, atau sans-serif modern setara.

| Style | Size | Weight |
|---|---:|---:|
| Display | 32px | 700 |
| H1 | 28px | 700 |
| H2 | 22px | 650 |
| H3 | 18px | 600 |
| Body | 14–16px | 400 |
| Small | 12–13px | 400 |
| Label | 12–14px | 500–600 |

Artikel mendukung Heading 1, Heading 2, Heading 3, Normal, Bold, Italic, Underline, list, link, dan blockquote.

## 5. Components

### Card
White background, border 1px, radius 10–14px, shadow sangat ringan, padding 20–24px.

### Button
```text
[ Start Course ]
[ Continue Learning ]
[ View Details ]
[ Delete ]
```

### Badge
```text
BEGINNER   IN PROGRESS   COMPLETED   NEW   DUE SOON
```

### Progress
Gunakan linear progress untuk course/module dan circular progress untuk submateri bila dibutuhkan.

## 6. Home / Dashboard

Header:
```text
Good morning, Ramdan
Continue your learning journey.
```

Summary cards:
```text
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 4            │ │ 2            │ │ 72%          │ │ 3            │
│ Pelatihan    │ │ Tugas perlu  │ │ Capaian      │ │ Pelatihan    │
│ diikuti      │ │ dikumpulkan  │ │ keseluruhan  │ │ selesai      │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

Section:
- Continue Learning;
- Upcoming Tasks;
- Recent Activity.

Continue card:
```text
[Cover]  Introduction to Data Science
         Module 3 of 6
         ███████████░░ 72%
         [Continue Learning]
```

## 7. Pelatihan / Catalog

Header:
```text
Pelatihan
Temukan pelatihan untuk meningkatkan kemampuanmu.
```

Search dan filter:
```text
[ Search pelatihan... ]
[ Semua ] [ Sedang Diikuti ] [ Belum Diikuti ] [ Telah Selesai ]
Kategori: [ All Categories ▼ ]   Level: [ All Levels ▼ ]
```

Course grid desktop 3–4 kolom. Card menampilkan cover, level, title, description, category, mentor, duration, status, dan progress jika sudah diikuti.

## 8. Detail Pelatihan

```text
┌───────────────────────────────────────────────────────────────┐
│ Breadcrumb                                                    │
│ Introduction to Data Science                                  │
│ Learn the fundamentals of data science...                    │
│ Mentor · Beginner · 6 Hours                                  │
│ [ Start Course ]                                             │
├───────────────────────────────────────┬───────────────────────┤
│ Overview                              │ Achievement            │
│ Curriculum                            │ Skills you'll gain     │
│ Resources                             │ • Data Analysis        │
└───────────────────────────────────────┴───────────────────────┘
│ Submission History · Exam History · Discussion                │
└───────────────────────────────────────────────────────────────┘
```

Tab utama: Overview, Curriculum, Resources.

CTA:
- `Start Course` jika belum mulai;
- `Continue Course` jika sedang berjalan;
- `Review Course` jika selesai.

## 9. Halaman Kelas

Halaman kelas menggunakan sidebar khusus modul.

```text
┌───────────────────┬─────────────────────────────────────────────┐
│ Course            │                                             │
│ 72% Complete      │               Content Area                  │
│ █████████░░       │                                             │
│                   │ Introduction                                │
│ ▼ Module 1        │ Text / PDF / Video                         │
│   ✓ Introduction  │                                             │
│   ✓ Basic Concept │                                             │
│   ○ Quiz          │                                             │
│                   │                                             │
│ ▼ Module 2        │                                             │
│   ✓ Data          │                                             │
│   ○ Storage       │                                             │
│   ○ Quiz          │                                             │
│                   │                                             │
│ ▼ Final Exam      │                                             │
└───────────────────┴─────────────────────────────────────────────┘
```

Sidebar menggunakan accordion. Status submateri:
- ✓ selesai;
- active/current;
- ○ belum selesai;
- locked bila prerequisite digunakan.

Progress submateri ditrack berdasarkan aktivitas pengguna. Artikel dapat selesai setelah mencapai bagian akhir, video berdasarkan progress playback, dan PDF berdasarkan kondisi penyelesaian yang ditetapkan sistem.

## 10. Material Viewer

### Article
Mode Admin menyediakan toolbar:
```text
[H1] [H2] [H3] [Normal] [B] [I] [U] [List] [Link] [Quote]
```

Mode Karyawan hanya reader. Content width sekitar 720–760px dengan line-height nyaman.

### PDF
Gunakan viewer dengan toolbar halaman/zoom.

### Video
Gunakan player dengan progress playback. Progress dapat disimpan ke sistem.

## 11. Admin Dashboard

Admin tetap menggunakan navbar atas.

```text
Kelola Pelatihan
[ + Tambah Pelatihan ]

Search...
Filter Category   Filter Status

┌─────────────────────────────────────────────────────────────┐
│ Course │ Category │ Participants │ Status │ Actions          │
└─────────────────────────────────────────────────────────────┘
```

Actions: View, Edit, Manage Content, Archive.

## 12. Admin — Create/Edit Training

### Basic Information
- Cover;
- Title;
- Description;
- Category;
- Level;
- Mentor;
- Duration;
- Skills;
- Achievement;
- Status.

### Curriculum Builder
```text
Module 1
  ├── Article
  ├── PDF
  ├── Video
  └── Quiz (Optional)

[ + Add Module ]
```

### Add Material
```text
Choose material type:
[ Article ] [ PDF ] [ Video ]
```

### Article Editor
```text
Title
[____________________________]

[H1] [H2] [H3] [Normal] [B] [I] [U] [List] [Link] [Quote]

┌──────────────────────────────────────────┐
│ Write your lesson content...             │
└──────────────────────────────────────────┘

[Save Material]
```

### PDF
```text
Material Title
[____________________________]
[ Upload PDF ]
File: lesson-01.pdf
Size: 2.4 MB
[Save Material]
```

### Video
```text
Material Title
[____________________________]
Video source:
( ) Upload Video
( ) Video URL
[Upload / Enter URL]
[Save Material]
```

## 13. Admin — Quiz Builder

Kuis hanya dibuat jika Admin memilih opsi `Tambah Kuis`.

```text
Module 1 Quiz
[ + Add Question ]

Question 1
[ What is data science? ]
○ A. ...
○ B. ...
○ C. ...
○ D. ...

Correct Answer: [ B ▼ ]
Score: [ 10 ]
[Save Question]
```

MVP: single choice, satu jawaban benar, skor per soal, submit, dan hasil otomatis.

## 14. Admin — Assignment Builder

```text
Create Assignment

Title
[____________________________]

Instructions
┌──────────────────────────────────────────┐
│ Jelaskan proses data cleaning pada       │
│ dataset yang telah diberikan...          │
└──────────────────────────────────────────┘

Deadline
[ 02 Oct 2026 ]

Reference File (Optional)
[ Upload ]

[Save Assignment]
```

Editor instruksi dapat menggunakan rich text sederhana jika dibutuhkan.

## 15. Submission Review

```text
Assignment: Data Analysis Report
Student: Muhammad Ramdan
Submitted: 1 Oct 2026, 14:20
Status: Submitted

[View Submission]

Score
[ 85 / 100 ]

Feedback
┌──────────────────────────────────────────┐
│ Analisis sudah baik. Tambahkan ...       │
└──────────────────────────────────────────┘

[Save Evaluation]
```

## 16. Progress Page

Header:
```text
Your Learning Progress
Track your learning journey and achievements.
```

Summary:
```text
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 3            │ │ 86           │ │ 8            │ │ 24h          │
│ Completed    │ │ Avg Score    │ │ Tasks Graded │ │ Learning Time│
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

Per course:
```text
Introduction to Data Science
██████████████░░ 72%
12 / 16 lessons
Status: In Progress
[Continue]
```

## 17. Forum Diskusi

```text
Forum Diskusi
Discuss, ask questions, and learn together.

[ Search discussion... ] [ All Courses ▼ ] [ + New Discussion ]
```

Thread card:
```text
How do I interpret this dataset?
Introduction to Data Science
Muhammad Ramdan · 2 hours ago
12 replies
```

Detail thread menampilkan author, timestamp, content, replies, reply input, dan tombol Reply.

## 18. Profile

```text
┌──────────────────────────────────────────────────────┐
│ [Avatar]  Muhammad Ramdan                            │
│           Informatics Student / Developer             │
│           About me...                                │
│           [Edit Profile]                             │
└──────────────────────────────────────────────────────┘
```

Section:
- About;
- Achievements;
- Certificates;
- Completed Classes;
- In Progress Classes.

## 19. Responsive Behavior

Desktop:
- navbar horizontal;
- course grid 3–4 kolom;
- summary cards 4 kolom;
- learning page dengan sidebar.

Tablet:
- course grid 2 kolom;
- summary cards 2 kolom.

Mobile:
- navbar compact/hamburger;
- course card 1 kolom;
- summary cards 1–2 kolom;
- learning sidebar menjadi drawer/bottom sheet;
- content reader full width.

## 20. UX States

Setiap halaman utama memiliki:
- loading/skeleton;
- empty state;
- error state;
- success toast;
- confirmation dialog untuk destructive action.

Contoh empty:
```text
Belum ada pelatihan
Temukan pelatihan yang sesuai dengan kebutuhanmu.
[Explore Training]
```

## 21. Accessibility

- kontras teks memadai;
- label input jelas;
- keyboard navigation dasar;
- focus state terlihat;
- icon bukan satu-satunya penanda status;
- warna tidak menjadi satu-satunya pembeda status.

## 22. Design Principle

TrainHub bukan marketplace kursus dan bukan landing page marketing.

Prioritas:

```text
Learning task
    ↓
Content clarity
    ↓
Progress visibility
    ↓
Action clarity
    ↓
Visual decoration
```

Pengguna harus cepat memahami:
1. Saya sedang belajar apa?
2. Progress saya berapa?
3. Apa yang harus saya lakukan berikutnya?
4. Apakah ada tugas yang harus dikumpulkan?
5. Apa hasil/capaian saya?

## 23. Key Screens

MVP minimal membutuhkan:

1. Login
2. Home/Dashboard
3. Katalog Pelatihan
4. Detail Pelatihan
5. Learning/Class Page
6. Article Viewer
7. PDF Viewer
8. Video Viewer
9. Quiz
10. Assignment
11. Submission
12. Progress
13. Forum
14. Discussion Detail
15. Profile
16. Admin Dashboard
17. Admin Training CRUD
18. Admin Module Builder
19. Admin Material Editor
20. Admin Quiz Builder
21. Admin Assignment Builder
22. Admin Submission Review
