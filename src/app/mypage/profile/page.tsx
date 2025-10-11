"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { updateUser } from "@/data/actions/user.api";
import useUserStore from "@/store/useUserStore";

export default function ProfileEdit() {
  const { user } = useUserStore();

  const [profile, setProfile] = useState({
    email: "",
    name: "",
    nickname: "",
    phoneNumber: "",
    birthDate: "",
    address: "",
    accessToken: "",
    refreshToken: "",
  });

  //유저 정보 가져오기
  useEffect(() => {
    if (user) {
      setProfile({
        email: user.email || "",
        name: user.name || "",
        nickname: user.nickname || "",
        accessToken: user.accessToken || "",
        refreshToken: user.refreshToken || "",
        phoneNumber: "",
        birthDate: "",
        address: "",
      });
    }
  }, [user]);

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateUser(profile);
    if (result) toast.success("회원정보가 수정되었습니다.");
    else toast.error("수정 오류. 다시 시도해주세요.");
  };

  return (
    <div className="max-w-lg mx-auto bg-white ">
      <h2 className="text-2xl font-bold mb-6 text-primary-purple">회원정보 수정</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* 이메일은 변경 불가 */}
        <div>
          <label className="block font-medium mb-1">이메일</label>
          <input
            name="email"
            value={profile.email}
            readOnly
            className="w-full border rounded-lg px-4 py-3 bg-gray-100 cursor-not-allowed select-none"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">이름</label>
          <input
            name="name"
            value={profile.name}
            onChange={handleEdit}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">닉네임</label>
          <input
            name="nickname"
            value={profile.nickname}
            onChange={handleEdit}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">휴대폰 번호</label>
          <input
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleEdit}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">생년월일</label>
          <input
            name="birthDate"
            value={profile.birthDate}
            onChange={handleEdit}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">주소</label>
          <input
            name="address"
            value={profile.address}
            onChange={handleEdit}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <button
          type="submit"
          className="mt-4 cursor-pointer bg-primary-purple text-white font-semibold py-3 rounded-lg hover:opacity-90"
        >
          저장하기
        </button>
      </form>
    </div>
  );
}
