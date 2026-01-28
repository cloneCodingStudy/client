import api from "@/api/axiosInstance";
import { User } from "@/types/user";
import { ApiResponse } from "@/types/api";

export const memberService = {
  updateProfile: async (data: Partial<User>) => {
    try {
      const res = await api.put<ApiResponse<User>>("/api/users/update", data);
      return { ok: true, data: res.data.data, message: res.data.message };
    } catch (error: any) {
      return { 
        ok: false, 
        message: error.response?.data?.message || "수정 실패" 
      };
    }
  },

  /** 회원 탈퇴 */
  withdraw: async () => {
    try {
      await api.delete("/api/users/delete");
      return true;
    } catch (error) {
      console.error("[profileService.withdraw]", error);
      return false;
    }
  },
};