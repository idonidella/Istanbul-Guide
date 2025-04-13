import AxiosInstance from "./AxiosInstance";

export const authService = {
  register: async (userData) => {
    try {
      console.log('GİRİŞ YAPILAN BASE URL:', AxiosInstance.defaults.baseURL);  
      const response = await AxiosInstance.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      console.log('GİRİŞ YAPILAN BASE URL:', AxiosInstance.defaults.baseURL);  
      const response = await AxiosInstance.post('/auth/signin', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPlaceByQrCode: async (qrCode, token) => {
    try {
      const response = await AxiosInstance.get('/places/qr', {
        params: { code: qrCode },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("QR kod ile yapı getirme hatası:", error);
      throw error;
    }
  },

  updateName: async (firstname, lastname, token) => {
    try {
      const response = await AxiosInstance.put('/user/update-name',
        { firstname, lastname },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("İsim güncelleme hatası:", error);
      throw error;
    }
  },

  signOut: async (token) => {
    try {
      const response = await AxiosInstance.post('/auth/signout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Çıkış işlemi hatası:", error);
      throw error;
    }
  },

  checkSession: async (token) => {
    try {
      const response = await AxiosInstance.get('/auth/check-session', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Session kontrol hatası:", error);
      throw error;
    }
  },
};
