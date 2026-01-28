import api from "@/api/axiosInstance";
import { 
  SettlementCreateRequest, 
  SettlementCreateResponse, 
  SettlementItemResponse 
} from "@/types/settlement";
import { ApiResponse } from "@/types/api";

export const settlementService = {
  getItems: async (ownerId: number) => {
    const res = await api.get<ApiResponse<SettlementItemResponse>>(
      `/api/settlements/mypage/${ownerId}`
    );
    return res.data.data;
  },

  createSettlement: async (ownerId: number, payload: SettlementCreateRequest) => {
    const res = await api.post<ApiResponse<SettlementCreateResponse>>(
      `/api/settlements/${ownerId}`, 
      payload
    );
    return res.data.data;
  },

  completeSettlement: async (settlementId: number) => {
    const res = await api.post<ApiResponse<any>>(
      `/api/settlements/${settlementId}/complete`
    );
    return res.data;
  }
};
