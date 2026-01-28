"use client";

import { useEffect, useState } from "react";
import useUserStore from "@/store/useUserStore";
import { useProfile } from "@/hooks/pages/useProfile";
``
export default function ProfileEdit() {
  const { user } = useUserStore();
  const { loading, updateProfile, withdraw } = useProfile();

  const [profile, setProfile] = useState({
    email: "",
    name: "",
    nickname: "",
    phoneNumber: "",
    birthDate: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        email: user.email || "",
        name: user.username || "",
        nickname: user.nickname || "",
        phoneNumber: user.phoneNumber || "",
        birthDate: user.birthDate || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(profile);
  };

  return (
    <div className="max-w-lg mx-auto bg-white py-10 px-4">
      <h2 className="text-2xl font-bold mb-8 text-primary-purple">회원정보 수정</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-600 ml-1">이메일</label>
          <input
            name="email"
            value={profile.email}
            readOnly
            className="w-full border-0 rounded-xl px-4 py-3.5 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
          />
        </div>

        {/* 수정 가능 필드들 */}
        {[
          { label: "이름", name: "name" },
          { label: "닉네임", name: "nickname" },
          { label: "휴대폰 번호", name: "phoneNumber" },
          { label: "생년월일", name: "birthDate", placeholder: "YYYY-MM-DD" },
          { label: "주소", name: "address" },
        ].map((field) => (
          <div key={field.name} className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">{field.label}</label>
            <input
              type="text"
              name={field.name}
              value={(profile as any)[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:border-primary-purple focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            />
          </div>
        ))}

        <div className="flex flex-col gap-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-purple text-white font-bold py-4 rounded-xl hover:bg-opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-purple-100"
          >
            {loading ? "저장 중..." : "저장하기"}
          </button>

          <button
            type="button"
            onClick={withdraw}
            className="w-full py-4 text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
          >
            회원 탈퇴하기
          </button>
        </div>
      </form>
    </div>
  );
}
