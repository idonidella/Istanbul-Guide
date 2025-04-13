import AxiosInstance from "./AxiosInstance";

export const authService = {
  register: async (userData) => {
    const response = await AxiosInstance.post('/auth/signup', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await AxiosInstance.post('/auth/signin', credentials);
    return response.data;
  },

  updateName: async (firstname, lastname, token) => {
    const response = await AxiosInstance.put('/user/update-name', { firstname, lastname }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  checkSession: async (token) => {
    const response = await AxiosInstance.get('/auth/check-session', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  signOut: async (token) => {
    const response = await AxiosInstance.post('/auth/signout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};

export const placeService = {
  getPlaceByQrCode: async (qrCode, token) => {
    const response = await AxiosInstance.get('/places/qr', {
      params: { code: qrCode },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getPlaceById: async (id, token) => {
    const response = await AxiosInstance.get(`/places/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};

export const favoriteService = {
  toggleFavorite: async (placeId, token) => {
    try {
      const response = await AxiosInstance.post(
        '/favorites/toggle',
        { placeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("toggleFavorite Hatası:", error.response?.data || error.message);
      throw error;
    }
  },
  
  checkFavorite: async (placeId, token) => {
    const response = await AxiosInstance.get(`/favorites/check/${placeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getFavorites: async (token) => {
    const response = await AxiosInstance.get('/favorites', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  removeFavorite: async (placeId, token) => {
    const response = await AxiosInstance.delete(`/favorites/${placeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
