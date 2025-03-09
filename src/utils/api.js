const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3001'; // Fallback for server-side
};

export const api = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${getApiUrl()}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('API Error:', error, 'Endpoint:', endpoint);
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${getApiUrl()}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('API Error:', error, 'Endpoint:', endpoint);
      throw error;
    }
  },
};

export default api; 