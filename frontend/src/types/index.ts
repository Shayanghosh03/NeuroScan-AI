export type TumorClass = 'Glioma' | 'Meningioma' | 'Pituitary' | 'No Tumor';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface ClassProbabilities {
  Glioma: number;
  Meningioma: number;
  Pituitary: number;
  'No Tumor': number;
  [key: string]: number;
}

export interface PredictionResult {
  id?: string;
  reportId: string;
  prediction: TumorClass;
  confidence: number;
  probabilities: ClassProbabilities;
  imageUrl?: string;
  imageName?: string;
  imageSize?: string;
  date?: string;
  riskLevel?: RiskLevel;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  hospitalName?: string;
  doctorName?: string;
  doctorNotes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  hospital?: string;
  department?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}
