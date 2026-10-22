'use client';

import { useState, useRef } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { IconX, IconUpload, IconLoader, IconCrop, IconTrash, IconPhoto } from '@tabler/icons-react';

interface ImageUploadProps {
  onUpload: (publicId: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState('');
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadAbortController = useRef<AbortController | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      );
      reader.readAsDataURL(e.target.files[0]);
      setIsCropping(false);
      setCroppedImageUrl('');
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
        0.9
      );
    });
  };

  const handleUpload = async () => {
    setIsLoading(true);
    setUploadProgress(0);
    setEstimatedTime(0);
    uploadAbortController.current = new AbortController();
    const startTime = Date.now();

    let file;
    const imageUrl = isCropping ? croppedImageUrl : imgSrc;

    if (!imageUrl) {
        setIsLoading(false);
        return;
    }

    const blob = await fetch(imageUrl).then(r => r.blob());
    file = new File([blob], 'upload.jpg', { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, true);
    xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setUploadProgress(progress);

            const elapsedTime = (Date.now() - startTime) / 1000;
            const remainingTime = (elapsedTime / progress) * (100 - progress);
            setEstimatedTime(remainingTime);
        }
    };

    xhr.onload = () => {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            onUpload(data.public_id);
        } else {
            console.error('Upload failed:', xhr.statusText);
        }
        resetState();
    };

    xhr.onerror = () => {
        console.error('Upload failed');
        resetState();
    }

    xhr.onabort = () => {
        console.log('Upload cancelled');
        resetState();
    }

    uploadAbortController.current.signal.addEventListener('abort', () => {
        xhr.abort();
    });

    xhr.send(formData);
  };
  
  const resetState = () => {
    setIsLoading(false);
    setImgSrc('');
    setCroppedImageUrl('');
    setIsCropping(false);
    setUploadProgress(0);
    setEstimatedTime(0);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const handleCancel = () => {
    if (isLoading) {
        uploadAbortController.current?.abort();
    } else {
        resetState();
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {!imgSrc && (
        <div 
            className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer hover:border-accent-purple transition-colors"
            onClick={() => fileInputRef.current?.click()}
        >
            <IconPhoto size={48} className="mx-auto text-gray-500" />
            <p className="mt-2 text-gray-400">Click to select an image</p>
            <input id="file-upload" ref={fileInputRef} type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
        </div>
      )}

      {imgSrc && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg relative">
            <button onClick={handleCancel} className="absolute top-2 right-2 bg-gray-700 rounded-full p-1 text-white hover:bg-gray-600 z-20">
                <IconX size={20} />
            </button>

            {isLoading ? (
                <div className="text-center">
                    <p className="text-lg font-semibold">Uploading...</p>
                    <div className="w-full bg-gray-600 rounded-full h-2.5 my-4">
                        <div className="bg-accent-blue h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-400">
                        {uploadProgress.toFixed(0)}% complete
                        {estimatedTime > 0 && ` - Estimated time remaining: ${estimatedTime.toFixed(0)} seconds`}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <div className='w-full max-h-[60vh] flex justify-center items-center'>
                        {isCropping ? (
                            <ReactCrop 
                                crop={crop} 
                                onChange={c => setCrop(c)} 
                                onComplete={makeClientCrop}
                                className="max-w-full max-h-full"
                            >
                                <img ref={imgRef} src={imgSrc} className="max-h-[60vh] object-contain"/>
                            </ReactCrop>
                        ) : (
                            <img src={croppedImageUrl || imgSrc} alt="Preview" className="max-h-[60vh] rounded-lg object-contain"/>
                        )}
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {!isCropping ? (
                            <button onClick={() => setIsCropping(true)} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
                                <IconCrop size={20} />
                                Crop Image
                            </button>
                        ) : (
                            <button onClick={() => setIsCropping(false)} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
                                Show Preview
                            </button>
                        )}
                        <button onClick={handleUpload} className="flex items-center gap-2 bg-accent-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
                           <IconUpload size={20} />
                           Upload
                        </button>
                    </div>
                    {isCropping && crop && (
                         <button onClick={() => setCrop(undefined)} className="text-sm text-gray-400 hover:text-white mt-2">
                            Reset Crop
                        </button>
                    )}
                </div>
            )}
        </div>
      )}
    </div>
  );
}
