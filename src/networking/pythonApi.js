import PythonInstance from "./PythonInstance";

export const pythonApi = {
    // Öneri alma
    getRecommendations: async (userData) => {
        try {
            const response = await PythonInstance.post('/recommend', userData);
            return response.data;
        } catch (error) {
            throw new Error('Öneriler alınırken hata oluştu: ' + error.message);
        }
    },
    // API'yi yeniden başlatma
    restartModel: async () => {
        try {
            const response = await PythonInstance.post('/api/restart');
            return response.data;
        } catch (error) {
            throw new Error('Model yeniden başlatılırken hata oluştu: ' + error.message);
        }
    },
};

export default pythonApi;