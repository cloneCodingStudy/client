"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import { deleteUser } from "@/data/actions/user.api";

export default function QuitUser() {
  const { user, setUser } = useUserStore();
  const router = useRouter();

  const [recheck, setRecheck] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQuit = async () => {
    try {
      setLoading(true);
      const success = await deleteUser();
      if (success) {
        toast.success("회원 탈퇴가 완료되었습니다.");
        setUser(null);
        setTimeout(() => router.push("/"), 1500);
      } else {
        toast.error("회원 탈퇴에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      toast.error("회원 탈퇴 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      setRecheck(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-primary-purple">회원 탈퇴</h2>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        <span className="font-semibold">{user?.name}</span> 님, 정말{" "}
        <span className="text-primary-purple font-semibold">빌려요</span>를 탈퇴하시겠습니까? <br />
        탈퇴 시 작성하신 게시글 및 상품이 모두 삭제되며 복구되지 않습니다.
      </p>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-3">
        {!recheck ? (
          <>
            <button
              type="button"
              onClick={() => router.push("/mypage")}
              className="px-5 cursor-pointer py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              아니요
            </button>
            <button
              type="button"
              onClick={() => setRecheck(true)}
              className="px-5 cursor-pointer py-3 rounded-lg bg-red-500 text-white font-semibold hover:opacity-90 transition"
            >
              네
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setRecheck(false)}
              className="cursor-pointer px-5 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              취소
            </button>
            <button
              onClick={handleQuit}
              disabled={loading}
              className={`px-5 py-3 cursor-pointer rounded-lg bg-red-600 text-white font-semibold hover:opacity-90 transition ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "처리 중..." : "회원 탈퇴하기"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
