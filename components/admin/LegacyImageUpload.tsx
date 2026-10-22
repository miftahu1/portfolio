'use client';

import { CldUploadButton } from "next-cloudinary";

interface ImageUploadProps {
  value: string;
  onChange: (src: string) => void;
  folder?: string;
  label?: string;
}

export default function LegacyImageUpload({ value, onChange, folder, label }: ImageUploadProps) {
  return (
    <div className="space-y-2">
        {label && <label className="text-sm font-semibold text-white/90">{label}</label>}
        <div className="flex items-center gap-4">
        <img src={value} alt="" className="w-24 h-24 rounded-lg object-cover" />
        <CldUploadButton
            options={{ 
                maxFiles: 1,
                folder: folder ?? "images",
            }}
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={(result: any) => {
                onChange(result.info.secure_url);
            }}
            className="flex-1 rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-accent-purple focus:shadow-glow-pink"
        >
            Upload an Image
        </CldUploadButton>
        </div>
    </div>
  );
}
