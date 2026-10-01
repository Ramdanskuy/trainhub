// API Client Service for TrainHub Frontend

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem('trainhub_user') || 'null');
  return {
    'Content-Type': 'application/json',
    'x-user-id': user ? user.id : 'usr-1'
  };
};

const requestJson = async (path, options = {}) => {
  const method = options.method || 'GET';
  const response = await fetch(path, options);
  const contentType = response.headers.get('content-type') || '';
  const body = await response.text();
  if (!contentType.includes('application/json')) {
    throw new Error(`API ${method} ${path} mengembalikan respons bukan JSON (HTTP ${response.status}). Periksa route backend dan restart server API.`);
  }
  let data;
  try {
    data = body ? JSON.parse(body) : {};
  } catch {
    throw new Error(`Respons JSON dari API ${method} ${path} tidak valid.`);
  }
  if (!response.ok && !data.message) {
    data.message = `Permintaan API gagal (HTTP ${response.status}).`;
  }
  return data;
};

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch('/api/auth/me', { headers: getHeaders() });
    return res.json();
  },

  // Trainings
  getTrainings: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/trainings?${query}`, { headers: getHeaders() });
    return res.json();
  },

  getTrainingDetail: async (id) => {
    return requestJson(`/api/trainings/${encodeURIComponent(id)}`, { headers: getHeaders() });
  },

  createTraining: async (data) => {
    const res = await fetch('/api/trainings', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateTraining: async (id, data) => {
    const res = await fetch(`/api/trainings/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteTraining: async (id) => {
    const res = await fetch(`/api/trainings/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Enrollment
  enroll: async (trainingId) => {
    const res = await fetch(`/api/trainings/${trainingId}/enroll`, {
      method: 'POST',
      headers: getHeaders()
    });
    return res.json();
  },

  unenroll: async (trainingId) => {
    const res = await fetch(`/api/trainings/${trainingId}/enroll`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  getMyTrainings: async () => {
    const res = await fetch('/api/my/trainings', { headers: getHeaders() });
    return res.json();
  },

  // Material & Progress
  completeMaterial: async (materialId) => {
    const res = await fetch(`/api/materials/${materialId}/complete`, {
      method: 'POST',
      headers: getHeaders()
    });
    return res.json();
  },

  addModule: async (trainingId, moduleData) => {
    return requestJson(`/api/trainings/${encodeURIComponent(trainingId)}/modules`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(moduleData)
    });
  },

  updateModule: async (moduleId, moduleData) => {
    return requestJson(`/api/modules/${encodeURIComponent(moduleId)}`, {
      method: 'PUT', headers: getHeaders(), body: JSON.stringify(moduleData)
    });
  },

  deleteModule: async (moduleId) => {
    return requestJson(`/api/modules/${encodeURIComponent(moduleId)}`, { method: 'DELETE', headers: getHeaders() });
  },

  addMaterial: async (moduleId, materialData) => {
    return requestJson(`/api/modules/${encodeURIComponent(moduleId)}/materials`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(materialData)
    });
  },

  updateMaterial: async (materialId, materialData) => {
    return requestJson(`/api/materials/${encodeURIComponent(materialId)}`, {
      method: 'PUT', headers: getHeaders(), body: JSON.stringify(materialData)
    });
  },

  deleteMaterial: async (materialId) => {
    return requestJson(`/api/materials/${encodeURIComponent(materialId)}`, { method: 'DELETE', headers: getHeaders() });
  },

  // Submissions & Evaluations
  submitAssignment: async (assignmentId, content, fileName, fileUrl) => {
    const res = await fetch(`/api/assignments/${assignmentId}/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content, fileName, fileUrl })
    });
    return res.json();
  },

  getAllSubmissions: async () => {
    const res = await fetch('/api/submissions', { headers: getHeaders() });
    return res.json();
  },

  evaluateSubmission: async (submissionId, score, feedback) => {
    const res = await fetch(`/api/submissions/${submissionId}/evaluate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ score, feedback })
    });
    return res.json();
  },

  // Discussions
  getDiscussions: async (trainingId = 'all', search = '') => {
    const query = new URLSearchParams({ trainingId, search }).toString();
    const res = await fetch(`/api/discussions?${query}`, { headers: getHeaders() });
    return res.json();
  },

  createDiscussion: async (trainingId, title, content) => {
    const res = await fetch('/api/discussions', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ trainingId, title, content })
    });
    return res.json();
  },

  replyDiscussion: async (discussionId, content) => {
    const res = await fetch(`/api/discussions/${discussionId}/replies`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content })
    });
    return res.json();
  },

  // Profile
  getProfile: async () => {
    const res = await fetch('/api/users/profile', { headers: getHeaders() });
    return res.json();
  },

  updateProfile: async (data) => {
    return requestJson('/api/users/profile', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
  },

  // Testing & Enrollment Suite
  seedDatabase: async () => {
    const res = await fetch('/api/testing/seed', {
      method: 'POST',
      headers: getHeaders()
    });
    return res.json();
  },

  autoCompleteCourse: async (trainingId) => {
    const res = await fetch('/api/testing/auto-complete', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ trainingId })
    });
    return res.json();
  }
};
