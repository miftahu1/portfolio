"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type Props = {
  value?: string;
  onChange: (url: string) => void;
  folder?: "projects" | "blog" | "uploads";
  label?: string;
};

export default function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "Image",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value changes externally
  useEffect(() => {
    if (value) {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      onChange(data.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
      setPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[11px] text-white/80">{label}</label>
      <div className="space-y-2">
        {preview && (
          <div className="relative h-32 w-full overflow-hidden rounded-lg border border-white/10">
            <Image
              src={preview}
              alt="Preview"
              fill
              sizes="(max-width: 768px) 100vw, 50vw" // Added sizes prop
              className="object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 rounded-full bg-red-500/90 px-2 py-1 text-[10px] text-white hover:bg-red-500"
            >
              Remove
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id={`image-upload-${folder}`}
          />
          <label
            htmlFor={`image-upload-${folder}`}
            className={`cursor-pointer rounded-md border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] text-white/80 transition-colors hover:border-accent/60 hover:text-white ${
              uploading ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {uploading ? "Uploading…" : preview ? "Change Image" : "Upload Image"}
          </label>
          {value && (
            <input
              type="text"
              value={value}
              readOnly
              className="flex-1 rounded-md border border-white/10 bg-black/20 px-2 py-1.5 text-[10px] text-muted"
              placeholder="Image path will appear here"
            />
          )}
        </div>
      </div>
    </div>
  );
}

