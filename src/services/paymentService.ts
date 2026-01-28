import api from "@/api/axiosInstance";
import { ApiResponse } from "@/types/api";

export const paymentService = {
  completePayment: async (paymentData: {
    impUid: string;
    merchantUid: string;
    amount: number;
    orderId: number;
  }) => {
    const res = await api.post<ApiResponse>("/api/payments/complete", paymentData);
    return res.data;
  },
};