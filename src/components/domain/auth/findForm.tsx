"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/domain/useAuth";

export default function FindForm() {
  const router = useRouter();
  const [toggle, setToggle] = useState<"email" | "password">("email");
  
  const { findResult, foundEmail, handleFindEmail, handleFindPassword, resetFindState } = useAuth();

  const { register: regEmail, handleSubmit: subEmail, formState: { errors: errEmail } } = useForm<{ phone: string }>();
  const { register: regPw, handleSubmit: subPw, formState: { errors: errPw } } = useForm<{ email: string; name: string }>();

  return (
    <div>
      {/* 토글 버튼 영역 */}
      <div className="flex flex-row">
        {(["email", "password"] as const).map((type) => (
          <button
            key={type}
            type="button"
            className={`flex-1 py-2 text-center font-semibold ${
              toggle === type ? "border-b-2 border-primary-purple text-primary-purple" : "text-gray-400"
            }`}
            onClick={() => { setToggle(type); resetFindState(); }}
          >
            {type === "email" ? "이메일" : "비밀번호"}
          </button>
        ))}
      </div>

      {/* 폼 영역: result가 null일 때만 표시 */}
      {findResult === null && (
        <div className="py-10">
          {toggle === "email" ? (
            <form onSubmit={subEmail((data) => handleFindEmail(data.phone))}>
              <label className="block font-medium mb-1">가입한 휴대폰 번호</label>
              <input
                type="tel"
                placeholder="010-0000-0000"
                {...regEmail("phone", { 
                  required: "필수 입력입니다.", 
                  pattern: { value: /^010-\d{4}-\d{4}$/, message: "형식이 올바르지 않습니다." } 
                })}
                className={`w-full rounded-lg border px-4 py-3 my-3 focus:outline-none focus:ring-2 ${errEmail.phone ? "border-red-500" : "border-gray-300 focus:ring-primary-purple"}`}
              />
              <button type="submit" className="w-full rounded-lg bg-primary-purple py-3 font-bold text-white">확인하기</button>
            </form>
          ) : (
            <form onSubmit={subPw((data) => handleFindPassword(data.email, data.name))}>
              <label className="block font-medium mb-1">가입한 이메일</label>
              <input
                type="email"
                {...regPw("email", { required: "필수 입력입니다." })}
                className="w-full rounded-lg border px-4 py-3 my-3"
              />
              <label className="block font-medium mt-5 mb-1">가입한 이름</label>
              <input
                type="text"
                {...regPw("name", { required: "필수 입력입니다." })}
                className="w-full rounded-lg border px-4 py-3 my-3"
              />
              <button type="submit" className="w-full rounded-lg bg-primary-purple py-3 font-bold text-white">이메일 전송하기</button>
            </form>
          )}
        </div>
      )}

      {/* 결과 화면 영역 (기본 UI 로직 유지) */}
      {findResult === "found" && (
        <div className="py-10 text-center">
          <h2 className="text-xl mb-4">{toggle === "email" ? "계정 정보를 찾았습니다" : "메일을 전송했습니다"}</h2>
          {toggle === "email" && <div className="bg-gray-100 p-4 mb-8 font-bold">{foundEmail}</div>}
          <button onClick={() => router.push("/login")} className="w-full bg-primary-purple text-white py-3 rounded-lg font-bold">로그인 하기</button>
        </div>
      )}

      {findResult === "not_found" && (
        <div className="py-10 text-center">
          <h2 className="text-xl mb-4 text-red-500">일치하는 정보가 없습니다.</h2>
          <button onClick={() => router.push("/signup")} className="w-full bg-primary-purple text-white py-3 rounded-lg font-bold">회원가입 하기</button>
        </div>
      )}
    </div>
  );
}
