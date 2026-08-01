"""
Image processing utilities for MRI brain tumor detection
"""
import numpy as np
from PIL import Image
import io


def load_and_preprocess_image(image_bytes, target_size=(128, 128)):
    """
    Load and preprocess image for model input
    
    Args:
        image_bytes: Raw image bytes
        target_size: Target size for resizing (default: 128x128)
    
    Returns:
        tuple: (PIL image, numpy array tensor)
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_resized = img.resize(target_size)
    img_array = np.array(img_resized, dtype=np.float32) / 255.0
    img_tensor = np.expand_dims(img_array, axis=0)
    return img, img_tensor


def normalize_image(image_array):
    """
    Normalize image array to 0-1 range
    
    Args:
        image_array: numpy array of image
    
    Returns:
        numpy array: Normalized image
    """
    return image_array.astype(np.float32) / 255.0


def apply_clahe(image):
    """
    Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
    for better contrast in MRI images
    
    Args:
        image: PIL Image or numpy array
    
    Returns:
        Processed image
    """
    import cv2
    
    if isinstance(image, Image.Image):
        image = np.array(image)
    
    # Convert to LAB color space
    lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    
    # Apply CLAHE to L channel
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l = clahe.apply(l)
    
    # Merge channels and convert back to RGB
    lab = cv2.merge([l, a, b])
    enhanced = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
    
    return enhanced


def validate_mri_image(image_bytes):
    """
    Validate if the uploaded file is a valid Brain MRI scan image.
    
    Args:
        image_bytes: Raw image bytes
    
    Returns:
        tuple: (is_valid: bool, error_message: str | None)
    """
    try:
        # Check image file integrity
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
        
        # Reopen image after verify() call
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        width, height = img.size
        
        # Check dimensions
        if width < 64 or height < 64:
            return False, "Image dimensions are too small (minimum 64x64 pixels required)."
        
        if width > 4096 or height > 4096:
            return False, "Image dimensions are too large (maximum 4096x4096 pixels allowed)."
        
        # Check file size (max 16MB)
        if len(image_bytes) > 16 * 1024 * 1024:
            return False, "File size too large (maximum 16MB allowed)."
        
        # Convert image to numpy array for structural analysis
        img_array = np.array(img, dtype=np.float32)  # Shape (H, W, 3)
        r, g, b = img_array[:, :, 0], img_array[:, :, 1], img_array[:, :, 2]

        # Color Saturation / Channel Variance Check
        # Medical MRI scans are monochromatic / grayscale. RGB channels are nearly identical.
        color_diff = (np.abs(r - g) + np.abs(g - b) + np.abs(b - r)) / 3.0
        mean_color_diff = float(np.mean(color_diff))
        
        # High color difference (> 35.0) indicates a vibrant color photo (flowers, cars, pets, etc.)
        if mean_color_diff > 35.0:
            return False, "Uploaded file appears to be a color photo/non-MRI image. Brain MRI scans must be monochromatic/grayscale."

        return True, None


        
    except Exception as e:
        return False, f"Invalid or corrupted image file: {str(e)}"