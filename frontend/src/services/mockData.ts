import type { PredictionResult, User } from '../types';

export const MOCK_USER: User = {
  id: 'usr-default',
  name: 'Radiologist',
  email: 'doctor@hospital.com',
  role: 'Neuroradiologist',
  avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250',
  hospital: '',
  department: 'Diagnostic Imaging & Radiology',
};

export const INITIAL_PREDICTIONS: PredictionResult[] = [];

export function generateMockPrediction(fileName: string, fileSize: string): PredictionResult {
  const classes: Array<'Glioma' | 'Meningioma' | 'Pituitary' | 'No Tumor'> = [
    'Glioma', 'Meningioma', 'Pituitary', 'No Tumor'
  ];
  
  const selectedClass = classes[Math.floor(Math.random() * classes.length)];
  const primaryConf = Number((92 + Math.random() * 7.5).toFixed(2));
  const remaining = Number((100 - primaryConf).toFixed(2));
  
  const otherClasses = classes.filter(c => c !== selectedClass);
  const p1 = Number((remaining * 0.6).toFixed(2));
  const p2 = Number((remaining * 0.3).toFixed(2));
  const p3 = Number((remaining - p1 - p2).toFixed(2));

  const probabilities = {
    Glioma: 0,
    Meningioma: 0,
    Pituitary: 0,
    'No Tumor': 0,
  };

  probabilities[selectedClass] = primaryConf;
  probabilities[otherClasses[0]] = p1;
  probabilities[otherClasses[1]] = p2;
  probabilities[otherClasses[2]] = p3;

  const riskLevel = selectedClass === 'No Tumor' ? 'Low' : primaryConf > 95 ? 'High' : 'Medium';
  const reportId = `REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    id: `hist-${Date.now()}`,
    reportId,
    prediction: selectedClass,
    confidence: primaryConf,
    probabilities,
    imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=600',
    imageName: fileName,
    imageSize: fileSize,
    date: new Date().toISOString(),
    riskLevel,
    patientName: 'Anonymous Patient',
    patientAge: 45,
    patientGender: 'Unspecified',
    hospitalName: '',
    doctorNotes: selectedClass === 'No Tumor'
      ? 'Scan shows normal cortical structure without evidence of intracranial mass lesion.'
      : `High probability indication of ${selectedClass}. Recommended urgent neuroradiological consultation and contrast T1/T2 MRI sequence.`,
  };
}
