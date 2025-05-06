const { spawn } = require('child_process');
const path = require('path');

exports.getContentBasedRecommendations = async (req, res) => {
    const userId = req.user.userId;
    const limit = req.query.limit || 5; // Kaç öneri isteniyor

    try {
        const pythonProcess = spawn('python', [
            path.join(__dirname, '../models/content_based_recommendation.py'),
            userId.toString(),
            limit.toString()
        ]);

        let result = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error('Python script hatası:', error);
                return res.status(500).json({ 
                    message: 'Öneriler oluşturulurken bir hata oluştu',
                    error: error
                });
            }

            try {
                const recommendations = JSON.parse(result);
                res.status(200).json({
                    success: true,
                    recommendations: recommendations
                });
            } catch (parseError) {
                console.error('JSON parse hatası:', parseError);
                res.status(500).json({ 
                    message: 'Öneri sonuçları işlenirken hata oluştu',
                    error: parseError.message
                });
            }
        });

    } catch (error) {
        console.error('Öneri oluşturma hatası:', error);
        res.status(500).json({ 
            message: 'Öneriler oluşturulurken bir hata oluştu', 
            error: error.message 
        });
    }
};