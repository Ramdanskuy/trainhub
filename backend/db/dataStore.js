import { scryptSync, timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  initialUsers,
  initialTrainings,
  initialModules,
  initialMaterials,
  initialEnrollments,
  initialMaterialProgress,
  initialSubmissions,
  initialEvaluations,
  initialDiscussions
} from './seedData.js';

const registeredUsersFile = fileURLToPath(new URL('./registeredUsers.json', import.meta.url));

const loadRegisteredUsers = () => {
  try {
    const users = JSON.parse(readFileSync(registeredUsersFile, 'utf8'));
    return Array.isArray(users) ? users : [];
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

const passwordMatches = (password, storedPassword) => {
  if (!storedPassword.startsWith('scrypt:')) return storedPassword === password;
  const [, salt, expected] = storedPassword.split(':');
  const actual = scryptSync(password, salt, 64).toString('hex');
  return timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
};

class DataStore {
  constructor() {
    this.resetStore();
  }

  resetStore() {
    this.users = [...JSON.parse(JSON.stringify(initialUsers)), ...loadRegisteredUsers()];
    this.trainings = JSON.parse(JSON.stringify(initialTrainings));
    this.modules = JSON.parse(JSON.stringify(initialModules));
    this.materials = JSON.parse(JSON.stringify(initialMaterials));
    this.enrollments = JSON.parse(JSON.stringify(initialEnrollments));
    this.materialProgress = JSON.parse(JSON.stringify(initialMaterialProgress));
    this.submissions = JSON.parse(JSON.stringify(initialSubmissions));
    this.evaluations = JSON.parse(JSON.stringify(initialEvaluations));
    this.discussions = JSON.parse(JSON.stringify(initialDiscussions));
  }

  // --- Auth ---
  login(email, password) {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    if (!passwordMatches(password, user.password)) return null;
    const { password: _, ...userWithoutPass } = user;
    return userWithoutPass;
  }

  getUserById(id) {
    const user = this.users.find(u => u.id === id);
    if (!user) return null;
    const { password: _, ...userWithoutPass } = user;
    return userWithoutPass;
  }

  updateUserProfile(id, data) {
    const user = this.users.find(u => u.id === id);
    if (!user) return null;
    const profileFields = ['name', 'title', 'bio', 'address', 'phone'];
    profileFields.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(data, field)) user[field] = data[field];
    });
    if (Object.prototype.hasOwnProperty.call(data, 'avatar')) {
      const defaultUser = initialUsers.find(item => item.id === id);
      user.avatar = data.avatar || defaultUser?.avatar || '';
    }
    const { password: _, ...updated } = user;
    return updated;
  }

  // --- Trainings ---
  getAllTrainings(userId, filters = {}) {
    let result = this.trainings.filter(t => t.status !== 'archived' || filters.includeArchived);

    if (filters.category && filters.category !== 'Semua' && filters.category !== 'All Categories') {
      result = result.filter(t => t.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.level && filters.level !== 'Semua' && filters.level !== 'All Levels') {
      result = result.filter(t => t.level.toLowerCase() === filters.level.toLowerCase());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        t.mentor.toLowerCase().includes(q)
      );
    }

    // Attach user enrollment status and progress
    return result.map(t => {
      const enrollment = userId ? this.enrollments.find(e => e.userId === userId && e.trainingId === t.id) : null;
      const progress = userId ? this.calculateTrainingProgress(userId, t.id) : 0;
      const totalMaterialsCount = this.materials.filter(m => m.trainingId === t.id).length;

      return {
        ...t,
        isEnrolled: !!enrollment,
        enrollmentStatus: enrollment ? enrollment.status : 'not_enrolled',
        progressPercent: progress,
        totalMaterials: totalMaterialsCount,
        participantsCount: this.enrollments.filter(e => e.trainingId === t.id).length
      };
    });
  }

  getTrainingDetail(id, userId) {
    const training = this.trainings.find(t => t.id === id);
    if (!training) return null;

    const modules = this.modules
      .filter(m => m.trainingId === id)
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
      .map(mod => {
        const materials = this.materials
          .filter(m => m.moduleId === mod.id)
          .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          .map(mat => {
            const isCompleted = userId ? this.materialProgress.some(p => p.userId === userId && p.materialId === mat.id && p.status === 'completed') : false;
            return {
              ...mat,
              isCompleted
            };
          });
        return {
          ...mod,
          materials
        };
      });

    const enrollment = userId ? this.enrollments.find(e => e.userId === userId && e.trainingId === id) : null;
    const progressPercent = userId ? this.calculateTrainingProgress(userId, id) : 0;
    const totalMaterials = this.materials.filter(m => m.trainingId === id).length;
    const completedMaterialsCount = userId ? this.materialProgress.filter(p => p.userId === userId && p.trainingId === id && p.status === 'completed').length : 0;

    // Fetch user submissions for this training
    const userSubmissions = userId ? this.submissions.filter(s => s.userId === userId && s.trainingId === id).map(s => {
      const evaluation = this.evaluations.find(ev => ev.submissionId === s.id);
      return { ...s, evaluation };
    }) : [];

    // Fetch course discussions
    const courseDiscussions = this.discussions.filter(d => d.trainingId === id);

    return {
      ...training,
      modules,
      isEnrolled: !!enrollment,
      enrollmentStatus: enrollment ? enrollment.status : 'not_enrolled',
      progressPercent,
      totalMaterials,
      completedMaterialsCount,
      participantsCount: this.enrollments.filter(e => e.trainingId === id).length,
      userSubmissions,
      discussionsCount: courseDiscussions.length
    };
  }

  createTraining(trainingData) {
    const newTraining = {
      id: `trn-${Date.now()}`,
      ...trainingData,
      status: trainingData.status || 'published',
      skills: Array.isArray(trainingData.skills) ? trainingData.skills : (trainingData.skills ? trainingData.skills.split(',').map(s => s.trim()) : []),
      createdAt: new Date().toISOString()
    };
    this.trainings.push(newTraining);
    return newTraining;
  }

  updateTraining(id, data) {
    const index = this.trainings.findIndex(t => t.id === id);
    if (index === -1) return null;
    this.trainings[index] = { ...this.trainings[index], ...data };
    return this.trainings[index];
  }

  deleteTraining(id) {
    const index = this.trainings.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.trainings[index].status = 'archived';
    return true;
  }

  // --- Enrollment & Progress ---
  enrollUser(userId, trainingId) {
    let enrollment = this.enrollments.find(e => e.userId === userId && e.trainingId === trainingId);
    if (enrollment) {
      return { success: false, message: "Karyawan sudah terdaftar pada pelatihan ini.", enrollment };
    }

    enrollment = {
      id: `enr-${Date.now()}`,
      userId,
      trainingId,
      enrolledAt: new Date().toISOString(),
      status: "in_progress",
      progressPercent: 0
    };

    this.enrollments.push(enrollment);
    return { success: true, message: "Berhasil mendaftar pelatihan!", enrollment };
  }

  unenrollUser(userId, trainingId) {
    const index = this.enrollments.findIndex(e => e.userId === userId && e.trainingId === trainingId);
    if (index === -1) return { success: false, message: "Data enrollment tidak ditemukan." };
    this.enrollments.splice(index, 1);
    // Remove material progress
    this.materialProgress = this.materialProgress.filter(p => !(p.userId === userId && p.trainingId === trainingId));
    return { success: true, message: "Berhasil membatalkan enrollment (Testing)." };
  }

  completeMaterial(userId, materialId) {
    const material = this.materials.find(m => m.id === materialId);
    if (!material) return null;

    let prog = this.materialProgress.find(p => p.userId === userId && p.materialId === materialId);
    if (!prog) {
      prog = {
        id: `prog-${Date.now()}`,
        userId,
        materialId,
        trainingId: material.trainingId,
        status: "completed",
        completedAt: new Date().toISOString()
      };
      this.materialProgress.push(prog);
    } else {
      prog.status = "completed";
      prog.completedAt = new Date().toISOString();
    }

    // Recalculate training progress
    const newProgressPercent = this.calculateTrainingProgress(userId, material.trainingId);
    const enrollment = this.enrollments.find(e => e.userId === userId && e.trainingId === material.trainingId);
    if (enrollment) {
      enrollment.progressPercent = newProgressPercent;
      if (newProgressPercent === 100) {
        enrollment.status = "completed";
      }
    }

    return { progressPercent: newProgressPercent, completedMaterialId: materialId };
  }

  calculateTrainingProgress(userId, trainingId) {
    const total = this.materials.filter(m => m.trainingId === trainingId).length;
    if (total === 0) return 0;
    const completed = this.materialProgress.filter(p => p.userId === userId && p.trainingId === trainingId && p.status === 'completed').length;
    return Math.round((completed / total) * 100);
  }

  getUserProgressSummary(userId) {
    const enrolled = this.enrollments.filter(e => e.userId === userId);
    const completedTrainings = enrolled.filter(e => e.status === 'completed').length;
    
    // Calculate average quiz/assignment score
    const userSubmissions = this.submissions.filter(s => s.userId === userId);
    const gradedSubmissions = userSubmissions
      .map(s => this.evaluations.find(ev => ev.submissionId === s.id))
      .filter(Boolean);
    
    const avgScore = gradedSubmissions.length > 0 
      ? Math.round(gradedSubmissions.reduce((acc, curr) => acc + curr.score, 0) / gradedSubmissions.length)
      : 85;

    const detailedCourses = enrolled.map(e => {
      const training = this.trainings.find(t => t.id === e.trainingId);
      const progress = this.calculateTrainingProgress(userId, e.trainingId);
      const totalMat = this.materials.filter(m => m.trainingId === e.trainingId).length;
      const completedMat = this.materialProgress.filter(p => p.userId === userId && p.trainingId === e.trainingId && p.status === 'completed').length;

      return {
        id: e.trainingId,
        title: training ? training.title : 'Pelatihan',
        category: training ? training.category : '',
        coverUrl: training ? training.coverUrl : '',
        progressPercent: progress,
        totalMaterials: totalMat,
        completedMaterials: completedMat,
        status: e.status,
        enrolledAt: e.enrolledAt
      };
    });

    return {
      completedTrainingsCount: completedTrainings,
      inProgressTrainingsCount: enrolled.length - completedTrainings,
      averageScore: avgScore,
      totalGradedTasks: gradedSubmissions.length,
      learningTimeHours: 18,
      courses: detailedCourses
    };
  }

  getUserNotifications(userId) {
    const now = Date.now();
    const twoWeeksFromNow = now + 14 * 24 * 60 * 60 * 1000;
    const enrollments = this.enrollments.filter(enrollment => enrollment.userId === userId);
    const enrollmentByTraining = new Map(enrollments.map(enrollment => [enrollment.trainingId, enrollment]));
    const notifications = [];

    this.submissions.filter(submission => submission.userId === userId).forEach(submission => {
      const evaluation = this.evaluations.find(item => item.submissionId === submission.id);
      if (!evaluation) return;
      const assignment = this.materials.find(item => item.id === submission.assignmentId);
      const training = this.trainings.find(item => item.id === submission.trainingId);
      notifications.push({
        id: `grade-${evaluation.id}`,
        type: 'grade',
        title: 'Tugas sudah dinilai',
        message: `${assignment?.title || 'Tugas'} mendapat nilai ${evaluation.score}/100.`,
        trainingId: submission.trainingId,
        submissionId: submission.id,
        trainingTitle: training?.title || 'Pelatihan',
        createdAt: evaluation.evaluatedAt
      });
    });

    this.discussions.filter(discussion => enrollmentByTraining.has(discussion.trainingId)).forEach(discussion => {
      const enrollment = enrollmentByTraining.get(discussion.trainingId);
      const enrolledAt = Date.parse(enrollment.enrolledAt) || 0;
      const trainingTitle = this.trainings.find(item => item.id === discussion.trainingId)?.title || discussion.courseTitle || 'Pelatihan';

      if (discussion.userId !== userId && Date.parse(discussion.createdAt) >= enrolledAt) {
        notifications.push({
          id: `discussion-${discussion.id}`,
          type: 'discussion',
          title: 'Diskusi baru di pelatihan Anda',
          message: `${discussion.userName} memulai diskusi: “${discussion.title}”.`,
          trainingId: discussion.trainingId,
          discussionId: discussion.id,
          trainingTitle,
          createdAt: discussion.createdAt
        });
      }

      (discussion.replies || []).filter(reply => discussion.userId === userId && reply.userId !== userId && Date.parse(reply.createdAt) >= enrolledAt).forEach(reply => {
        notifications.push({
          id: `reply-${reply.id}`,
          type: 'discussion',
          title: 'Diskusi Anda mendapat balasan',
          message: `${reply.userName} membalas “${discussion.title}”.`,
          trainingId: discussion.trainingId,
          discussionId: discussion.id,
          trainingTitle,
          createdAt: reply.createdAt
        });
      });
    });

    this.materials.filter(material => enrollmentByTraining.has(material.trainingId) && material.type === 'assignment' && material.assignmentData?.deadline).forEach(material => {
      const deadline = Date.parse(material.assignmentData.deadline);
      const alreadySubmitted = this.submissions.some(submission => submission.userId === userId && submission.assignmentId === material.id);
      if (deadline <= now || deadline > twoWeeksFromNow || alreadySubmitted) return;
      const trainingTitle = this.trainings.find(item => item.id === material.trainingId)?.title || 'Pelatihan';
      notifications.push({
        id: `deadline-${material.id}`,
        type: 'deadline',
        title: 'Tenggat tugas mendekat',
        message: `Kumpulkan “${material.title}” sebelum ${new Date(deadline).toLocaleDateString('id-ID')}.`,
        trainingId: material.trainingId,
        materialId: material.id,
        trainingTitle,
        createdAt: new Date(now).toISOString()
      });
    });

    return notifications.sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt));
  }

  // --- Curriculum & Materials (Admin) ---
  addModule(trainingId, moduleData) {
    const count = this.modules.filter(m => m.trainingId === trainingId).length;
    const data = typeof moduleData === 'string' ? { title: moduleData } : moduleData;
    const newModule = {
      id: `mod-${Date.now()}`,
      trainingId,
      description: '',
      ...data,
      sequenceNumber: Math.min(Math.max(Number(data.sequenceNumber) || count + 1, 1), count + 1)
    };
    this.modules.push(newModule);
    this.reorderModules(trainingId, newModule.id, newModule.sequenceNumber);
    return newModule;
  }

  updateModule(moduleId, updates) {
    const module = this.modules.find(item => item.id === moduleId);
    if (!module) return null;
    Object.assign(module, updates);
    this.reorderModules(module.trainingId, module.id, updates.sequenceNumber);
    return module;
  }

  reorderModules(trainingId, moduleId, sequenceNumber) {
    const modules = this.modules
      .filter(item => item.trainingId === trainingId)
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    const moduleIndex = modules.findIndex(item => item.id === moduleId);
    if (moduleIndex === -1) return;
    const [module] = modules.splice(moduleIndex, 1);
    const targetIndex = Math.min(Math.max(Number(sequenceNumber) - 1 || 0, 0), modules.length);
    modules.splice(targetIndex, 0, module);
    modules.forEach((item, index) => { item.sequenceNumber = index + 1; });
  }

  deleteModule(moduleId) {
    const moduleIndex = this.modules.findIndex(item => item.id === moduleId);
    if (moduleIndex === -1) return null;
    const [module] = this.modules.splice(moduleIndex, 1);
    const materialIds = this.materials.filter(item => item.moduleId === moduleId).map(item => item.id);
    this.materials = this.materials.filter(item => item.moduleId !== moduleId);
    this.materialProgress = this.materialProgress.filter(item => !materialIds.includes(item.materialId));
    const submissionIds = this.submissions.filter(item => materialIds.includes(item.assignmentId)).map(item => item.id);
    this.submissions = this.submissions.filter(item => !materialIds.includes(item.assignmentId));
    this.evaluations = this.evaluations.filter(item => !submissionIds.includes(item.submissionId));
    this.modules.filter(item => item.trainingId === module.trainingId).forEach((item, index) => {
      item.sequenceNumber = index + 1;
    });
    return module;
  }

  addMaterial(materialData) {
    const count = this.materials.filter(m => m.moduleId === materialData.moduleId).length;
    const newMaterial = {
      id: `mat-${Date.now()}`,
      sequenceNumber: count + 1,
      ...materialData
    };
    this.materials.push(newMaterial);
    return newMaterial;
  }

  updateMaterial(materialId, updates) {
    const material = this.materials.find(item => item.id === materialId);
    if (!material) return null;
    Object.assign(material, updates);
    return material;
  }

  deleteMaterial(materialId) {
    const materialIndex = this.materials.findIndex(item => item.id === materialId);
    if (materialIndex === -1) return null;
    const [material] = this.materials.splice(materialIndex, 1);
    this.materialProgress = this.materialProgress.filter(item => item.materialId !== materialId);
    const submissionIds = this.submissions.filter(item => item.assignmentId === materialId).map(item => item.id);
    this.submissions = this.submissions.filter(item => item.assignmentId !== materialId);
    this.evaluations = this.evaluations.filter(item => !submissionIds.includes(item.submissionId));
    this.materials.filter(item => item.moduleId === material.moduleId).forEach((item, index) => {
      item.sequenceNumber = index + 1;
    });
    return material;
  }

  // --- Submissions & Evaluations ---
  submitAssignment(userId, assignmentId, content, fileName, fileUrl) {
    const assignment = this.materials.find(m => m.id === assignmentId);
    if (!assignment) return null;

    const user = this.getUserById(userId);

    const submission = {
      id: `sub-${Date.now()}`,
      assignmentId,
      trainingId: assignment.trainingId,
      userId,
      userName: user ? user.name : "Karyawan",
      userAvatar: user ? user.avatar : "",
      content,
      fileName: fileName || "tugas_submission.pdf",
      fileUrl: fileUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      submittedAt: new Date().toISOString(),
      status: "submitted"
    };

    this.submissions.push(submission);
    return submission;
  }

  getAllSubmissions() {
    return this.submissions.map(sub => {
      const assignment = this.materials.find(m => m.id === sub.assignmentId);
      const training = this.trainings.find(t => t.id === sub.trainingId);
      const evaluation = this.evaluations.find(e => e.submissionId === sub.id);
      return {
        ...sub,
        assignmentTitle: assignment ? assignment.title : "Tugas",
        trainingTitle: training ? training.title : "Pelatihan",
        evaluation
      };
    });
  }

  evaluateSubmission(submissionId, evaluatorId, score, feedback) {
    const submission = this.submissions.find(s => s.id === submissionId);
    if (!submission) return null;

    const evaluator = this.getUserById(evaluatorId);

    let evaluation = this.evaluations.find(e => e.submissionId === submissionId);
    if (!evaluation) {
      evaluation = {
        id: `eval-${Date.now()}`,
        submissionId,
        evaluatorId,
        evaluatorName: evaluator ? evaluator.name : "Trainer Admin",
        score: Number(score),
        feedback,
        evaluatedAt: new Date().toISOString()
      };
      this.evaluations.push(evaluation);
    } else {
      evaluation.score = Number(score);
      evaluation.feedback = feedback;
      evaluation.evaluatedAt = new Date().toISOString();
    }

    submission.status = "graded";
    return evaluation;
  }

  // --- Discussions ---
  getAllDiscussions(trainingId = null, search = '') {
    let result = [...this.discussions];
    if (trainingId && trainingId !== 'all') {
      result = result.filter(d => d.trainingId === trainingId);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q));
    }

    return result.map(d => ({
      ...d,
      repliesCount: d.replies ? d.replies.length : 0
    }));
  }

  createDiscussion(userId, trainingId, title, content) {
    const user = this.getUserById(userId);
    const training = this.trainings.find(t => t.id === trainingId);

    const newDisc = {
      id: `disc-${Date.now()}`,
      trainingId,
      courseTitle: training ? training.title : "Umum",
      userId,
      userName: user ? user.name : "Pengguna",
      userAvatar: user ? user.avatar : "",
      title,
      content,
      createdAt: new Date().toISOString(),
      replies: []
    };

    this.discussions.unshift(newDisc);
    return newDisc;
  }

  addDiscussionReply(discussionId, userId, content) {
    const disc = this.discussions.find(d => d.id === discussionId);
    if (!disc) return null;

    const user = this.getUserById(userId);

    const reply = {
      id: `rep-${Date.now()}`,
      userId,
      userName: user ? user.name : "Pengguna",
      userAvatar: user ? user.avatar : "",
      userRole: user ? user.role : "karyawan",
      content,
      createdAt: new Date().toISOString()
    };

    if (!disc.replies) disc.replies = [];
    disc.replies.push(reply);
    return reply;
  }
}

export const dataStore = new DataStore();
