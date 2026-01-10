"use client";

import Link from "next/link";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import { loginUser, decodePayload } from "@/data/actions/user.api";

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await loginUser({ userId: email, password });

    if (response.ok && response.accessToken) {
      const decoded = decodePayload(response.accessToken);
      const userEmail = decoded?.sub || decoded?.email;

      localStorage.setItem("accessToken", response.accessToken);
      setUser({
        ...response.data,
        email: userEmail || response.data.email,
        accessToken: response.accessToken,
      });

      toast.success("로그인에 성공했습니다.");
      router.push(decodeURIComponent(returnUrl));
    } else if (response.status === 401) {
      toast.error("이메일 또는 비밀번호가 잘못되었습니다.");
    } else {
      toast.error("로그인에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      {!showForm ? (
        <>
          <p className="text-primary-purple mb-2 text-center text-3xl font-bold">환영합니다 👋</p>
          <p className="mb-10 text-primary-purple text-center">쉐어링 커뮤니티 빌려요입니다.</p>
          <button onClick={() => setShowForm(true)} className="cursor-pointer mb-6 flex w-full max-w-sm items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 font-semibold text-gray-700 hover:bg-gray-50 transition">
            <PaperAirplaneIcon className="h-5 w-5 text-gray-600" />
            이메일로 로그인
          </button>
        </>
      ) : (
        <form onSubmit={onSubmit} className="mb-6 flex w-full max-w-sm flex-col gap-4">
          <input type="email" placeholder="이메일을 입력하세요" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-purple" />
          <input type="password" placeholder="비밀번호를 입력하세요" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-purple" />
          <button type="submit" className="cursor-pointer mt-2 w-full rounded-lg bg-primary-purple py-3 font-bold text-white hover:opacity-90 transition">로그인</button>
        </form>
      )}
      <div className="relative w-full max-w-sm mb-6">
        <hr className="border-gray-200" /><span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-400">or</span>
      </div>
      <p className="text-sm text-gray-500">계정이 없으신가요? <Link href="/signup" className="font-semibold text-primary-purple hover:underline">이메일로 회원가입</Link></p>
    </div>
  );
}