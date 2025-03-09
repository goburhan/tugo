const getApiUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.warn('NEXT_PUBLIC_API_URL is not defined');
    return 'http://localhost:3000'; // Fallback URL
  }
  return apiUrl;
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
      console.error('API Error:', error, 'Endpoint:', endpoint, 'URL:', getApiUrl());
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
      console.error('API Error:', error, 'Endpoint:', endpoint, 'URL:', getApiUrl());
      throw error;
    }
  },
};

export default api; 