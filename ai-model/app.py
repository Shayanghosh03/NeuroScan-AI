import os
import io
import uuid
import datetime
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
import numpy as np
import tensorflow as tf
from tensorflow.keras import Model
from tensorflow.keras.applications import VGG16
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH_RAW = os.getenv('MODEL_PATH', str(BASE_DIR / 'model' / 'brain_tumor.weights.h5'))
UPLOAD_FOLDER = BASE_DIR / 'uploads'
IMAGE_SIZE = int(os.getenv('IMAGE_SIZE', 128))
CLASS_NAMES = os.getenv('CLASS_NAMES', 'Glioma,Meningioma,No Tumor,Pituitary').split(',')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def resolve_model_path(model_path_raw):
    """Resolve model path; treat relative paths as relative to this app directory."""
    model_path = Path(model_path_raw)
    if not model_path.is_absolute():
        model_path = BASE_DIR / model_path
    return model_path.resolve()


def build_vgg16_classifier(input_size, num_classes):
    """Build VGG16 architecture for loading weights-only checkpoints."""
    base_model = VGG16(weights='imagenet', include_top=False, input_shape=(input_size, input_size, 3))
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(256, activation='relu')(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    model_instance = Model(inputs=base_model.input, outputs=predictions)
    return model_instance


def load_brain_tumor_model(model_path):
    """Load a full model or (if needed) load weights into known VGG16 architecture."""
    try:
        return tf.keras.models.load_model(model_path), "full_model"
    except Exception as full_model_error:
        if str(model_path).endswith(".weights.h5"):
            try:
                weights_model = build_vgg16_classifier(IMAGE_SIZE, len(CLASS_NAMES))
                weights_model.load_weights(model_path)
                return weights_model, "weights_only"
            except Exception as weights_error:
                raise RuntimeError(
                    f"Full model load failed ({full_model_error}); weights load failed ({weights_error})"
                ) from weights_error
        raise RuntimeError(f"Full model load failed ({full_model_error})") from full_model_error


MODEL_PATH = resolve_model_path(MODEL_PATH_RAW)
model_load_error = None
print(f"[*] Loading Brain Tumor Detection Model from: {MODEL_PATH}")
try:
    model, load_mode = load_brain_tumor_model(str(MODEL_PATH))
    print(f"[+] Model loaded successfully! mode={load_mode}")
except Exception as e:
    print(f"[!] Failed to load model from {MODEL_PATH}: {e}")
    model = None
    model_load_error = str(e)

def preprocess_image(image_bytes):
    """Preprocess image for model prediction"""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_resized = img.resize((IMAGE_SIZE, IMAGE_SIZE))
    img_array = np.array(img_resized, dtype=np.float32) / 255.0
    img_tensor = np.expand_dims(img_array, axis=0)  # Shape (1, 128, 128, 3)
    return img, img_tensor

def calculate_risk_level(predicted_class, confidence):
    """Calculate risk level based on prediction"""
    if predicted_class == "No Tumor":
        return "Low"
    elif confidence > 95:
        return "High"
    else:
        return "Medium"

def generate_doctor_notes(predicted_class, confidence):
    """Generate doctor notes based on prediction"""
    if predicted_class == "No Tumor":
        return "Scan shows normal cortical parenchyma without mass effect."
    else:
        return f"Significant neural feature activation indicating {predicted_class} with {confidence}% confidence. Recommend contrast T1/T2 MRI sequence and neurosurgical review."

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "online",
        "model_loaded": model is not None,
        "model_path": str(MODEL_PATH),
        "model_load_error": model_load_error,
        "classes": CLASS_NAMES,
        "time": datetime.datetime.now().isoformat()
    })

@app.route("/api/predict", methods=["POST"])
def predict():
    """Main prediction endpoint"""
    if "file" not in request.files and "image" not in request.files:
        return jsonify({"error": "No image file provided in form-data key 'file'"}), 400

    file = request.files.get("file") or request.files.get("image")
    if not file or file.filename == "":
        return jsonify({"error": "Empty file provided"}), 400

    patient_name = request.form.get("patientName", "Anonymous Patient")
    patient_age = request.form.get("patientAge", 45)
    patient_gender = request.form.get("patientGender", "Unspecified")

    try:
        image_bytes = file.read()
        pil_img, img_tensor = preprocess_image(image_bytes)

        file_ext = os.path.splitext(file.filename)[1] or ".jpg"
        unique_filename = f"mri_{uuid.uuid4().hex[:8]}{file_ext}"
        saved_path = UPLOAD_FOLDER / unique_filename
        pil_img.save(saved_path)

        # Generate image URL (adjust based on your deployment)
        image_url = f"http://localhost:8000/uploads/{unique_filename}"

        if model is None:
            return jsonify({
                "error": "Model is unavailable for inference.",
                "details": model_load_error
            }), 503

        predictions = model.predict(img_tensor)[0]
        if len(predictions) != len(CLASS_NAMES):
            return jsonify({
                "error": "Model output shape does not match configured classes.",
                "details": f"output={len(predictions)} classes={len(CLASS_NAMES)}"
            }), 500

        probabilities = {
            class_name: round(float(predictions[idx]) * 100, 2)
            for idx, class_name in enumerate(CLASS_NAMES)
        }

        top_idx = int(np.argmax(predictions))
        predicted_class = CLASS_NAMES[top_idx]
        confidence = round(float(predictions[top_idx]) * 100, 2)

        risk_level = calculate_risk_level(predicted_class, confidence)
        report_id = f"REP-{datetime.datetime.now().year}-{np.random.randint(1000, 9999)}"
        doctor_notes = generate_doctor_notes(predicted_class, confidence)

        result_item = {
            "reportId": report_id,
            "prediction": predicted_class,
            "confidence": confidence,
            "probabilities": probabilities,
            "imageUrl": image_url,
            "imageName": file.filename,
            "imageSize": f"{round(len(image_bytes) / (1024 * 1024), 2)} MB",
            "date": datetime.datetime.now().isoformat(),
            "riskLevel": risk_level,
            "patientName": patient_name,
            "patientAge": int(patient_age) if str(patient_age).isdigit() else 45,
            "patientGender": patient_gender,
            "hospitalName": "Metropolitan Neurological Institute",
            "doctorNotes": doctor_notes
        }

        return jsonify(result_item), 200

    except Exception as e:
        print(f"[!] Error during prediction: {e}")
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route("/uploads/<filename>", methods=["GET"])
def get_upload(filename):
    """Serve uploaded files"""
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == "__main__":
    port = int(os.getenv('PORT', 8000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    app.run(host="0.0.0.0", port=port, debug=debug)