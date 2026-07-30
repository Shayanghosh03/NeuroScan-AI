# NeuroScan AI - AI-Powered Brain Tumor Detection Web Application

NeuroScan AI is a modern, production-grade medical web application designed for neuroradiologists and clinical practitioners. Built using React 19, Vite, Tailwind CSS, Framer Motion, Recharts, React Router, Axios, and Lucide React icons on the frontend, with a Node.js Express REST API backend and Python Flask AI model service integrating a trained VGG16 Deep Learning Convolutional Neural Network model.

---

## 🌟 Key Features

1. **AI Brain Tumor Classification**:
   - VGG16 CNN model predicting **Glioma**, **Meningioma**, **Pituitary**, and **No Tumor** (Healthy) scans.
   - Image normalization (128x128 3-channel RGB tensor) and sub-2-second inference.
   - Full confidence score meter, class probability distribution bar chart, and risk assessment.

2. **Full REST API Backend**:
   - Node.js Express server with MongoDB database.
   - JWT authentication with email/password and Google OAuth.
   - Secure user management and prediction history tracking.
   - AI model service integration for predictions.

3. **AI Model Service**:
   - Python Flask service with TensorFlow integration.
   - VGG16 CNN model for brain tumor classification.
   - Image preprocessing and risk level calculation.
   - Medical notes generation based on predictions.

4. **Authentication System**:
   - Email/password registration and login.
   - Google OAuth integration for seamless sign-in.
   - JWT token-based authentication.
   - Protected routes and user sessions.

5. **Landing Page**:
   - Hero section with floating 3D brain graphic preview, glowing gradients, how it works workflow, features grid, testimonials, and FAQ accordion.

6. **Radiologist Dashboard**:
   - Summary stat cards, Recharts breakdown pie chart, monthly scan trend line chart, and recent prediction log.

7. **Medical PDF Report & History**:
   - Single-click **Download PDF** and **Print Report** formatted according to clinical radiology reporting standards.
   - Searchable, filterable, and sortable prediction history archive with pagination.

8. **Dark / Light Glassmorphism UI**:
   - Tailwind CSS & Framer Motion design matching modern AI SaaS aesthetic (Perplexity/OpenAI/Stripe).

---

## 🏗️ Architecture

```
NeuroScanAI/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js Express API + MongoDB
├── ai-model/          # Python Flask AI service + TensorFlow
└── docs/             # Documentation
```

### Technology Stack

**Frontend:**
- React 19 with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- React Router for navigation
- Axios for API calls

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Passport.js for Google OAuth
- Multer for file uploads
- Helmet for security

**AI Model Service:**
- Python Flask
- TensorFlow/Keras
- VGG16 CNN model
- PIL for image processing
- NumPy for numerical operations

---

## 🚀 Quick Start Guide

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

### 1. Clone and Setup

```bash
git clone <repository-url>
cd NeuroScanAI
```

### 2. Start MongoDB

**Using Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Or run MongoDB locally:**
```bash
mongod
```

### 3. Setup Backend (Node.js)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```
*Backend runs on `http://localhost:5000`*

### 4. Setup AI Model Service (Python)

```bash
cd ai-model
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
python app.py
```
*AI service runs on `http://localhost:8000`*

### 5. Setup Frontend (React)

```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 📡 API Endpoints

### Backend API (Port 5000)

**Authentication:**
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login user
- `GET /api/auth/me` — Get current user (protected)
- `POST /api/auth/logout` — Logout user (protected)
- `GET /api/auth/google` — Google OAuth redirect
- `GET /api/auth/google/callback` — Google OAuth callback

**Predictions:**
- `POST /api/predict` — Upload MRI scan for prediction (protected)
- `GET /api/history` — Get prediction history (protected)
- `GET /api/history/:id` — Get specific prediction (protected)
- `DELETE /api/history/:id` — Delete prediction (protected)
- `DELETE /api/history` — Clear all history (protected)

**Health:**
- `GET /health` — Health status check

### AI Model Service (Port 8000)

- `GET /health` — AI service health check
- `POST /api/predict` — Process MRI image and return prediction
- `GET /uploads/<filename>` — Serve uploaded images

---

## 🔐 Authentication Setup

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
5. Copy Client ID and Client Secret to backend `.env` file

### Environment Variables

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/neuroscanai
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=your-session-secret
AI_MODEL_URL=http://localhost:8000
MAX_FILE_SIZE=10485760
```

**AI Model (.env):**
```env
FLASK_SECRET_KEY=your-secret-key-here
FLASK_ENV=development
PORT=8000
MODEL_PATH=./model/brain_tumor_model.h5
IMAGE_SIZE=128
CLASS_NAMES=Glioma,Meningioma,No Tumor,Pituitary
```

---

## 🧠 AI Model Information

- **Architecture**: VGG16 with transfer learning
- **Input**: 128x128 RGB images
- **Output**: 4 classes (Glioma, Meningioma, No Tumor, Pituitary)
- **Inference Time**: < 2 seconds
- **Risk Levels**: Auto-calculated based on prediction confidence

---

## 📝 Development Notes

### Frontend Development
```bash
cd frontend
npm run dev    # Development server
npm run build  # Production build
npm run lint   # Lint code
```

### Backend Development
```bash
cd backend
npm run dev    # Development with nodemon
npm start      # Production start
npm test       # Run tests
```

### AI Model Development
```bash
cd ai-model
python app.py                    # Development server
gunicorn -w 4 -b 0.0.0.0:8000 app:app  # Production server
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running on port 27017
- Check connection string in backend `.env`
- Verify MongoDB credentials if using cloud instance

### AI Model Not Loading
- Verify model file exists at `ai-model/model/brain_tumor_model.h5`
- Check TensorFlow installation: `pip list | grep tensorflow`
- Ensure sufficient memory for model loading (~500MB)

### CORS Errors
- Check CORS configuration in backend `app.js`
- Verify frontend URL is in allowed origins
- Check that backend is running on correct port

### Google OAuth Issues
- Verify Google Cloud Console OAuth settings
- Check that redirect URI matches exactly
- Ensure OAuth consent screen is configured

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- VGG16 model architecture by Visual Geometry Group, Oxford
- Medical imaging datasets and research community
- Open source AI and medical imaging community
