import api from "@/api/axiosInstance";
import axios from "axios";

export const imageService = {
  getPresignedUrl: async (filename: string) => {
    const res = await api.post("/api/s3/presigned-url", null, {
      params: { filename }
    });
    return res.data; 
  },

  uploadToS3: async (url: string, file: File) => {
    try {
      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
        withCredentials: false 
      });
      return url.split('?')[0]; 
    } catch (error) {
      console.error("S3 업로드 에러:", error);
      throw error;
    }
  }
};