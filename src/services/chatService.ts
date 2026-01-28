import api from "@/api/axiosInstance";
import { ApiResponse } from "@/types/api";

export const chatService = {
  getRooms: async () => {
    const res = await api.get<ApiResponse<any[]>>("/api/chat-rooms/rooms");
    return res.data.data;
  },

  createRoom: async (title: string, sellerId: number, userId: number) => {
    const res = await api.post<number>("/api/chat-rooms/rooms", {
      title,
      userIds: [userId, sellerId],
    });
    return res.data;
  },

  getMessages: async (roomId: number) => {
    const res = await api.get<ApiResponse<any[]>>(`/api/chat-rooms/rooms/${roomId}/messages`);
    return res.data.data;
  }
};