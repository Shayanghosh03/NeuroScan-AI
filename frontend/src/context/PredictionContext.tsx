import React, { createContext, useContext, useEffect, useState } from 'react';
import type { PredictionResult } from '../types';
import { predictionService } from '../services/predictionService';
import { useAuth } from './AuthContext';

interface PredictionContextType {
  currentPrediction: PredictionResult | null;
  setCurrentPrediction: (pred: PredictionResult | null) => void;
  history: PredictionResult[];
  isAnalyzing: boolean;
  analyzeMRI: (file: File, patientInfo?: { name?: string; age?: number; gender?: string }) => Promise<PredictionResult>;
  deletePrediction: (id: string) => Promise<void>;
  refreshHistory: () => Promise<void>;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const PredictionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const refreshHistory = async () => {
    const data = await predictionService.getHistory();
    setHistory(data);
  };

  useEffect(() => {
    refreshHistory();
  }, [user?.id, user?.email]);

  const analyzeMRI = async (file: File, patientInfo?: { name?: string; age?: number; gender?: string }) => {
    setIsAnalyzing(true);
    try {
      const result = await predictionService.predictMRI(file, patientInfo);
      setCurrentPrediction(result);
      await refreshHistory();
      return result;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deletePrediction = async (id: string) => {
    await predictionService.deleteHistoryItem(id);
    if (currentPrediction?.id === id) {
      setCurrentPrediction(null);
    }
    await refreshHistory();
  };

  return (
    <PredictionContext.Provider
      value={{
        currentPrediction,
        setCurrentPrediction,
        history,
        isAnalyzing,
        analyzeMRI,
        deletePrediction,
        refreshHistory,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
};

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
};
