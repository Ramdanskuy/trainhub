// Seed Data for TrainHub Portal Pelatihan Karyawan

export const initialUsers = [
  {
    id: "usr-1",
    name: "Muhammad Ramdan",
    email: "karyawan@trainhub.com",
    password: "password123",
    role: "karyawan",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    title: "Software Engineer / Lead Frontend",
    department: "IT & Technology",
    bio: "Passionate engineer focusing on modern web apps, UX design systems, and cloud architecture.",
    achievements: [
      { id: "ach-1", title: "Fast Learner", icon: "Zap", description: "Menyelesaikan 3 modul dalam 1 hari" },
      { id: "ach-2", title: "Top Scorer", icon: "Award", description: "Mendapat nilai 100 pada Kuis Data Science" },
      { id: "ach-3", title: "Active Contributor", icon: "MessageSquare", description: "Membuat 5+ diskusi bermanfaat" }
    ]
  },
  {
    id: "usr-2",
    name: "Siti Aminah",
    email: "karyawan2@trainhub.com",
    password: "password123",
    role: "karyawan",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    title: "Data Analyst Specialist",
    department: "Business Intelligence",
    bio: "Suka mengolah data bisnis, visualisasi Tableau, dan machine learning dasar.",
    achievements: [
      { id: "ach-4", title: "Data Wrangler", icon: "Database", description: "Menyelesaikan kelas Data Science" }
    ]
  },
  {
    id: "usr-3",
    name: "Budi Santoso, M.Kom",
    email: "admin@trainhub.com",
    password: "password123",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    title: "Head of Learning & Corporate Development",
    department: "Human Capital",
    bio: "Pengembang program pelatihan karyawan internal berpengalaman 10+ tahun.",
    achievements: []
  }
];

export const initialTrainings = [
  {
    id: "trn-101",
    title: "Introduction to Data Science & Analytics",
    description: "Pelajari fondasi utama analisis data, statistik bisnis, pemrosesan dataset dengan Python, dan visualisasi data interaktif untuk pengambilan keputusan strategis.",
    category: "Data Science",
    level: "Beginner",
    mentor: "Dr. Aris Setiawan",
    mentorTitle: "Senior Data Scientist",
    mentorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    duration: "6 Jam",
    coverUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    status: "published",
    skills: ["Python Data Science", "Pandas & Numpy", "Data Visualization", "Statistical Analysis"],
    achievement: "Certified Data Science Foundation",
    createdAt: "2026-09-01T08:00:00Z"
  },
  {
    id: "trn-102",
    title: "Fullstack Web Development Modern",
    description: "Kuasai pembuatan aplikasi web modern berskala enterprise menggunakan HTML5, CSS Glassmorphism, Tailwind/Vanilla CSS, Javascript ES6+, Node.js, Express, dan REST API.",
    category: "IT & Software",
    level: "Intermediate",
    mentor: "Budi Santoso, M.Kom",
    mentorTitle: "Principal Web Architect",
    mentorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    duration: "12 Jam",
    coverUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    status: "published",
    skills: ["React.js", "Node.js & Express", "RESTful API", "Modern UI/UX Design"],
    achievement: "Certified Fullstack Developer",
    createdAt: "2026-09-05T09:30:00Z"
  },
  {
    id: "trn-103",
    title: "Cybersecurity & Information Protection Fundamentals",
    description: "Memahami prinsip keamanan informasi perusahaan, pencegahan phishing, social engineering, pengamanan API, enkripsi data, dan standar ISO 27001.",
    category: "Security",
    level: "Beginner",
    mentor: "Rina Wijaya, CISSP",
    mentorTitle: "Information Security Officer",
    mentorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    duration: "4 Jam",
    coverUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    status: "published",
    skills: ["Data Protection", "OWASP Top 10", "Phishing Awareness", "Access Control"],
    achievement: "Cyber Aware Professional",
    createdAt: "2026-09-10T11:00:00Z"
  },
  {
    id: "trn-104",
    title: "Effective Communication & Professional Leadership",
    description: "Program khusus pengembangan soft skills, teknik presentasi bisnis, negosiasi tim internal, serta manajemen konflik dalam budaya kerja hibrida modern.",
    category: "Soft Skills",
    level: "Intermediate",
    mentor: "Lestari Putri, M.Psi",
    mentorTitle: "Corporate HR Specialist",
    mentorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    duration: "5 Jam",
    coverUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    status: "published",
    skills: ["Public Speaking", "Cross-team Collaboration", "Conflict Resolution", "Active Listening"],
    achievement: "Leadership Excellence Badge",
    createdAt: "2026-09-15T14:20:00Z"
  }
];

export const initialModules = [
  // Modules for trn-101 (Data Science)
  {
    id: "mod-101-1",
    trainingId: "trn-101",
    title: "Modul 1: Pengenalan Ekosistem Data Science",
    sequenceNumber: 1
  },
  {
    id: "mod-101-2",
    trainingId: "trn-101",
    title: "Modul 2: Pengolahan Dataset & Pembersihan Data",
    sequenceNumber: 2
  },
  {
    id: "mod-101-3",
    trainingId: "trn-101",
    title: "Modul 3: Visualisasi Data & Pelaporan Bisnis",
    sequenceNumber: 3
  },

  // Modules for trn-102 (Web Dev)
  {
    id: "mod-102-1",
    trainingId: "trn-102",
    title: "Modul 1: Fondasi HTML5, CSS modern & Flexbox/Grid",
    sequenceNumber: 1
  },
  {
    id: "mod-102-2",
    trainingId: "trn-102",
    title: "Modul 2: Javascript Async, Fetch API & DOM Manipulation",
    sequenceNumber: 2
  }
];

export const initialMaterials = [
  // Materials for Modul 1 Data Science
  {
    id: "mat-101-1-1",
    moduleId: "mod-101-1",
    trainingId: "trn-101",
    title: "Pengantar Data Science dan Perannya di Industri",
    type: "article",
    sequenceNumber: 1,
    duration: "10 Menit",
    content: `<h1>Selamat Datang di Kursus Data Science</h1><p>Data Science adalah disiplin ilmu gabungan antara pemograman, statistik, dan pengetahuan domain bisnis untuk mengekstraksi wawasan berharga dari sekumpulan data kuantitatif maupun kualitatif.</p><h2>Mengapa Data Science Penting untuk Perusahaan?</h2><p>Di era digital, keputusan berbasis intuisi mulai digantikan oleh <strong>Data-Driven Decision Making</strong>. Beberapa manfaat kunci:</p><ul><li>Optimasi efisiensi operasional internal.</li><li>Prediksi tren permintaan pasar dan preferensi pelanggan.</li><li>Deteksi dini anomali dan risiko keuangan.</li></ul><blockquote><p>"Data is the new oil, but unrefined data cannot be used effectively."</p></blockquote><p>Pada modul ini, Anda akan mempelajari bagaimana pipeline data bekerja mulai dari data ingestion, cleaning, exploratory data analysis (EDA), hingga pemodelan statistik.</p>`
  },
  {
    id: "mat-101-1-2",
    moduleId: "mod-101-1",
    trainingId: "trn-101",
    title: "Panduan Arsitektur & Perangkat Analisis Data (PDF)",
    type: "pdf",
    sequenceNumber: 2,
    duration: "15 Menit",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    fileName: "Data_Science_Architecture_Guide_v1.pdf",
    fileSize: "2.4 MB",
    content: "Dokumen panduan referensi arsitektur pipeline data perusahaan, konfigurasi environment Jupyter Notebook, Anaconda, serta pustaka Pandas & NumPy."
  },
  {
    id: "mat-101-1-3",
    moduleId: "mod-101-1",
    trainingId: "trn-101",
    title: "Video Pembelajaran: Exploratory Data Analysis dalam 15 Menit",
    type: "video",
    sequenceNumber: 3,
    duration: "15 Menit",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    content: "Video tutorial hands-on melakukan inspeksi distribusi data, penanganan missing values, dan deteksi outlier menggunakan histogram dan boxplot."
  },
  {
    id: "mat-101-1-4",
    moduleId: "mod-101-1",
    trainingId: "trn-101",
    title: "Kuis Modul 1: Konsep Dasar Data Analytics",
    type: "quiz",
    sequenceNumber: 4,
    duration: "10 Menit",
    content: "Uji pemahaman Anda mengenai tahapan data science pipeline dan tipe analisis data.",
    quizData: [
      {
        id: "q-101-1",
        question: "Manakah dari tahapan berikut yang biasanya memakan waktu paling banyak dalam proyek Data Science?",
        options: [
          "A. Membuat slide presentasi bisnis",
          "B. Data Cleaning dan Data Preparation",
          "C. Membeli server hardware baru",
          "D. Menginstall teks editor"
        ],
        correctOption: 1, // B
        score: 50,
        explanation: "Tahap data cleaning dan preparation umumnya memakan 70-80% waktu proyek data science karena data mentah sering mengandung null values, format tidak konsisten, atau outlier."
      },
      {
        id: "q-101-2",
        question: "Metode analisis yang bertujuan memprediksi apa yang akan terjadi di masa depan disebut...",
        options: [
          "A. Descriptive Analytics",
          "B. Diagnostic Analytics",
          "C. Predictive Analytics",
          "D. Prescriptive Analytics"
        ],
        correctOption: 2, // C
        score: 50,
        explanation: "Predictive Analytics menggunakan data historis dan algoritma statistik/machine learning untuk memperkirakan kejadian di masa depan."
      }
    ]
  },
  {
    id: "mat-101-1-5",
    moduleId: "mod-101-1",
    trainingId: "trn-101",
    title: "Tugas 1: Analisis Laporan Penjualan Kuartalan",
    type: "assignment",
    sequenceNumber: 5,
    duration: "30 Menit",
    content: "Instruksi Tugas:\n1. Unduh dataset sampel yang diberikan di bawah.\n2. Identifikasi 3 produk dengan pendapatan tertinggi dan 2 produk dengan pengembalian (return) terbanyak.\n3. Tulis ringkasan eksekutif 200-300 kata beserta rekomendasi perbaikan stok.\n4. Unggah jawaban dalam bentuk teks ringkasan dan file PDF/DOCX hasil analisis.",
    assignmentData: {
      deadline: "2026-10-15T23:59:00Z",
      attachmentUrl: "https://example.com/dataset_q3_sales.csv",
      attachmentName: "dataset_q3_sales.csv"
    }
  },

  // Materials for Modul 2 Data Science
  {
    id: "mat-101-2-1",
    moduleId: "mod-101-2",
    trainingId: "trn-101",
    title: "Teknik Pembersihan Data Missing & Duplikat",
    type: "article",
    sequenceNumber: 1,
    duration: "12 Menit",
    content: `<h1>Metode Data Wrangling Modern</h1><p>Dalam modul ini kita mendalami teknik imputasi mean/median, perlakuan kategorikal data, serta penghapusan duplikasi baris tanpa merusak integritas statistik data.</p>`
  },

  // Materials for Web Dev
  {
    id: "mat-102-1-1",
    moduleId: "mod-102-1",
    trainingId: "trn-102",
    title: "Semantik HTML5 dan Pengaturan Tata Letak CSS Grid",
    type: "article",
    sequenceNumber: 1,
    duration: "15 Menit",
    content: `<h1>Fondasi UI Web Modern</h1><p>Penggunaan tag HTML5 semantik seperti header, main, nav, section, dan footer meningkatkan SEO dan aksesibilitas web.</p>`
  }
];

export const initialEnrollments = [
  {
    id: "enr-101",
    userId: "usr-1",
    trainingId: "trn-101",
    enrolledAt: "2026-09-10T10:00:00Z",
    status: "in_progress",
    progressPercent: 60
  },
  {
    id: "enr-102",
    userId: "usr-1",
    trainingId: "trn-102",
    enrolledAt: "2026-09-15T14:00:00Z",
    status: "in_progress",
    progressPercent: 25
  },
  {
    id: "enr-103",
    userId: "usr-2",
    trainingId: "trn-101",
    enrolledAt: "2026-09-12T09:00:00Z",
    status: "completed",
    progressPercent: 100
  }
];

export const initialMaterialProgress = [
  {
    id: "prog-1",
    userId: "usr-1",
    materialId: "mat-101-1-1",
    trainingId: "trn-101",
    status: "completed",
    completedAt: "2026-09-11T10:30:00Z"
  },
  {
    id: "prog-2",
    userId: "usr-1",
    materialId: "mat-101-1-2",
    trainingId: "trn-101",
    status: "completed",
    completedAt: "2026-09-11T11:00:00Z"
  },
  {
    id: "prog-3",
    userId: "usr-1",
    materialId: "mat-101-1-3",
    trainingId: "trn-101",
    status: "completed",
    completedAt: "2026-09-12T14:20:00Z"
  }
];

export const initialSubmissions = [
  {
    id: "sub-101",
    assignmentId: "mat-101-1-5",
    trainingId: "trn-101",
    userId: "usr-1",
    userName: "Muhammad Ramdan",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    content: "Berikut ringkasan analisis penjualan Kuartal 3: Produk A mencatatkan kenaikan omset 34% dibanding Q2, sedangkan Produk C memiliki tingkat return 8% karena kendala kemasan. Disarankan memperkuat proteksi kemasan sebelum ekspansi stok Q4.",
    fileName: "Ramdan_Q3_Sales_Analysis_Report.pdf",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    submittedAt: "2026-09-28T14:30:00Z",
    status: "graded"
  },
  {
    id: "sub-102",
    assignmentId: "mat-101-1-5",
    trainingId: "trn-101",
    userId: "usr-2",
    userName: "Siti Aminah",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    content: "Tugas analisis laporan penjualan kuartalan telah dikumpulkan beserta grafik tren bulanan.",
    fileName: "Siti_Data_Sales_Report.pdf",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    submittedAt: "2026-09-29T10:15:00Z",
    status: "submitted"
  }
];

export const initialEvaluations = [
  {
    id: "eval-101",
    submissionId: "sub-101",
    evaluatorId: "usr-3",
    evaluatorName: "Budi Santoso, M.Kom",
    score: 95,
    feedback: "Analisis sangat tajam dan objektif! Rekomendasi perbaikan kemasan sangat realistis untuk dieksekusi tim operasional.",
    evaluatedAt: "2026-09-29T09:00:00Z"
  }
];

export const initialDiscussions = [
  {
    id: "disc-1",
    trainingId: "trn-101",
    courseTitle: "Introduction to Data Science & Analytics",
    userId: "usr-1",
    userName: "Muhammad Ramdan",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    title: "Bagaimana penanganan Outlier terbaik jika data berdistribusi sangat skewed?",
    content: "Halo mentor dan rekan-rekan. Saat mengerjakan latihan dataset, saya menemukan bahwa variabel harga rumah memiliki skewness tinggi. Apakah lebih disarankan menggunakan log-transformation atau clipping IQR method?",
    createdAt: "2026-09-25T14:00:00Z",
    replies: [
      {
        id: "rep-1",
        userId: "usr-3",
        userName: "Budi Santoso, M.Kom",
        userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        userRole: "admin",
        content: "Pertanyaan bagus Ramdan! Untuk variabel keuangan/harga yang highly skewed ke kanan, Log Transformation `np.log1p(x)` sangat baik karena mempertahankan hubungan non-linear dan membuat distribusi mendekati normal.",
        createdAt: "2026-09-25T15:30:00Z"
      },
      {
        id: "rep-2",
        userId: "usr-2",
        userName: "Siti Aminah",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        userRole: "karyawan",
        content: "Setuju dengan Pak Budi, saya juga pernah mencoba Log Transformation di project divisi BI dan hasilnya r-squared model naik signifikan!",
        createdAt: "2026-09-25T16:10:00Z"
      }
    ]
  },
  {
    id: "disc-2",
    trainingId: "trn-102",
    courseTitle: "Fullstack Web Development Modern",
    userId: "usr-2",
    userName: "Siti Aminah",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    title: "Rekomendasi State Management untuk Aplikasi React Enterprise?",
    content: "Apakah di proyek skala sedang kita lebih baik langsung memakai Redux Toolkit atau cukup React Context API + Custom Hooks?",
    createdAt: "2026-09-27T09:15:00Z",
    replies: []
  }
];
