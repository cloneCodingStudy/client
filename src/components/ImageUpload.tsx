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
      // 1. 파일명 생성 (중복 방지)
      const filename = `${Date.now()}-${file.name}`;

      const accessToken = localStorage.getItem("accessToken");

    // 2. Presigned URL 요청 시 헤더 추가
    const res = await fetch(`${API_URL}/api/s3/presigned-url?filename=${filename}`, {
      method: "POST",
      headers: {
        "Authorization": accessToken ? `Bearer ${accessToken}` : "",
      }
    });

    if (res.status === 403) {
      toast.error("로그인이 만료되었거나 권한이 없습니다.");
      return;
    }

    if (!res.ok) throw new Error("URL 생성 실패");
    
    const presignedUrl = await res.text();

      // 3. S3로 이미지 직접 업로드 (PUT)
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadRes.ok) {
        toast.error("이미지 업로드 실패");
        return;
      }

      // 4. 업로드 성공 시 URL 정제 (? 뒤의 토큰 제거)
      const imageUrl = presignedUrl.split("?")[0];

      // 5. 부모 상태 업데이트
      setImageUrls([...imageUrls, imageUrl]);
      toast.success("이미지가 추가되었습니다.");
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
            // 동일 파일 재선택을 위해 value 초기화
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
          {imageUrls.map((url, i) => (
            <div key={i} className="relative w-24 h-24 md:w-32 md:h-32">
              <Image 
                src={url} 
                alt="preview" 
                fill 
                className="object-cover rounded-lg border" 
              />
              <button
                type="button" // form submit 방지
                onClick={() => handleDelete(i)}
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