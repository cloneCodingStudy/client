"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FindEmail = {
  phone: string;
};

type FindPassword = {
  email: string;
};
export default function FindForm() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [toggle, setToggle] = useState<"email" | "password">("email");
  const [result, setResult] = useState<null | "found" | "not_found">(null);
  const [foundEmail, setFoundEmail] = useState<string | null>(null);

  //이메일 찾기 폼
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<FindEmail>();

  //비밀번호 찾기 폼
  const {
    register: registerPw,
    handleSubmit: handleSubmitPw,
    formState: { errors: pwErrors },
  } = useForm<FindPassword>();

  // 이메일 찾기 시
  const onFindEmail = async (data: FindEmail) => {
    try {
      const res = await fetch(`${API_URL}/user/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("Res:", res);
      const result = await res.json();
      console.log("result:", result);

      //찾으면
      if (res.ok && result.success) {
        setResult("found");
        setFoundEmail(result.email);
        //못찾으면
      } else {
        setResult("not_found");
      }
    } catch (err) {
      console.error(err);
      setResult("not_found");
    }
  };

  // 비밀번호 찾기 시
  const onFindPw = async (data: FindPassword) => {
    try {
      const res = await fetch(`${API_URL}/user/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("Res:", res);
      const result = await res.json();
      console.log("result:", result);

      if (res.ok && result.success) {
        setResult("found");
      } else {
        setResult("not_found");
      }
    } catch (err) {
      console.error(err);
      setResult("not_found");
    }
  };

  //상태를 초기화한다
  const resetState = () => {
    setResult(null);
    setFoundEmail(null);
  };

  return (
    <div>
      {/* 이메일 비밀번호 찾기 토글 */}
      <div className="flex flex-row">
        <button
          type="button"
          className={`flex-1 py-2 text-center font-semibold ${
            toggle === "email"
              ? "border-b-2 border-primary-purple text-primary-purple"
              : "text-gray-400"
          }`}
          onClick={() => {
            setToggle("email");
            resetState();
          }}
        >
          이메일
        </button>
        <button
          type="button"
          className={`flex-1 py-2 text-center font-semibold ${
            toggle === "password"
              ? "border-b-2 border-primary-purple text-primary-purple"
              : "text-gray-400"
          }`}
          onClick={() => {
            setToggle("password");
            resetState();
          }}
        >
          비밀번호
        </button>
      </div>

      {/* 이메일 찾기 폼 */}
      {toggle === "email" && result === null && (
        <form onSubmit={handleSubmitEmail(onFindEmail)} className="py-10">
          <label htmlFor="phone" className="block font-medium mb-1">
            가입한 휴대폰 번호를 입력해주세요.
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="'-'를 포함한 휴대폰 번호를 입력하세요."
            {...registerEmail("phone", {
              required: "휴대폰 번호는 필수 입력값입니다.",
              pattern: {
                value: /^010-\d{4}-\d{4}$/,
                message: "010-0000-0000 형식으로 입력해주세요.",
              },
            })}
            className={`w-full rounded-lg border px-4 py-3 my-3 focus:outline-none focus:ring-2 ${
              emailErrors.phone
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-[var(--color-primary)]"
            }`}
          />
          <button
            type="submit"
            className="cursor-pointer mt-4 w-full rounded-lg bg-primary-purple py-3 font-bold text-white hover:opacity-90 transition"
          >
            확인하기
          </button>
        </form>
      )}

      {/* 비밀번호 찾기 폼 */}
      {toggle === "password" && result === null && (
        <form onSubmit={handleSubmitPw(onFindPw)} className="py-10">
          <label htmlFor="email" className="block font-medium mb-1">
            가입한 이메일 주소를 입력해주세요.
          </label>
          <input
            id="email"
            type="email"
            placeholder="이메일을 입력하세요"
            {...registerPw("email", {
              required: "이메일은 필수 입력값입니다.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "올바른 이메일 형식을 입력해주세요.",
              },
            })}
            className={`w-full rounded-lg border px-4 py-3 my-3 focus:outline-none focus:ring-2 ${
              pwErrors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-[var(--color-primary)]"
            }`}
          />
          <p className="text-sm text-gray-500">
            새로운 비밀번호를 이메일로 보내드립니다. <br />
            초기화된 비밀번호의 재설정은 마이페이지에서 변경해 주세요.
          </p>
          <button
            type="submit"
            className="cursor-pointer mt-4 w-full rounded-lg bg-primary-purple py-3 font-bold text-white hover:opacity-90 transition"
          >
            이메일 전송하기
          </button>
        </form>
      )}

      {/* 요청 실패 시 */}
      {result === "not_found" && (
        <div className="py-10">
          <h2 className="text-xl mb-4">일치하는 계정이 없습니다.</h2>
          <p className="text-gray-500 mb-8">
            계정 정보 찾기는 고객센터 cs@billioyo.com 으로 문의해주세요.
          </p>
          <button
            onClick={() => router.push("/signup")}
            className="w-full cursor-pointer bg-primary-purple text-white py-3 rounded-lg font-bold hover:opacity-90"
          >
            회원가입 하기
          </button>
        </div>
      )}

      {/* 요청 성공 시 : 이메일 찾기*/}
      {toggle === "email" && result === "found" && foundEmail && (
        <div className="py-10">
          <h2 className="text-xl mb-4">고객님의 계정 정보를 알려드려요</h2>
          <p className="text-gray-500 mb-4">아래 이메일로 로그인할 수 있습니다.</p>
          <div className="bg-gray-100 p-4 mb-8">{foundEmail}</div>
          <button
            onClick={() => router.push("/login")}
            className="w-full cursor-pointer bg-primary-purple text-white py-3 rounded-lg font-bold hover:opacity-90"
          >
            로그인 하기
          </button>
        </div>
      )}

      {/* 요청 성공 시 : 비밀번호 찾기*/}
      {toggle === "password" && result === "found" && (
        <div className="py-10">
          <h2 className="text-xl mb-4">비밀번호 초기화 메일을 전송했습니다</h2>
          <p className="text-gray-500 mb-8">
            메일함을 확인한 후 초기화된 비밀번호로 로그인해 주세요.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full cursor-pointer bg-primary-purple text-white py-3 rounded-lg font-bold hover:opacity-90"
          >
            로그인 하기
          </button>
        </div>
      )}
    </div>
  );
}
