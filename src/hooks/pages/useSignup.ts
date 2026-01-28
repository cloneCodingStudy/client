import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/AuthService";
import useUserStore from "@/store/useUserStore";


export const useSignup = () => {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [nicknameCheck, setNicknameCheck] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);

  const handleCheckNickname = async (nickname: string) => {
    if (!nickname) return toast.error("닉네임을 입력하세요.");
    const res = await authService.checkNickname(nickname);
    if (res.ok) {
      toast.success("사용 가능한 닉네임입니다.");
      setNicknameCheck(true);
    } else {
      toast.error(res.message);
      setNicknameCheck(false);
    }
  };

  const handleCheckEmail = async (email: string) => {
    if (!email) return toast.error("이메일을 입력하세요.");
    const res = await authService.sendVerificationEmail(email);
    if (res.ok) {
      toast.success("인증 메일을 발송했습니다.");
      setEmailCheck(true);
    } else {
      toast.error(res.message);
      setEmailCheck(false);
    }
  };

  const signup = async (data: any) => {
    if (!nicknameCheck) return toast.error("닉네임 중복 확인을 해주세요.");
    if (!emailCheck) return toast.error("이메일 인증을 해주세요.");

    const result = await authService.signup(data);
    if (result.ok) {
      toast.success(`${data.name}님 환영합니다 🤗`);
      router.push("/login");
    } else {
      toast.error(result.message || "회원가입에 실패했습니다.");
    }
  };

  return {
    nicknameCheck,
    setNicknameCheck,
    emailCheck,
    setEmailCheck,
    handleCheckNickname,
    handleCheckEmail,
    signup,
  };
};