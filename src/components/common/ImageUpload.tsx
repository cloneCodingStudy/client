"use client";

import { useRef } from "react";
import Image from "next/image";
import { useImageUpload } from "@/hooks/common/useImageUpload";

type Props = {
  imageUrls: string[];
  setImageUrls: (urls: string[]) => void;
};

export default function ImageUpload({ imageUrls, setImageUrls }: Props) {
  const ref = useRef<HTMLInputElement | null>(null);
  const MAX_IMAGES = 5;

  const { uploadImage, removeImage, isUploading } = useImageUpload(
    imageUrls, 
    setImageUrls, 
    MAX_IMAGES
  );

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        ref={ref}
        className="hidden"
        onChange={async (e) => {
          if (e.target.files?.[0]) {
            await uploadImage(e.target.files[0]);
            e.target.value = "";
          }
        }}
      />

      <div
        className={`flex items-center gap-2 text-gray-600 text-sm cursor-pointer hover:text-primary-purple transition
          ${imageUrls.length >= MAX_IMAGES ? "opacity-40 cursor-not-allowed" : ""}
        `}
        onClick={() => {
          if (imageUrls.length < MAX_IMAGES) ref.current?.click();
        }}
      >
        📷 사진 첨부하기 ({imageUrls.length}/{MAX_IMAGES})
      </div>

      {imageUrls.length > 0 && (
        <div className="flex gap-3 flex-wrap mt-2">
          {imageUrls
            .filter((url) => typeof url === "string" && url.trim() !== "") 
            .map((url, i) => (
              <div key={`${url}-${i}`} className="relative w-24 h-24 md:w-32 md:h-32">
                <Image 
                  src={url} 
                  alt="preview" 
                  fill 
                  className="object-cover rounded-lg border" 
                  onError={(e) => console.error("이미지 로드 실패:", url)}
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-gray-800 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-black transition text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}