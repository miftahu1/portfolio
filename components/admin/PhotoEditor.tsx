'use client';

import { useState, useEffect } from 'react';
import { Photo } from '@/lib/types';
import { IconX } from '@tabler/icons-react';

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
    onClose(); // Close the modal after deletion
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      {/* Increased max-width and added height constraints */}
      <div className="bg-gray-800 p-6 rounded-xl max-w-5xl w-full h-[90vh] max-h-[800px] flex flex-col shadow-2xl">
        <div className="flex justify-between items-start mb-4 flex-shrink-0">
            <h2 className="text-2xl font-bold">Edit Photo</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <IconX size={28} />
            </button>
        </div>
        {/* Added overflow-hidden to contain the two columns */}
        <div className="flex flex-col md:flex-row gap-6 overflow-hidden flex-grow">
          {/* Image container with fixed aspect ratio and background */}
          <div className="md:w-3/5 lg:w-2/3 bg-gray-900/50 rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_1200/v1/${photo.publicId}`}
              alt={photo.title || ''} 
              className="object-contain w-full h-full" 
            />
          </div>
          {/* Form container with scrolling for smaller heights */}
          <div className="md:w-2/5 lg:w-1/3 flex flex-col overflow-y-auto pr-2">
            <div className="flex-grow">
                <label htmlFor="title" className="text-sm font-semibold mb-2 text-gray-400">Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-gray-700 text-white rounded-md px-4 py-2 mb-4 w-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-purple"
                />
                <label htmlFor="description" className="text-sm font-semibold mb-2 text-gray-400">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="bg-gray-700 text-white rounded-md px-4 py-2 mb-4 w-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-purple"
                />
                <div className="flex items-center mb-6">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-5 w-5 bg-gray-700 border-gray-600 rounded text-accent-purple focus:ring-accent-purple"
                  />
                  <label htmlFor="featured" className="ml-3 text-white select-none">Featured Photo</label>
                </div>
            </div>
            <div className="flex-shrink-0">
                <div className="flex justify-between items-center">
                    {!showDeleteConfirm ? (
                        <button onClick={() => setShowDeleteConfirm(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors w-full text-center">
                            Delete
                        </button>
                    ) : (
                        <div className='w-full'>
                            <p className='text-white text-center mb-2'>Are you sure?</p>
                            <div className='flex gap-2'>
                                <button onClick={handleDelete} className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-md transition-colors w-full">Yes, Delete</button>
                                <button onClick={() => setShowDeleteConfirm(false)} className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors w-full">No</button>
                            </div>
                        </div>
                    )}
                </div>
                <div className='flex gap-2 mt-2'>
                    <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-md transition-colors w-full">Cancel</button>
                    <button onClick={handleSave} className="bg-accent-purple hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-md transition-colors w-full">Save</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
