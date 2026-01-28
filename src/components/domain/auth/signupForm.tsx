"use client";

import { useForm } from "react-hook-form";
import Script from "next/script";
import { useEffect } from "react";
import { useSignup } from "@/hooks/pages/useSignup";

export default function SignupForm() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const { 
    nicknameCheck, setNicknameCheck, 
    emailCheck, setEmailCheck, 
    handleCheckNickname, handleCheckEmail, signup 
  } = useSignup();

  const nickname = watch("nickname");
  const email = watch("email");

  useEffect(() => setNicknameCheck(false), [nickname, setNicknameCheck]);
  useEffect(() => setEmailCheck(false), [email, setEmailCheck]);

  const handleAddressSearch = () => {
    new (window as any).daum.Postcode({
      oncomplete: (data: any) => {
        let fullAddress = data.address;
        if (data.addressType === "R") {
          const extra = (data.bname ? data.bname : "") + (data.buildingName ? `, ${data.buildingName}` : "");
          fullAddress += extra !== "" ? ` (${extra})` : "";
        }
        setValue("address", fullAddress, { shouldValidate: true });
      },
    }).open();
  };

  return (
    <>
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />
      <form onSubmit={handleSubmit(signup)} className="flex flex-col gap-4 w-full max-w-md mx-auto">
        {/* 이메일 */}
        <div>
          <label className="block font-medium mb-1">이메일</label>
          <div className="flex gap-2">
            <input 
              {...register("email", { required: "이메일은 필수입니다." })} 
              className="w-full rounded-lg border border-gray-300 px-4 py-3" 
            />
            <button 
              type="button" 
              onClick={() => handleCheckEmail(email)} 
              className={`shrink-0 rounded-lg px-4 py-2 text-white font-semibold ${emailCheck ? 'bg-green-500' : 'bg-primary-purple'}`}
            >
              {emailCheck ? "발송완료" : "이메일 인증"}
            </button>
          </div>
          {errors.password?.message && (<p className="text-sm text-red-500 mt-1">{String(errors.password.message)}</p>)}
        </div>

        {/* 비밀번호 */}
        <div>
          <label htmlFor="password" title="password" className="block font-medium mb-1">비밀번호</label>
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
              errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[var(--color-primary)]"
            }`}
          />
          {errors.password?.message && (<p className="text-sm text-red-500 mt-1">{String(errors.password.message)}</p>)}
        </div>

        {/* 이름 */}
        <div>
          <label htmlFor="name" className="block font-medium mb-1">이름</label>
          <input
            id="name"
            type="text"
            placeholder="이름을 입력하세요"
            {...register("name", { required: "이름은 필수 입력값입니다." })}
            className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
              errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[var(--color-primary)]"
            }`}
          />
          {errors.password?.message && (<p className="text-sm text-red-500 mt-1">{String(errors.password.message)}</p>)}
        </div>

        {/* 닉네임 */}
        <div>
          <label className="block font-medium mb-1">닉네임</label>
          <div className="flex gap-2">
            <input 
              {...register("nickname", { required: "닉네임은 필수입니다." })} 
              className="w-full rounded-lg border border-gray-300 px-4 py-3" 
            />
            <button 
              type="button" 
              onClick={() => handleCheckNickname(nickname)} 
              className={`shrink-0 rounded-lg px-4 py-2 font-semibold ${nicknameCheck ? 'bg-green-100 text-green-700' : 'bg-gray-200'}`}
            >
              중복 확인
            </button>
          </div>
        </div>

        {/* 휴대폰 번호 */}
        <div>
          <label htmlFor="phone" className="block font-medium mb-1">휴대폰 번호</label>
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
              errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[var(--color-primary)]"
            }`}
          />
          {errors.password?.message && (<p className="text-sm text-red-500 mt-1">{String(errors.password.message)}</p>)}
        </div>

        {/* 생년월일 */}
        <div>
          <label htmlFor="birth" className="block font-medium mb-1">생년월일</label>
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
              errors.birth ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[var(--color-primary)]"
            }`}
          />
          {errors.password?.message && (<p className="text-sm text-red-500 mt-1">{String(errors.password.message)}</p>)}
        </div>

        {/* 주소 */}
        <div>
          <label className="block font-medium mb-1">주소</label>
          <div className="flex gap-2">
            <input 
              {...register("address", { required: "주소는 필수입니다." })} 
              readOnly 
              onClick={handleAddressSearch}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 cursor-pointer" 
            />
            <button type="button" onClick={handleAddressSearch} className="shrink-0 rounded-lg bg-gray-800 px-4 py-2 text-white">
              주소 검색
            </button>
          </div>
        </div>

        {/* 개인정보 동의 */}
        <div className="flex flex-col gap-2 mt-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("check1", { required: "필수 항목의 동의가 필요합니다." })}
              className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <span>(필수) 개인정보 수집 및 이용 동의</span>
          </label>
          {errors.password?.message && (<p className="text-sm text-red-500 mt-1">{String(errors.password.message)}</p>)}

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
    </>
  );
}