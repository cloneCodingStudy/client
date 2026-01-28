import api from "@/api/axiosInstance";
import { Product, ProductListItem } from "@/types/product";
import { ApiResponse, PageResponse } from "@/types/api";

const mapToProductListItem = (item: any): ProductListItem => ({
  id: item.id,
  title: item.title,
  price: item.price,
  isRented: item.status,
  createdAt: item.registerTime,
  imageUrl: item.imageUrl || "/images/공구.jpg",
  rating: item.rating || 0,
  reviewsCount: item.reviewsCount || 0,
  seller: { id: 0, nickname: item.nickname, email: "" },
});

export const productsService = {
  getProducts: async (page = 0, size = 20, position?: any) => {
    const res = await api.get<ApiResponse<PageResponse<any>>>("/api/products", {
      params: { page, size, ...position }
    });
    const data = res.data.data;
    return { ...data, content: data.content.map(mapToProductListItem) };
  },

  getProduct: async (postId: number) => {
    const res = await api.get<ApiResponse<any>>(`/api/products/${postId}`);
    const data = res.data.data;
    if (!data) return null;

    return {
      ...data,
      image: data.imageUrls?.[0] || "/images/공구.jpg",
      isRented: data.status,
      seller: {
        id: data.seller?.id || 0,
        nickname: data.username || data.seller?.nickname || "알 수 없음",
        email: data.seller?.email || "",
      }
    } as Product;
  },

  createProduct: async (data: any) => {
    const res = await api.post<ApiResponse<number>>("/api/products", data);
    return res.data.data;
  },

  updateProduct: async (postId: number, data: any) => {
    await api.put(`/api/products/${postId}`, data);
    return true;
  },

  deleteProduct: async (postId: number) => {
    await api.delete(`/api/products/${postId}`);
    return true;
  },

  toggleLike: async (postId: number) => {
    const res = await api.post<ApiResponse<number>>(`/api/products/${postId}/like`);
    return res.data.data;
  },

  toggleBookmark: async (postId: number) => {
    const res = await api.post<ApiResponse<string>>(`/api/products/${postId}/bm`);
    return res.data.data;
  },

  createReview: async (postId: number, review: { rating: number; comment: string }) => {
    await api.post(`/api/products/review/${postId}`, review);
    return true;
  },

  analyzeImage: async (imageUrl: string, signal?: AbortSignal) => {
    const res = await api.post<ApiResponse<any>>("/api/products/analyze-image", { imageUrl }, { signal });
    const data = res.data.data;
    return typeof data === "string" ? JSON.parse(data) : data;
  }
};