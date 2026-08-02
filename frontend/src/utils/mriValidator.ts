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

        if (width > 4096 || height > 4096) {
          return resolve({ isValid: false, error: 'Image dimensions are too large (maximum 4096x4096 pixels allowed).' });
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
        let totalBrightness = 0;
        let sampleCount = 0;
        const step = Math.max(1, Math.floor(data.length / (4 * 4000))); // sample ~4000 pixels

        const intensities: number[] = [];

        for (let i = 0; i < data.length; i += 4 * step) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const diff = (Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r)) / 3;
          const brightness = (r + g + b) / 3;

          totalColorDiff += diff;
          totalBrightness += brightness;
          intensities.push(brightness);
          sampleCount++;
        }

        const avgColorDiff = totalColorDiff / (sampleCount || 1);

        if (avgColorDiff > 14.0) {
          return resolve({
            isValid: false,
            error: 'Uploaded image is a color photo/non-MRI image. Brain MRI scans must be monochromatic / grayscale.'
          });
        }

        // 2. Corner / Background Darkness Check
        // Brain MRIs are centered head scans with dark ambient background around corners.
        const cornerW = Math.max(1, Math.floor(width * 0.10));
        const cornerH = Math.max(1, Math.floor(height * 0.10));
        let cornerSum = 0;
        let cornerPixels = 0;

        for (let y = 0; y < height; y += Math.max(1, Math.floor(height / 40))) {
          for (let x = 0; x < width; x += Math.max(1, Math.floor(width / 40))) {
            const isCorner =
              (x < cornerW || x >= width - cornerW) &&
              (y < cornerH || y >= height - cornerH);
            if (isCorner) {
              const idx = (y * width + x) * 4;
              const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
              cornerSum += brightness;
              cornerPixels++;
            }
          }
        }

        const avgCornerBrightness = cornerSum / (cornerPixels || 1);

        if (avgCornerBrightness > 110.0) {
          return resolve({
            isValid: false,
            error: 'Uploaded file does not appear to be a Brain MRI scan (bright background detected; MRI scans have dark perimeter backgrounds).'
          });
        }

        // 3. Intensity Standard Deviation Check
        const meanIntensity = totalBrightness / (sampleCount || 1);
        const variance = intensities.reduce((acc, val) => acc + Math.pow(val - meanIntensity, 2), 0) / (sampleCount || 1);
        const stdDev = Math.sqrt(variance);

        if (stdDev < 10.0) {
          return resolve({
            isValid: false,
            error: 'Image lacks tissue contrast variation expected in a Brain MRI scan.'
          });
        }

        // 4. Foreground Tissue Ratio Check
        const foregroundCount = intensities.filter((val) => val > 30).length;
        const foregroundRatio = foregroundCount / (sampleCount || 1);

        if (foregroundRatio < 0.05 || foregroundRatio > 0.95) {
          return resolve({
            isValid: false,
            error: 'Image structural proportions do not match a Brain MRI scan slice.'
          });
        }

        return resolve({ isValid: true });
      };

      img.onerror = () => resolve({ isValid: false, error: 'Failed to load image file.' });
    };

    reader.onerror = () => resolve({ isValid: false, error: 'Failed to read image file.' });
  });
}
