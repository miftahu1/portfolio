'use client';

import { useState, useEffect } from 'react';
import { Photo } from '@/lib/types';
import ImageUpload from '@/components/admin/ImageUpload';
import PhotoEditor from '@/components/admin/PhotoEditor';
import { IconStar, IconPencil, IconFilter, IconSortAscending } from '@tabler/icons-react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function PhotosAdminPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

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
  
  const slides = filteredPhotos.map(photo => ({
      src: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/${photo.publicId}`
  }));

  return (
    <div className="min-h-screen text-white p-4 sm:p-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4 sm:mb-0">Photo Management</h1>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex items-center">
                    <IconFilter size={20} className="absolute left-3 text-gray-400"/>
                    <select id="filter" value={filter} onChange={e => setFilter(e.target.value)} className="bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-accent-purple transition-all">
                        <option value="all">All</option>
                        <option value="featured">Featured</option>
                        <option value="unfeatured">Unfeatured</option>
                    </select>
                </div>
                <div className="relative flex items-center">
                    <IconSortAscending size={20} className="absolute left-3 text-gray-400"/>
                    <select id="sort" value={sort} onChange={e => setSort(e.target.value)} className="bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-accent-purple transition-all">
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>
            </div>
        </header>
        
        <div className="bg-gray-800 rounded-xl p-4 sm:p-8 mb-8 sm:mb-12 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 tracking-tight text-center">Upload New Photo</h2>
          <ImageUpload onUpload={handleUpload} />
        </div>

        <main>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredPhotos.map((photo, index) => (
                <div key={photo.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg group">
                    <div className="relative cursor-pointer" onClick={() => setLightboxIndex(index)}>
                        <img src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_400,h_400/v1/${photo.publicId}`} alt={photo.title || ''} className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110" />
                        {photo.featured && (
                            <div className="absolute top-2 right-2 bg-accent-blue/80 text-white p-1.5 rounded-full backdrop-blur-sm">
                                <IconStar size={16} />
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold truncate">{photo.title || 'Untitled'}</h3>
                        <p className="text-gray-400 text-sm truncate h-10">{photo.description || 'No description'}</p>
                        <button onClick={() => setEditingPhoto(photo)} className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
                            <IconPencil size={16} />
                            Edit
                        </button>
                    </div>
                </div>
                ))}
            </div>
        </main>

        {editingPhoto && <PhotoEditor photo={editingPhoto} onClose={() => setEditingPhoto(null)} onSave={handleSave} onDelete={handleDelete} />}
        
        <Lightbox
            open={lightboxIndex >= 0}
            index={lightboxIndex}
            close={() => setLightboxIndex(-1)}
            slides={slides}
        />
      </div>
    </div>
  );
}
