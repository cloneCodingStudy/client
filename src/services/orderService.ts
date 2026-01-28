import api from "@/api/axiosInstance";
import { OrderCreateRequest, OrderCreateResponse } from "@/types/order";
import { ApiResponse } from "@/types/api";

export const ordersService = {
  createOrder: async (payload: OrderCreateRequest) => {
    const res = await api.post<ApiResponse<OrderCreateResponse>>("/api/orders", payload);
    return res.data.data;
  },

  returnRental: async (orderId: number) => {
    const res = await api.post<ApiResponse<{ message: string }>>(`/api/products/return/${orderId}`);
    return res.data.data;
  },
};