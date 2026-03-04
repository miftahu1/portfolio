'use client';

import { useState, useEffect } from 'react';
import { Photo } from '@/lib/types';

interface PhotoEditorProps {
  photo: Photo | null;
  onClose: () => void;
  onSave: (photo: Photo, data: Partial<Photo>) => void;
}

export default function PhotoEditor({ photo, onClose, onSave }: PhotoEditorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (photo) {
      setTitle(photo.title || '');
      setDescription(photo.description || '');
      setFeatured(photo.featured || false);
    }
  }, [photo]);

  if (!photo) return null;

  const handleSave = () => {
    onSave(photo, { title, description, featured });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Edit Photo</h2>
        <div className="flex">
          <div className="w-1/2 pr-4">
            <img src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/${photo.publicId}`} alt="" className="w-full h-auto rounded-lg" />
          </div>
          <div className="w-1/2 flex flex-col">
            <label htmlFor="title" className="text-sm font-semibold mb-1">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-700 text-white rounded px-3 py-2 mb-4"
            />
            <label htmlFor="description" className="text-sm font-semibold mb-1">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-700 text-white rounded px-3 py-2 mb-4 h-32"
            />
            <div className="flex items-center mb-4">
              <input
                id="featured"
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="featured">Featured</label>
            </div>
            <div className="flex justify-end">
              <button onClick={onClose} className="bg-gray-600 px-4 py-2 rounded mr-2">Cancel</button>
              <button onClick={handleSave} className="bg-accent-blue px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
