import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = {
  uploadPDF: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  queryPDF: async (question) => {
    const response = await axios.post(`${API_BASE_URL}/query`, { question });
    return response.data;
  },
  
  getHistory: async () => {
    const response = await axios.get(`${API_BASE_URL}/history`);
    return response.data;
  }
};
