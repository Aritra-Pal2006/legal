import { create } from 'zustand';
import api from '../services/api';

const useDocumentStore = create((set, get) => ({
  documents: [],
  currentDocument: null,
  uploading: false,
  processing: false,
  error: null,
  
  // Analysis states
  currentAnalysis: null,
  riskAnalysis: null,
  fairnessScore: null,
  translations: {},
  conversations: {},

  // Upload document
  uploadDocument: async (file) => {
    try {
      set({ uploading: true, error: null });
      
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Add to documents list
      const newDocument = {
        id: response.data.documentId,
        filename: file.name,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
        metadata: response.data.metadata,
        processed: false
      };
      
      set(state => ({
        documents: [newDocument, ...state.documents],
        uploading: false
      }));
      
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, uploading: false });
      throw error;
    }
  },

  // Get all documents
  fetchDocuments: async () => {
    try {
      const response = await api.get('/documents');
      set({ documents: response.data.documents, error: null });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
    }
  },

  // Get specific document
  fetchDocument: async (documentId) => {
    try {
      set({ processing: true, error: null });
      const response = await api.get(`/documents/${documentId}`);
      set({ currentDocument: response.data, processing: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, processing: false });
      throw error;
    }
  },

  // Delete document
  deleteDocument: async (documentId) => {
    try {
      await api.delete(`/documents/${documentId}`);
      set(state => ({
        documents: state.documents.filter(doc => doc.id !== documentId),
        currentDocument: state.currentDocument?.id === documentId ? null : state.currentDocument
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      throw error;
    }
  },

  // Translate text to plain language
  translateText: async (documentId, text, difficultyLevel = '10th grade', language = 'English') => {
    try {
      set({ processing: true, error: null });
      
      const response = await api.post('/ai/translate', {
        documentId,
        text,
        difficultyLevel,
        language
      });
      
      // Store translation
      set(state => ({
        translations: {
          ...state.translations,
          [response.data.translationId]: response.data
        },
        processing: false
      }));
      
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, processing: false });
      throw error;
    }
  },

  // Analyze risks and obligations
  analyzeRisks: async (documentId, text) => {
    try {
      set({ processing: true, error: null });
      
      const response = await api.post('/ai/analyze-risks', {
        documentId,
        text
      });
      
      set({ riskAnalysis: response.data, processing: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, processing: false });
      throw error;
    }
  },

  // Get fairness score
  getFairnessScore: async (documentId, text) => {
    try {
      set({ processing: true, error: null });
      
      const response = await api.post('/ai/fairness-score', {
        documentId,
        text
      });
      
      set({ fairnessScore: response.data, processing: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, processing: false });
      throw error;
    }
  },

  // Chat with document
  chatWithDocument: async (documentId, question, conversationId = null) => {
    try {
      const response = await api.post('/ai/chat', {
        documentId,
        question,
        conversationId
      });
      
      // Update conversations
      set(state => {
        const convId = response.data.conversationId;
        const existingConv = state.conversations[convId] || [];
        
        return {
          conversations: {
            ...state.conversations,
            [convId]: [
              ...existingConv,
              {
                type: 'question',
                content: question,
                timestamp: response.data.timestamp
              },
              {
                type: 'answer',
                content: response.data.answer,
                timestamp: response.data.timestamp
              }
            ]
          }
        };
      });
      
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      throw error;
    }
  },

  // Get conversation history
  fetchConversations: async (documentId) => {
    try {
      const response = await api.get(`/ai/conversations/${documentId}`);
      set({ conversations: response.data.conversations });
      return response.data.conversations;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      throw error;
    }
  },

  // Clear current document
  clearCurrentDocument: () => set({ 
    currentDocument: null,
    riskAnalysis: null,
    fairnessScore: null,
    currentAnalysis: null
  }),

  // Clear error
  clearError: () => set({ error: null })
}));

export default useDocumentStore;