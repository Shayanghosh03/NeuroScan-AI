const express = require('express');
const router = express.Router();
const {
  predict,
  getHistory,
  getPredictionById,
  deletePrediction,
  clearHistory
} = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/predict', protect, upload.single('file'), predict);
router.get('/history', protect, getHistory);
router.get('/history/:id', protect, getPredictionById);
router.delete('/history/:id', protect, deletePrediction);
router.delete('/history', protect, clearHistory);

module.exports = router;