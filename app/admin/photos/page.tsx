'use client';

import { useState, useEffect } from 'react';
import { Photo } from '@/lib/types';
import ImageUpload from '@/components/admin/ImageUpload';
import PhotoEditor from '@/components/admin/PhotoEditor';
import { IconStar, IconX } from '@tabler/icons-react';

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
    <div className="min-h-screen text-white p-8 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
            <h1 className="text-5xl font-bold tracking-tighter">Photo Management</h1>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <select id="filter" value={filter} onChange={e => setFilter(e.target.value)} className="bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-accent-purple transition-all">
                        <option value="all">All</option>
                        <option value="featured">Featured</option>
                        <option value="unfeatured">Unfeatured</option>
                    </select>
                </div>
                <div className="relative">
                    <select id="sort" value={sort} onChange={e => setSort(e.target.value)} className="bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-accent-purple transition-all">
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>
            </div>
        </header>
        
        <div className="glass rounded-xl p-8 mb-12 border border-gray-700/50 shadow-lg">
          <h2 className="text-3xl font-semibold mb-6 tracking-tight">Upload New Photo</h2>
          <ImageUpload onUpload={handleUpload} />
        </div>

        <main>
          <div className="masonry-gallery">
            {filteredPhotos.map(photo => (
              <div key={photo.id} className="break-inside-avoid mb-6 relative group cursor-pointer overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out" onClick={() => setEditingPhoto(photo)}>
                <img src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_500,h_500/v1/${photo.publicId}`} alt={photo.title || ''} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-xl font-bold drop-shadow-lg">{photo.title || 'Untitled'}</h3>
                  <p className="text-gray-300 text-sm drop-shadow-md">{photo.description || 'No description'}</p>
                </div>
                {photo.featured && (
                    <div className="absolute top-3 right-3 bg-accent-blue/80 text-white p-2 rounded-full backdrop-blur-sm shadow-lg">
                        <IconStar size={20} />
                    </div>
                )}
              </div>
            ))}
          </div>
        </main>

        {editingPhoto && <PhotoEditor photo={editingPhoto} onClose={() => setEditingPhoto(null)} onSave={handleSave} onDelete={handleDelete} />}
      </div>
    </div>
  );
}

// Add this to your globals.css for the masonry layout
/*
@layer utilities {
    .masonry-gallery {
        column-count: 5; // Adjust column count for different screen sizes
        column-gap: 1.5rem;
    }
    
    @media (max-width: 1280px) {
        .masonry-gallery { column-count: 4; }
    }
    
    @media (max-width: 1024px) {
        .masonry-gallery { column-count: 3; }
    }

    @media (max-width: 768px) {
        .masonry-gallery { column-count: 2; }
    }

    @media (max-width: 640px) {
        .masonry-gallery { column-count: 1; }
    }
}
*/