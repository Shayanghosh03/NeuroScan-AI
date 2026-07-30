const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  patientAge: {
    type: Number,
    required: true
  },
  patientGender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Unspecified'
  },
  prediction: {
    type: String,
    enum: ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary'],
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  probabilities: {
    Glioma: Number,
    Meningioma: Number,
    'No Tumor': Number,
    Pituitary: Number
  },
  imageUrl: {
    type: String,
    required: true
  },
  imageName: {
    type: String,
    required: true
  },
  imageSize: {
    type: String
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  doctorNotes: {
    type: String
  },
  hospitalName: {
    type: String,
    default: 'Metropolitan Neurological Institute'
  },
  reportId: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate report ID before saving
predictionSchema.pre('save', function(next) {
  if (!this.reportId) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9000) + 1000;
    this.reportId = `REP-${year}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Prediction', predictionSchema);