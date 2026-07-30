# NeuroScanAI AI Model Service

Python Flask REST API service for MRI brain tumor detection using deep learning.

## Features

- **VGG16 CNN Model**: Pre-trained model for brain tumor classification
- **Image Processing**: Automatic preprocessing and normalization
- **Multi-class Classification**: Glioma, Meningioma, No Tumor, Pituitary
- **Confidence Scoring**: Detailed probability distribution for each class
- **Risk Assessment**: Automatic risk level calculation
- **Medical Notes**: Auto-generated doctor recommendations
- **Fast Inference**: Sub-2-second prediction time

## Tech Stack

- **Framework**: Flask
- **Deep Learning**: TensorFlow/Keras
- **Image Processing**: PIL, NumPy
- **Environment**: python-dotenv

## Model Details

- **Architecture**: VGG16 (Transfer Learning)
- **Input**: 128x128 RGB images
- **Output**: 4 classes (Glioma, Meningioma, No Tumor, Pituitary)
- **Classes**:
  - Glioma - High risk
  - Meningioma - Medium risk  
  - No Tumor - Low risk
  - Pituitary - High risk

## Installation

1. **Install Python dependencies**:
```bash
cd ai-model
pip install -r requirements.txt
```

2. **Environment setup**:
```bash
cp .env.example .env
```

3. **Configure environment variables** in `.env`:
```env
FLASK_SECRET_KEY=your-secret-key-here
FLASK_ENV=development
PORT=8000
MODEL_PATH=./model/brain_tumor_model.h5
IMAGE_SIZE=128
CLASS_NAMES=Glioma,Meningioma,No Tumor,Pituitary
UPLOAD_FOLDER=./uploads
MAX_CONTENT_LENGTH=16777216
```

4. **Ensure model file exists**:
```bash
# Place your trained model at:
model/brain_tumor_model.h5
```

## Running the Server

### Development mode
```bash
python app.py
```

The server will start on `http://localhost:8000`

### Production mode
Use a production WSGI server like Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

## API Endpoints

### Health Check
- **GET** `/health`
- **Response**: 
```json
{
  "status": "online",
  "model_loaded": true,
  "classes": ["Glioma", "Meningioma", "No Tumor", "Pituitary"],
  "time": "2026-07-30T16:00:00.000000"
}
```

### Prediction
- **POST** `/api/predict`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: MRI image file (required)
  - `patientName`: Patient name (optional, default: "Anonymous Patient")
  - `patientAge`: Patient age (optional, default: 45)
  - `patientGender`: Patient gender (optional, default: "Unspecified")
- **Response**:
```json
{
  "reportId": "REP-2026-1234",
  "prediction": "Glioma",
  "confidence": 98.72,
  "probabilities": {
    "Glioma": 98.72,
    "Meningioma": 0.91,
    "Pituitary": 0.22,
    "No Tumor": 0.15
  },
  "imageUrl": "http://localhost:8000/uploads/mri_abc123.jpg",
  "imageName": "mri_scan.jpg",
  "imageSize": "0.45 MB",
  "date": "2026-07-30T16:00:00.000000",
  "riskLevel": "High",
  "patientName": "John Doe",
  "patientAge": 45,
  "patientGender": "Male",
  "hospitalName": "Metropolitan Neurological Institute",
  "doctorNotes": "Significant neural feature activation indicating Glioma with 98.72% confidence. Recommend contrast T1/T2 MRI sequence and neurosurgical review."
}
```

### Serve Uploaded Files
- **GET** `/uploads/<filename>`
- **Returns**: MRI image file

## Image Processing Pipeline

1. **Input Validation**: File type and size validation
2. **Color Conversion**: Convert to RGB if needed
3. **Resizing**: Resize to 128x128 pixels
4. **Normalization**: Scale pixel values to 0-1 range
5. **Tensor Expansion**: Add batch dimension (1, 128, 128, 3)
6. **Model Inference**: Run through VGG16 model
7. **Post-processing**: Calculate probabilities and risk levels

## Risk Level Calculation

- **Low Risk**: No Tumor detected
- **Medium Risk**: Tumor detected with confidence < 95%
- **High Risk**: Tumor detected with confidence > 95%

## File Upload Constraints

- **Allowed formats**: JPEG, JPG, PNG, GIF, BMP, TIFF, WEBP
- **Maximum file size**: 16MB
- **Minimum dimensions**: 64x64 pixels
- **Maximum dimensions**: 4096x4096 pixels

## Model Training (Optional)

If you want to train your own model:

1. **Prepare dataset**: Organize images by class in folders:
```
dataset/
├── Glioma/
├── Meningioma/
├── No Tumor/
└── Pituitary/
```

2. **Training script**: Create training script using transfer learning:
```python
import tensorflow as tf
from tensorflow.keras.applications import VGG16
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

# Load pre-trained VGG16
base_model = VGG16(weights='imagenet', include_top=False, input_shape=(128, 128, 3))

# Add custom layers
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(256, activation='relu')(x)
predictions = Dense(4, activation='softmax')(x)

# Create model
model = Model(inputs=base_model.input, outputs=predictions)

# Freeze base layers
for layer in base_model.layers:
    layer.trainable = False

# Compile and train
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(train_dataset, epochs=50, validation_data=val_dataset)

# Save model
model.save('model/brain_tumor_model.h5')
```

## Utilities

### Image Processing Functions

Available in `utils/image_processing.py`:

- `load_and_preprocess_image()`: Load and preprocess images
- `normalize_image()`: Normalize image arrays
- `apply_clahe()`: Apply CLAHE for better contrast
- `validate_mri_image()`: Validate uploaded images

## Error Handling

All errors return JSON format:
```json
{
  "error": "Error message"
}
```

Common errors:
- `No image file provided in form-data key 'file'`
- `Empty file provided`
- `Prediction failed: <specific error>`

## Project Structure

```
ai-model/
├── model/
│   ├── brain_tumor_model.h5    # Trained model
│   └── labels.json             # Class labels
├── utils/
│   └── image_processing.py     # Image utilities
├── uploads/                    # Temporary upload folder
├── app.py                      # Flask application
├── config.py                   # Configuration
├── requirements.txt            # Python dependencies
├── .env.example               # Environment template
└── README.md                  # This file
```

## Performance

- **Inference time**: < 2 seconds per image
- **Model size**: ~122 MB
- **Memory usage**: ~500 MB (with model loaded)

## Security Considerations

- File upload validation
- Size limits to prevent DoS
- No sensitive data in predictions
- Environment-based configuration

## Integration with Backend

The AI model service is designed to work with the Node.js backend:

1. Backend receives file upload from frontend
2. Backend forwards file to AI service via HTTP
3. AI service processes and returns prediction
4. Backend stores result in MongoDB
5. Backend returns result to frontend

## Testing

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test prediction
curl -X POST -F "file=@test_mri.jpg" \
     -F "patientName=Test Patient" \
     -F "patientAge=45" \
     http://localhost:8000/api/predict
```

## License

MIT