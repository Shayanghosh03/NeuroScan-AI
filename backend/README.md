# NeuroScanAI Backend

Node.js Express REST API backend for NeuroScanAI application with MongoDB database, JWT authentication, and Google OAuth integration.

## Features

- **User Authentication**: JWT-based authentication with email/password and Google OAuth
- **MongoDB Database**: User management and prediction history storage
- **Secure API**: Protected routes with middleware
- **File Upload**: Multer middleware for MRI image uploads
- **AI Integration**: Communicates with Python AI model service for predictions
- **Rate Limiting**: API rate limiting for security
- **CORS**: Cross-origin resource sharing configuration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken) + Passport.js for Google OAuth
- **Security**: Helmet, CORS, Rate Limiting, bcryptjs
- **File Upload**: Multer
- **Validation**: express-validator

## Installation

1. **Install dependencies**:
```bash
cd backend
npm install
```

2. **Environment setup**:
```bash
cp .env.example .env
```

3. **Configure environment variables** in `.env`:
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
UPLOAD_DIR=./uploads/mri
```

4. **Start MongoDB** (if running locally):
```bash
# Using MongoDB directly
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Running the Server

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body**: `{ name, email, password, role, hospital, department }`
- **Response**: `{ success, token, user }`

#### Login User
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ success, token, user }`

#### Get Current User
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, user }`

#### Logout User
- **POST** `/api/auth/logout`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, message }`

#### Google OAuth
- **GET** `/api/auth/google` - Redirects to Google login
- **GET** `/api/auth/google/callback` - OAuth callback

### Predictions

#### Make Prediction
- **POST** `/api/predict`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `FormData` with `file` (MRI image), `patientName`, `patientAge`, `patientGender`
- **Response**: `{ success, data: prediction }`

#### Get Prediction History
- **GET** `/api/history?page=1&limit=20`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, data: [predictions], total, page, pages }`

#### Get Single Prediction
- **GET** `/api/history/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, data: prediction }`

#### Delete Prediction
- **DELETE** `/api/history/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, message }`

#### Clear History
- **DELETE** `/api/history`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, message }`

### Health Check
- **GET** `/health`
- **Response**: `{ status, timestamp, environment }`

## Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  googleId: String (for OAuth),
  avatar: String,
  role: String (Radiologist, Neurologist, Admin),
  hospital: String,
  department: String,
  authProvider: String (email, google),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Prediction Model
```javascript
{
  user: ObjectId (ref: User),
  patientName: String,
  patientAge: Number,
  patientGender: String,
  prediction: String (Glioma, Meningioma, No Tumor, Pituitary),
  confidence: Number,
  probabilities: {
    Glioma: Number,
    Meningioma: Number,
    'No Tumor': Number,
    Pituitary: Number
  },
  imageUrl: String,
  imageName: String,
  imageSize: String,
  riskLevel: String (Low, Medium, High),
  doctorNotes: String,
  hospitalName: String,
  reportId: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
5. Copy Client ID and Client Secret to `.env` file

## Security Features

- **Helmet**: HTTP security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: express-validator
- **File Upload Validation**: File type and size limits

## Error Handling

All errors return consistent JSON format:
```json
{
  "success": false,
  "message": "Error message",
  "stack": "Error stack (development only)"
}
```

## Project Structure

```
backend/
├── config/
│   ├── db.js           # MongoDB connection
│   └── passport.js     # Passport.js configuration
├── controllers/
│   ├── authController.js
│   └── predictionController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── uploadMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── User.js
│   └── Prediction.js
├── routes/
│   ├── authRoutes.js
│   └── predictionRoutes.js
├── utils/
│   └── generateToken.js
├── uploads/
│   └── mri/
├── app.js
├── server.js
├── .env.example
└── package.json
```

## Integration with AI Model Service

The backend communicates with the Python AI model service via HTTP requests:

1. **AI Model Service**: Runs on `http://localhost:8000`
2. **Communication**: Backend sends MRI images to AI service for prediction
3. **Response**: AI service returns prediction results
4. **Storage**: Backend stores results in MongoDB

## Testing

```bash
npm test
```

## License

MIT