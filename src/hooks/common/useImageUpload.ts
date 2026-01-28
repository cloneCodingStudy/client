import { useState } from "react";
import toast from "react-hot-toast";
import { imageService } from "@/services/imageService";

export const useImageUpload = (
  imageUrls: string[], 
  setImageUrls: (urls: string[]) => void, 
  maxCount: number = 5
) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File) => {
    if (imageUrls.length >= maxCount) {
      toast.error(`최대 ${maxCount}장까지 업로드가 가능합니다.`);
      return;
    }

    setIsUploading(true);
    try {
      const filename = `${Date.now()}-${file.name}`;
      
      const presignedUrl = await imageService.getPresignedUrl(filename);
      
      const finalUrl = await imageService.uploadToS3(presignedUrl, file);
      
      if (typeof finalUrl === "string") {
        setImageUrls([...imageUrls, finalUrl]);
        toast.success("이미지가 추가되었습니다.");
      }
      
      return finalUrl;
    } catch (err) {
      toast.error("이미지 업로드에 실패했습니다.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    toast.success("이미지가 삭제되었습니다.");
  };

  return { uploadImage, removeImage, isUploading };
};