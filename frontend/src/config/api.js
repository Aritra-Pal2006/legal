// API configuration
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  DOCUMENTS: `${API_BASE_URL}/api/documents`,
  DOCUMENTS_UPLOAD: `${API_BASE_URL}/api/documents/upload`,
  AI_TRANSLATE: `${API_BASE_URL}/api/ai/translate`,
  AI_CHAT: `${API_BASE_URL}/api/ai/chat`,
  AI_ANALYZE_RISKS: `${API_BASE_URL}/api/ai/analyze-risks`,
  AI_FAIRNESS_SCORE: `${API_BASE_URL}/api/ai/fairness-score`,
  HEALTH: `${API_BASE_URL}/api/health`
};

export default API_ENDPOINTS;