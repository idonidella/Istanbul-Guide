import AxiosInstance from "./AxiosInstance";

export const authService = {
  register: async (userData) => {
    try {
      const response = await AxiosInstance.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Bir hata oluştu';
      throw new Error(message);
    }
  },

  login: async (credentials) => {
    try {
      const response = await AxiosInstance.post('/auth/signin', credentials);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Bir hata oluştu';
      throw new Error(message);
    }
  },

  updateName: async (firstname, lastname, token) => {
    try {
      const response = await AxiosInstance.put('/user/update-name', { firstname, lastname }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Bir hata oluştu';
      throw new Error(message);
    }
  },

  checkSession: async (token) => {
    try {
      const response = await AxiosInstance.get('/auth/check-session', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Oturum kontrol edilemedi';
      throw new Error(message);
    }
  },

  signOut: async (token) => {
    try {
      const response = await AxiosInstance.post('/auth/signout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Çıkış işlemi başarısız';
      throw new Error(message);
    }
  },
};

export const placeService = {
  getPlaceByQrCode: async (qrCode, token) => {
    try {
      const response = await AxiosInstance.get('/places/qr', {
        params: { code: qrCode },
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'QR koduna ait yer alınamadı';
      throw new Error(message);
    }
  },

  getPlaceById: async (id, token) => {
    try {
      const response = await AxiosInstance.get(`/places/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Yer bilgisi alınamadı';
      throw new Error(message);
    }
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
      const message = error.response?.data?.message || 'Favori işleminde hata oluştu';
      throw new Error(message);
    }
  },

  checkFavorite: async (placeId, token) => {
    try {
      const response = await AxiosInstance.get(`/favorites/check/${placeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Favori kontrolü başarısız';
      throw new Error(message);
    }
  },

  getFavorites: async (token) => {
    try {
      const response = await AxiosInstance.get('/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Favoriler alınamadı';
      throw new Error(message);
    }
  },

  removeFavorite: async (placeId, token) => {
    try {
      const response = await AxiosInstance.delete(`/favorites/${placeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Favoriden çıkarılamadı';
      throw new Error(message);
    }
  }
};
