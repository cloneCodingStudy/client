import { useState } from "react";
import toast from "react-hot-toast";
import { memberService } from "@/services/memberService";
import useUserStore from "@/store/useUserStore";
import { User } from "@/types/user";

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const { setUser, resetUser } = useUserStore();

  const updateProfile = async (data: Partial<User>) => {
    setLoading(true);
    try {
      const result = await memberService.updateProfile(data);
      if (result.ok && result.data) {
        setUser(result.data);
        toast.success("프로필이 수정되었습니다.");
        return true;
      }
      toast.error(result.message || "수정 실패");
    } finally {
      setLoading(false);
    }
    return false;
  };

  const withdraw = async () => {
    if (!confirm("정말로 탈퇴하시겠습니까? 데이터는 복구되지 않습니다.")) return;

    const success = await memberService.withdraw();
    if (success) {
      resetUser();
      localStorage.removeItem("accessToken");
      toast.success("회원 탈퇴가 완료되었습니다.");
      window.location.href = "/";
    } else {
      toast.error("탈퇴 처리 중 오류가 발생했습니다.");
    }
  };

  return { loading, updateProfile, withdraw };
};