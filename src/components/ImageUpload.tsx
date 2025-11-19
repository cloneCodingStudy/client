"use client";

import { useRef } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

type Props = {
  imageUrls: string[];
  setImageUrls: (urls: string[]) => void;
};

export default function ImageUpload({ imageUrls, setImageUrls }: Props) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const ref = useRef<HTMLInputElement | null>(null);

  const MAX_IMAGES = 5;

  const handleImageUpload = async (file: File) => {
    if (imageUrls.length >= MAX_IMAGES) {
      toast.error(`최대 ${MAX_IMAGES}장까지 업로드가 가능합니다.`);
      return;
    }
    try {
      const filename = `${Date.now()}-${file.name}`;

      // URL 요청
      const res = await fetch(`${API_URL}/api/s3/presigned-url?filename=${filename}`, {
        method: "POST",
      });

      const presignedUrl = await res.text();

      //이후 s3로 이미지 업로드하기
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
      });

      if (!uploadRes.ok) {
        toast.error("이미지 업로드 실패");
        return;
      }
      const imageUrl = presignedUrl.split("?")[0];

      setImageUrls([...imageUrls, imageUrl]);
      toast.success("이미지 업로드 완료");
    } catch (err) {
      console.error(err);
      toast.error("이미지 업로드 중 오류 발생");
    }
  };

  const handleDelete = (index: number) => {
    const updated = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updated);
    toast.success("이미지 삭제");
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        ref={ref}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
          }
        }}
      />

      {/* 버튼 */}
      <div
        className={`flex items-center gap-2 text-gray-600 text-sm cursor-pointer hover:text-primary-purple
          ${imageUrls.length >= MAX_IMAGES ? "opacity-40 cursor-not-allowed" : ""}
        `}
        onClick={() => {
          if (imageUrls.length < MAX_IMAGES) ref.current?.click();
        }}
      >
        사진 첨부하기 ({imageUrls.length}/{MAX_IMAGES})
      </div>

      {/* 미리보기 */}
      {imageUrls.length > 0 && (
        <div className="flex gap-3 flex-wrap mt-2">
          {imageUrls.map((url, i) => (
            <div key={i} className="relative w-32 h-32">
              <Image src={url} alt="preview" fill className="object-cover rounded-lg border" />

              {/* 삭제  */}
              <button
                onClick={() => handleDelete(i)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded hover:bg-black"
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
