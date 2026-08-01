/**
 * Client-side validation for Brain MRI images
 * Checks color variance, border perimeter darkness, and tissue contrast structure
 * to prevent uploading non-MRI photos (flowers, pets, landscapes, selfies, etc.)
 */
export async function validateMRIImageClientSide(file: File): Promise<{ isValid: boolean; error?: string }> {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      return resolve({ isValid: false, error: 'Uploaded file is not a valid image format.' });
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const width = img.width;
        const height = img.height;

        if (width < 64 || height < 64) {
          return resolve({ isValid: false, error: 'Image dimensions are too small (minimum 64x64 pixels required).' });
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return resolve({ isValid: true });
        }

        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data; // RGBA array

        // 1. Color Saturation / Channel Variance Check
        // Brain MRIs are grayscale. RGB channels must be almost identical across pixels.
        let totalColorDiff = 0;
        let sampleCount = 0;
        const step = Math.max(1, Math.floor(data.length / (4 * 4000))); // sample ~4000 pixels

        for (let i = 0; i < data.length; i += 4 * step) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const diff = (Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r)) / 3;
          totalColorDiff += diff;
          sampleCount++;
        }

        const avgColorDiff = totalColorDiff / (sampleCount || 1);

        if (avgColorDiff > 14.0) {
          return resolve({
            isValid: false,
            error: 'Uploaded file appears to be a color photo or non-MRI image. Brain MRI scans must be monochromatic / grayscale.'
          });
        }

        // 2. Border Perimeter Darkness Check
        // Brain MRI scans feature a dark/black background perimeter around the head scan.
        const bW = Math.max(1, Math.floor(Math.min(width, height) * 0.08));
        let borderTotal = 0;
        let borderCount = 0;

        for (let y = 0; y < height; y += 4) {
          for (let x = 0; x < width; x += 4) {
            const isBorder = y < bW || y >= height - bW || x < bW || x >= width - bW;
            if (isBorder) {
              const idx = (y * width + x) * 4;
              const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
              borderTotal += brightness;
              borderCount++;
            }
          }
        }

        const borderAvg = borderTotal / (borderCount || 1);

        if (borderAvg > 75.0) {
          return resolve({
            isValid: false,
            error: 'Uploaded image lacks the characteristic dark background border of a Brain MRI scan. Please upload a valid axial brain MRI scan.'
          });
        }

        // 3. Background Pixel Ratio Check
        let darkPixelCount = 0;
        let totalPixels = 0;

        for (let i = 0; i < data.length; i += 4 * step) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (brightness < 35.0) {
            darkPixelCount++;
          }
          totalPixels++;
        }

        const darkPixelRatio = darkPixelCount / (totalPixels || 1);

        if (darkPixelRatio < 0.15) {
          return resolve({
            isValid: false,
            error: 'Image background ratio does not match Brain MRI scan characteristics. Please upload a genuine brain MRI scan image.'
          });
        }

        return resolve({ isValid: true });
      };

      img.onerror = () => resolve({ isValid: false, error: 'Failed to load image file.' });
    };

    reader.onerror = () => resolve({ isValid: false, error: 'Failed to read image file.' });
  });
}
