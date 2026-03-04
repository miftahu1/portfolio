'use client';

import { useState, useRef } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageUploadProps {
  onUpload: (publicId: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState('');
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const makeClientCrop = async (crop: Crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const cropped = await getCroppedImg(
        imgRef.current,
        crop,
        'newFile.jpeg'
      );
      setCroppedImageUrl(URL.createObjectURL(cropped));
    }
  };

  const getCroppedImg = (
    image: HTMLImageElement,
    crop: Crop,
    fileName: string
  ): Promise<File> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          const file = new File([blob], fileName, { type: 'image/jpeg' });
          resolve(file);
        },
        'image/jpeg',
        1
      );
    });
  };

  const handleUpload = async () => {
    if (!croppedImageUrl) return;
    setIsLoading(true);

    const blob = await fetch(croppedImageUrl).then(r => r.blob());
    const file = new File([blob], 'upload.jpg', { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();
        onUpload(data.public_id);
    } catch (error) {
        console.error('Upload failed:', error);
    } finally {
        setIsLoading(false);
        setImgSrc('');
        setCroppedImageUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
  };

  const handleCancel = () => {
    setImgSrc('');
    setCroppedImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="file-upload" className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
            Select Image
        </label>
        <input id="file-upload" ref={fileInputRef} type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
      </div>

      {imgSrc && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-start'>
              <div className='bg-gray-700 p-4 rounded-lg'>
                <h3 className="text-xl font-semibold mb-4">Crop Image</h3>
                <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={makeClientCrop} aspect={1}>
                    <img ref={imgRef} src={imgSrc} style={{ maxHeight: '70vh' }}/>
                </ReactCrop>
              </div>
              {croppedImageUrl && (
                <div className='bg-gray-700 p-4 rounded-lg'>
                    <h3 className="text-xl font-semibold mb-4">Preview</h3>
                    <div className="flex justify-center">
                        <img alt="Crop preview" src={croppedImageUrl} className="rounded-lg shadow-md"/>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <button onClick={handleCancel} disabled={isLoading} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button onClick={handleUpload} disabled={isLoading} className="bg-accent-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50">
                            {isLoading ? 'Uploading...' : 'Upload Image'}
                        </button>
                    </div>
                </div>
              )}
          </div>
      )}
    </div>
  );
}
