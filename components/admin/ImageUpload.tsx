"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Props = {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  label: string;
};

export default function ImageUpload({ value, onChange, folder, label }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size too large. Max 5MB allowed.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error("Upload error:", error);
      
      // Fallback: Try client-side upload if API fails
      try {
        const clientSideUrl = await clientSideUpload(file, folder);
        onChange(clientSideUrl);
      } catch (clientError) {
        alert("Upload failed. Please try another image or check your Cloudinary configuration.");
      }
    } finally {
      setUploading(false);
    }
  };

  // Client-side upload fallback (requires upload preset)
  const clientSideUpload = async (file: File, folder: string): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'portfolio_upload';
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Client-side upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-white/90">{label}</label>
      <div className="glass rounded-xl border border-white/20 p-4">
        {value ? (
          <div className="space-y-3">
            <div className="relative group">
              <img
                src={value}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => window.open(value, '_blank')}
                  className="text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
                  title="Open in new tab"
                >
                  🔍
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs text-white/60 break-all flex-1">{value}</p>
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-white/50 transition-all cursor-pointer"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            {uploading ? (
              <div className="space-y-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto"
                />
                <p className="text-sm text-white/70">Uploading to Cloudinary...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">↑</span>
                </div>
                <p className="text-sm font-semibold text-white">Click to upload</p>
                <p className="text-xs text-white/50">
                  PNG, JPG, GIF up to 5MB
                </p>
                <p className="text-xs text-blue-300 mt-2">
                  Powered by Cloudinary ☁️
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
      {!value && (
        <p className="text-xs text-white/50">
          Images are stored securely in Cloudinary CDN for fast loading.
        </p>
      )}
    </div>
  );
}