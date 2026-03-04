'use client';

import { useState, useEffect } from 'react';
import { Photo } from '@/lib/types';

interface PhotoEditorProps {
  photo: Photo | null;
  onClose: () => void;
  onSave: (photo: Photo, data: Partial<Photo>) => void;
  onDelete: (id: string) => void;
}

export default function PhotoEditor({ photo, onClose, onSave, onDelete }: PhotoEditorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (photo) {
      setTitle(photo.title || '');
      setDescription(photo.description || '');
      setFeatured(photo.featured || false);
      setShowDeleteConfirm(false);
    }
  }, [photo]);

  if (!photo) return null;

  const handleSave = () => {
    onSave(photo, { title, description, featured });
  };

  const handleDelete = () => {
    onDelete(photo.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-8 rounded-lg max-w-4xl w-full shadow-2xl">
        <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold">Edit Photo</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_800/v1/${photo.publicId}`} alt={photo.title || ''} className="w-full h-auto rounded-lg shadow-lg" />
          </div>
          <div className="md:w-1/2 flex flex-col">
            <label htmlFor="title" className="text-sm font-semibold mb-2 text-gray-400">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-700 text-white rounded-md px-4 py-2 mb-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
            <label htmlFor="description" className="text-sm font-semibold mb-2 text-gray-400">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-700 text-white rounded-md px-4 py-2 mb-4 h-36 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
            <div className="flex items-center mb-6">
              <input
                id="featured"
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-5 w-5 bg-gray-700 border-gray-600 rounded text-accent-blue focus:ring-accent-blue"
              />
              <label htmlFor="featured" className="ml-3 text-white">Featured</label>
            </div>
            <div className="flex-grow"></div>
            <div className="flex justify-between items-center">
                {!showDeleteConfirm ? (
                    <button onClick={() => setShowDeleteConfirm(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        Delete
                    </button>
                ) : (
                    <div className='flex items-center'>
                        <p className='text-white mr-4'>Are you sure?</p>
                        <button onClick={handleDelete} className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-md transition-colors mr-2">Yes, Delete</button>
                        <button onClick={() => setShowDeleteConfirm(false)} className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors">No</button>
                    </div>
                )}
              <div className='flex'>
                <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors mr-2">Cancel</button>
                <button onClick={handleSave} className="bg-accent-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
