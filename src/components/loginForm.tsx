"use client";

import Link from "next/link";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //로그인
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //새로고침 방지

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: email,
          password: password,
        }),
        credentials: "include",
      });

      if (res.ok) {
        //엑세스 토큰 가져오기
        const accessToken = res.headers.get("access");

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          toast.success("로그인에 성공했습니다.");
          router.push("/"); // 메인으로 이동
        } else {
          toast.error("로그인 정보를 받아오지 못했습니다.");
        }
      } else if (res.status === 401) {
        toast.error("이메일 또는 비밀번호가 잘못되었습니다.");
      } else {
        toast.error("로그인에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      toast.error("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      {!showForm ? (
        <>
          <p className=" text-primary-purple mb-2 text-center text-3xl font-bold">
            환영합니다 👋 <br />
          </p>
          <p className="mb-10 text-primary-purple text-center ">쉐어링 커뮤니티 빌려요입니다.</p>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="cursor-pointer mb-6 flex w-full max-w-sm items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <PaperAirplaneIcon className="h-5 w-5 text-gray-600" />
            이메일로 로그인
          </button>
        </>
      ) : (
        // 로그인 버튼을 누르면 입력창 뜸
        <form onSubmit={onSubmit} className="mb-6 flex w-full max-w-sm flex-col gap-4">
          <input
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />

          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />

          <button
            type="submit"
            className="cursor-pointer mt-2 w-full rounded-lg bg-[var(--color-primary)] py-3 border border-gray-300 font-bold text-gray-700 hover:bg-gray-50  transition"
          >
            로그인
          </button>
        </form>
      )}

      <div className="relative w-full max-w-sm mb-6">
        <hr className="border-gray-200" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-400">
          or
        </span>
      </div>

      {/* 회원가입, 비번찾기 */}
      <p className="text-sm text-gray-500">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="font-semibold text-[var(--color-primary)] hover:underline">
          이메일로 회원가입
        </Link>
      </p>
      <p className="mt-2 text-sm text-gray-500">
        <Link href="/find" className="font-semibold text-[var(--color-primary)] hover:underline">
          이메일/비밀번호 찾기
        </Link>
      </p>
    </div>
  );
}
