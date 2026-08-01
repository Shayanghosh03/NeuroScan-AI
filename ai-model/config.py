"""
Configuration for AI Model Service
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Application configuration"""
    
    # Flask Configuration
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key-change-in-production')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    PORT = int(os.getenv('PORT', 8000))
    
    # AI Model Configuration
    MODEL_PATH = os.getenv('MODEL_PATH', './model/brain_tumor.weights.h5')
    IMAGE_SIZE = int(os.getenv('IMAGE_SIZE', 128))
    CLASS_NAMES = os.getenv('CLASS_NAMES', 'Glioma,Meningioma,No Tumor,Pituitary').split(',')
    
    # File Upload Configuration
    BASE_DIR = Path(__file__).resolve().parent
    UPLOAD_FOLDER = BASE_DIR / 'uploads'
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16777216))  # 16MB
    
    # CORS Configuration
    CORS_ORIGINS = ['http://localhost:5000', 'http://localhost:5173', 'http://localhost:3000']