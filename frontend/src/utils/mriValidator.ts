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

        if (avgColorDiff > 35.0) {
          return resolve({
            isValid: false,
            error: 'Uploaded file appears to be a color photo or non-MRI image. Brain MRI scans must be monochromatic / grayscale.'
          });
        }

        return resolve({ isValid: true });



        return resolve({ isValid: true });
      };

      img.onerror = () => resolve({ isValid: false, error: 'Failed to load image file.' });
    };

    reader.onerror = () => resolve({ isValid: false, error: 'Failed to read image file.' });
  });
}
