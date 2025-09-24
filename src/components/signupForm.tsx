"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { User } from "@/types/user";
import useUserStore from "@/store/useUserStore";

type FormValues = {
  email: string;
  password: string;
  name: string;
  nickname: string;
  phone: string;
  birth: string;
  address: string;
  check1: boolean;
  check2: boolean;
};

export default function SignupForm() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { setUser } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const router = useRouter();

  // 회원가입 완료 시
  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch(`${API_URL}/user/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("Res:", res);
      const result = await res.json();
      console.log("result:", result);

      if (res.ok) {
        const newUser: User = {
          email: result.email,
          name: result.name,
          nickname: result.nickname,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        };

        setUser(newUser);

        toast.success(`${data.name}님 환영합니다 🤗`); //토스트로 메시지 띄워주기

        setTimeout(() => {
          router.push("/"); //메인으로 이동
        }, 1500);
      } else {
        toast.error(result.message || "회원가입에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      toast.error("회원가입 요청 중 오류가 발생했습니다.");
    }
  };

  //test 코드
  // const testSubmit = async (data: FormValues) => {
  //   try {
  //     console.log("회원가입 요청 데이터:", data);
  //     localStorage.setItem("accessToken", "dummy-token-123");

  //     toast.success(`${data.name}님 환영합니다 🤗`); //토스트로 메시지 띄워주기

  //     setTimeout(() => {
  //       router.push("/"); //메인으로 이동
  //     }, 1500);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("회원가입 요청 중 오류가 발생했습니다.");
  //   }
  // };

  //닉네임 중복 확인 시

  //이메일 인증 시

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full  max-w-md mx-auto"
    >
      {/* 이메일 */}
      <div>
        <label htmlFor="email" className="block font-medium mb-1">
          이메일
        </label>
        <div className="flex gap-2">
          <input
            id="email"
            type="email"
            placeholder="이메일을 입력하세요"
            {...register("email", {
              required: "이메일은 필수 입력값입니다.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "올바른 이메일 형식을 입력해주세요.",
              },
            })}
            className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-[var(--color-primary)]"
            }`}
          />
          <button
            type="button"
            className="shrink-0 rounded-lg cursor-pointer bg-primary-purple border hover:opacity-90 border-[var(--color-border)] px-4 py-2 text-white font-semibold"
          >
            이메일 인증
          </button>
        </div>
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      {/* 비밀번호 */}
      <div>
        <label htmlFor="password" className="block font-medium mb-1">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          {...register("password", {
            required: "비밀번호는 필수 입력값입니다.",
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: "비밀번호는 8자리 이상, 영문/숫자/특수문자를 포함해야 합니다.",
            },
          })}
          className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
            errors.password
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-[var(--color-primary)]"
          }`}
        />
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      {/* 이름 */}
      <div>
        <label htmlFor="name" className="block font-medium mb-1">
          이름
        </label>
        <input
          id="name"
          type="text"
          placeholder="이름을 입력하세요"
          {...register("name", { required: "이름은 필수 입력값입니다." })}
          className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
            errors.name
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-[var(--color-primary)]"
          }`}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      {/* 닉네임 */}
      <div>
        <label htmlFor="nickname" className="block font-medium mb-1">
          닉네임
        </label>
        <div className="flex gap-2">
          <input
            id="nickname"
            type="text"
            placeholder="닉네임을 입력하세요"
            {...register("nickname", { required: "닉네임은 필수 입력값입니다." })}
            className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
              errors.nickname
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-[var(--color-primary)]"
            }`}
          />
          <button
            type="button"
            className="shrink-0 rounded-lg cursor-pointer  bg-gray-200 px-4 py-2 font-semibold border border-[var(--color-border)] hover:bg-gray-300"
          >
            중복 확인
          </button>
        </div>
        {errors.nickname && <p className="text-sm text-red-500 mt-1">{errors.nickname.message}</p>}
      </div>

      {/* 휴대폰 번호 */}
      <div>
        <label htmlFor="phone" className="block font-medium mb-1">
          휴대폰 번호
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="'-'를 포함한 휴대폰 번호를 입력하세요."
          {...register("phone", {
            required: "휴대폰 번호는 필수 입력값입니다.",
            pattern: {
              value: /^010-\d{4}-\d{4}$/,
              message: "010-0000-0000 형식으로 입력해주세요.",
            },
          })}
          className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
            errors.phone
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-[var(--color-primary)]"
          }`}
        />
        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
      </div>

      {/* 생년월일 */}
      <div>
        <label htmlFor="birth" className="block font-medium mb-1">
          생년월일
        </label>
        <input
          id="birth"
          type="text"
          placeholder="생년월일 6자리를 입력하세요. (YYMMDD)"
          maxLength={6}
          {...register("birth", {
            required: "생년월일은 필수 입력값입니다.",
            pattern: {
              value: /^\d{6}$/,
              message: "YYMMDD 형식으로 입력해주세요.",
            },
          })}
          className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
            errors.birth
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-[var(--color-primary)]"
          }`}
        />
        {errors.birth && <p className="text-sm text-red-500 mt-1">{errors.birth.message}</p>}
      </div>

      {/* 주소 */}
      <div>
        <label htmlFor="address" className="block font-medium mb-1">
          주소
        </label>
        <input
          id="address"
          type="text"
          placeholder="주소를 입력하세요"
          {...register("address", { required: "주소는 필수 입력값입니다." })}
          className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
            errors.address
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-[var(--color-primary)]"
          }`}
        />
        {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
      </div>

      {/* 개인정보 동의 */}
      <div className="flex flex-col gap-2 mt-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("check1", {
              required: "필수 항목의 동의가 필요합니다.",
            })}
            className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
          />
          <span>(필수) 개인정보 수집 및 이용 동의</span>
        </label>
        {errors.check1 && <p className="text-sm text-red-500 mt-1">{errors.check1.message}</p>}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("check2")}
            className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
          />
          <span>(선택) 마케팅 정보 수신 동의</span>
        </label>
      </div>

      {/* 회원가입 버튼 */}
      <button
        type="submit"
        className="cursor-pointer mt-4 w-full rounded-lg bg-primary-purple py-3 font-bold text-white hover:opacity-90 transition"
      >
        회원가입
      </button>
    </form>
  );
}
