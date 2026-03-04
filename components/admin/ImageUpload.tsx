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

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
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

    const blob = await fetch(croppedImageUrl).then(r => r.blob());
    const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    onUpload(data.public_id);
    setImgSrc('');
    setCroppedImageUrl('');
  };

  return (
    <div className="App">
      <input type="file" accept="image/*" onChange={onSelectFile} />
      {imgSrc && (
        <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={makeClientCrop}>
          <img ref={imgRef} src={imgSrc} />
        </ReactCrop>
      )}
      {croppedImageUrl && (
        <div>
          <img alt="Crop preview" src={croppedImageUrl} />
          <button onClick={handleUpload}>Upload Cropped Image</button>
        </div>
      )}
    </div>
  );
}
