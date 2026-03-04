'use client';

import { useState, useEffect } from 'react';
import { Photo } from '@/lib/types';
import ImageUpload from '@/components/admin/ImageUpload';
import PhotoEditor from '@/components/admin/PhotoEditor';

export default function PhotosAdminPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    fetch('/api/photos')
      .then(res => res.json())
      .then(data => {
        setPhotos(data);
        setFilteredPhotos(data);
      });
  }, []);

  useEffect(() => {
    let filtered = [...photos];
    if (filter === 'featured') {
      filtered = filtered.filter(p => p.featured);
    } else if (filter === 'unfeatured') {
      filtered = filtered.filter(p => !p.featured);
    }

    if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt.seconds * 1000).getTime() - new Date(a.createdAt.seconds * 1000).getTime());
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt.seconds * 1000).getTime() - new Date(b.createdAt.seconds * 1000).getTime());
    }

    setFilteredPhotos(filtered);
  }, [photos, filter, sort]);

  const handleUpload = (publicId: string) => {
    fetch('/api/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    })
      .then(res => res.json())
      .then(newPhoto => setPhotos(prev => [newPhoto, ...prev]));
  };

  const handleDelete = (id: string) => {
    fetch(`/api/photos/${id}`, { method: 'DELETE' })
      .then(() => {
        setPhotos(prev => prev.filter(p => p.id !== id));
      });
  };

  const handleSave = (photo: Photo, data: Partial<Photo>) => {
    fetch(`/api/photos/${photo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(() => {
        setPhotos(prev =>
          prev.map(p => (p.id === photo.id ? { ...p, ...data } : p))
        );
        setEditingPhoto(null);
      });
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Manage Photos</h1>
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Upload New Photo</h2>
          <ImageUpload onUpload={handleUpload} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Uploaded Photos</h2>
            <div className="flex items-center">
              <div className="mr-4">
                <label htmlFor="filter" className="mr-2 text-gray-400">Filter:</label>
                <select id="filter" value={filter} onChange={e => setFilter(e.target.value)} className="bg-gray-700 text-white rounded px-4 py-2">
                  <option value="all">All</option>
                  <option value="featured">Featured</option>
                  <option value="unfeatured">Unfeatured</option>
                </select>
              </div>
              <div>
                <label htmlFor="sort" className="mr-2 text-gray-400">Sort:</label>
                <select id="sort" value={sort} onChange={e => setSort(e.target.value)} className="bg-gray-700 text-white rounded px-4 py-2">
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredPhotos.map(photo => (
              <div key={photo.id} className="relative group cursor-pointer transform hover:scale-105 transition-transform duration-300" onClick={() => setEditingPhoto(photo)}>
                <img src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_thumb,w_400,h_400,g_face/v1/${photo.publicId}`} alt={photo.title || ''} className="w-full h-auto rounded-lg shadow-lg" />
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                  <h3 className="text-white text-lg font-bold text-center mx-2">{photo.title}</h3>
                  {photo.featured && <span className="text-xs bg-accent-blue text-white px-2 py-1 rounded-full absolute top-2 right-2">Featured</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        {editingPhoto && <PhotoEditor photo={editingPhoto} onClose={() => setEditingPhoto(null)} onSave={handleSave} onDelete={handleDelete} />}
      </div>
    </div>
  );
}
