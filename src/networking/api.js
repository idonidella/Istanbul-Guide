// src/services/api.js

const API_URL = 'http://10.0.2.2:3000/api'; // Sunucu IP adresinizi yazın

export const authService = {
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Kayıt işlemi başarısız oldu');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Giriş işlemi başarısız oldu');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },
};