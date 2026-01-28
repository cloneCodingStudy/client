import api from "@/api/axiosInstance";
import { MyPageSummary } from "@/types/mypage";
import { ProductListItem } from "@/types/product";
import { ApiResponse, PageResponse } from "@/types/api";

// 내부 헬퍼: 백엔드 데이터를 프런트 DTO(ProductListItem)로 변환
const mapToProductListItem = (item: any): ProductListItem => ({
  id: item.id,
  title: item.title,
  price: item.price,
  isRented: item.status,
  createdAt: item.registerTime,
  imageUrl: item.imageUrl,
  rating: item.rating,
  reviewsCount: item.reviewsCount,
  orderId: item.orderId,
  seller: {
    id: 0,
    nickname: item.nickname,
    email: "",
  },
});

export const mypageService = {
  getMyPageSummary: async () => {
    const res = await api.get<ApiResponse<MyPageSummary>>("/api/mypage");
    return res.data.data;
  },

  getMyProducts: async (page = 0, size = 10) => {
    const res = await api.get<ApiResponse<PageResponse<any>>>("/api/mypage/my-products", {
      params: { page, size },
    });
    const data = res.data.data;
    return { ...data, content: data.content.map(mapToProductListItem) };
  },

  getMyInteractions: async (type: 'likes' | 'bookmarks', page = 0) => {
    const endpoint = type === 'likes' ? 'my-likes' : 'my-bookmarks';
    const res = await api.get<ApiResponse<PageResponse<any>>>(`/api/mypage/${endpoint}`, {
      params: { page, size: 10 },
    });
    const data = res.data.data;
    return { ...data, content: data.content.map(mapToProductListItem) };
  },

  getMyOrders: async (page = 0, size = 10) => {
    const res = await api.get<ApiResponse<PageResponse<any>>>("/api/mypage/my-orders", {
      params: { page, size },
    });
    const data = res.data.data;
    return { ...data, content: data.content.map(mapToProductListItem) };
  },
};