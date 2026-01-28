const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { User } from "@/types/user";
import { ApiResponse } from "@/types/api";
import api from "@/api/axiosInstance";

export const authService = {
  login: async (credentials: { userId: string; password: string }) => {
    try {
      const res = await api.post<ApiResponse<User>>("/login", credentials);
      const accessToken = res.headers["access"]; 

      return {
        ok: true,
        user: { ...res.data.data, accessToken },
        message: res.data.message,
      };
    } catch (error: any) {
      return {
        ok: false,
        message: error.response?.data?.message || "로그인 중 오류가 발생했습니다.",
        status: error.response?.status,
      };
    }
  },

  signup: async (payload: any) => {
    try {
      const res = await api.post<ApiResponse<void>>("/api/users/sign-up", payload);
      return { ok: true, message: res.data.message };
    } catch (error: any) {
      return { 
        ok: false, 
        message: error.response?.data?.message || "회원가입 실패",
        status: error.response?.status 
      };
    }
  },

  checkNickname: async (nickname: string) => {
    try {
      await api.get(`/user/duplicate-check`, { params: { nickName: nickname } });
      return { ok: true };
    } catch (error: any) {
      return { ok: false, message: error.response?.data?.message || "중복된 닉네임입니다." };
    }
  },

  sendVerificationEmail: async (email: string) => {
    try {
      await api.post(`/mail/send-verification-link`, { email });
      return { ok: true };
    } catch (error: any) {
      return { ok: false, message: error.response?.data?.message || "인증 메일 발송 실패" };
    }
  },

  reissue: async () => {
    const res = await api.post("/api/reissue/accessToken");
    const newAccessToken = res.headers["access"];
    return newAccessToken;
  },

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

  withdraw: async () => {
    try {
      await api.delete("/api/users/delete");
      return true;
    } catch (error) {
      console.error("[userService.withdraw]", error);
      return false;
    }
  },

  decodePayload: (token: string) => {
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error("JWT Decoding Error:", err);
      return null;
    }
  },

  findAccount: async (phone: string) => {
    try {
      const res = await api.post<ApiResponse<{ email: string }>>("/user/find-account", { phone });
      return { ok: true, email: res.data.data.email };
    } catch (error: any) {
      return { ok: false, message: error.response?.data?.message || "계정을 찾을 수 없습니다." };
    }
  },

  sendResetLink: async (email: string, name: string) => {
    try {
      await api.post("/mail/send-reset-link", { email, name });
      return { ok: true };
    } catch (error: any) {
      return { ok: false, message: error.response?.data?.message || "발송 실패" };
    }
  }
};