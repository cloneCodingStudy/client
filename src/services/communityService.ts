import api from "@/api/axiosInstance";
import { CommunityPost, CommunityPostListItem } from "@/types/community";
import { ApiResponse, PageResponse } from "@/types/api";
export const communityService = {
  getPosts: async (page = 0, size = 10, position?: any, tab = "ALL") => {
    const res = await api.get<PageResponse<CommunityPostListItem>>("/api/community-posts/posts", {
      params: { page, size, tab, ...position }
    });
    return res.data;
  },

  getPost: async (postId: number) => {
    const res = await api.get<ApiResponse<CommunityPost>>(`/api/community-posts/${postId}`);
    return res.data.data;
  },

  toggleLike: async (postId: number) => {
    const res = await api.post<ApiResponse<number>>(`/api/community-posts/${postId}/likes`);
    return res.data.data; 
  },

  toggleBookmark: async (postId: number) => {
    const res = await api.post<ApiResponse<void>>(`/api/community-posts/${postId}/bookmarks`);
    return res.data;
  },

  searchPosts: async (keyword: string) => {
    const res = await api.get<ApiResponse<CommunityPostListItem[]>>("/api/community-posts/posts/search", {
      params: { keyword }
    });
    return res.data.data;
  },

  createPost: async (data: any) => {
    const res = await api.post<ApiResponse<CommunityPost>>("/api/community-posts", data);
    return res.data.data;
  },

  updatePost: async (postId: number, data: any) => {
    const res = await api.put<ApiResponse<boolean>>(`/api/community-posts/${postId}`, data);
    return res.data.data;
  },

  deletePost: async (postId: number) => {
    const res = await api.delete<ApiResponse<boolean>>(`/api/community-posts/${postId}`);
    return res.data.data;
  },

  getPresignedUrls: async (fileNames: string[]) => {
    const res = await api.post<ApiResponse<string[]>>("/api/community-posts/presigned-url", { fileNames });
    return res.data.data;
  },

  uploadToS3: async (presignedUrl: string, file: File) => {
    try {
      await api.put(presignedUrl, file, {
        headers: { 
          "Content-Type": file.type 
        },
      });
      return true;
    } catch (err) {
      console.error("S3 Upload Error:", err);
      return false;
    }
  },

  createComment: async (postId: number, comment: string) => {
    await api.post(`/api/community-posts/${postId}/comments`, { comment });
    return true;
  }
};
