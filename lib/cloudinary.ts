import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to upload from client-side (using signed or unsigned method)
export async function uploadImage(file: File, folder: string = 'portfolio'): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'portfolio_upload');
  formData.append('folder', folder);
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return data.secure_url;
}

// Helper to delete image (server-side only)
export async function deleteImage(publicId: string) {
  return await cloudinary.uploader.destroy(publicId);
}

// Helper to list images
export async function listImages(folder: string = 'portfolio') {
  return await cloudinary.api.resources({
    type: 'upload',
    prefix: folder,
    max_results: 100,
  });
}

export default cloudinary;