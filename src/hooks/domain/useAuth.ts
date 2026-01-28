import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/AuthService";
import useUserStore from "@/store/useUserStore";
import { useState } from "react";

export const useAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, resetUser } = useUserStore();
  const [findResult, setFindResult] = useState<"found" | "not_found" | null>(null);
  const [foundEmail, setFoundEmail] = useState<string | null>(null);

  const login = async (credentials: { userId: string; password: string }) => {
    const result = await authService.login(credentials);

    if (result.ok && result.user) {
      setUser(result.user);

      if (result.user.accessToken) {
        localStorage.setItem("accessToken", result.user.accessToken);
      }

      toast.success("로그인 성공!");

      const returnUrl = searchParams.get("returnUrl") || "/";
      router.push(returnUrl);
    } else {
      toast.error(result.message || "로그인 정보를 다시 확인해주세요.");
    }
  };

  const signup = async (payload: any) => {
    const result = await authService.signup(payload);
    if (result.ok) {
      toast.success("회원가입이 완료되었습니다. 로그인해 주세요.");
      router.push("/login");
    } else {
      toast.error(result.message || "회원가입에 실패했습니다.");
    }
  };

  const checkNickname = async (nickname: string) => {
    const result = await authService.checkNickname(nickname);
    if (result.ok) {
      toast.success("사용 가능한 닉네임입니다.");
      return true;
    } else {
      toast.error(result.message || "이미 사용 중인 닉네임입니다.");
      return false;
    }
  };

  const sendEmailVerification = async (email: string) => {
    const result = await authService.sendVerificationEmail(email);
    if (result.ok) {
      toast.success("인증 메일이 발송되었습니다.");
      return true;
    } else {
      toast.error(result.message || "메일 발송 실패");
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.withdraw();
    } finally {
      resetUser();
      localStorage.removeItem("accessToken");
      toast.success("로그아웃 되었습니다.");
      router.push("/login");
    }
  };

  const handleFindEmail = async (phone: string) => {
    const result = await authService.findAccount(phone);
    if (result.ok && result.email) {
      setFoundEmail(result.email);
      setFindResult("found");
    } else {
      setFindResult("not_found");
    }
  };

  const handleFindPassword = async (email: string, name: string) => {
    const result = await authService.sendResetLink(email, name);
    if (result.ok) {
      setFindResult("found");
    } else {
      setFindResult("not_found");
    }
  };

  return { login,
    signup,
    logout,
    checkNickname,
    sendEmailVerification,
    findResult, 
    foundEmail, 
    handleFindEmail, 
    handleFindPassword, 
    resetFindState: () => { setFindResult(null); setFoundEmail(null); }
   };
};