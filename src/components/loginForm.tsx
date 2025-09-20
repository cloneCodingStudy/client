"use client";

import Link from "next/link";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function LoginForm() {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center">
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="cursor-pointer mb-6 flex w-full max-w-sm items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          <PaperAirplaneIcon className="h-5 w-5 text-gray-600" />
          이메일로 로그인
        </button>
      ) : (
        // 로그인 버튼을 누르면 입력창 뜸
        <form onSubmit={handleSubmit} className="mb-6 flex w-full max-w-sm flex-col gap-4">
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
        <Link
          href="/reset-password"
          className="font-semibold text-[var(--color-primary)] hover:underline"
        >
          비밀번호 찾기
        </Link>
      </p>
    </div>
  );
}
