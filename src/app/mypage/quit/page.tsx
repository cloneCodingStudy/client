"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import { useProfile } from "@/hooks/pages/useProfile";

export default function QuitUser() {
  const { user } = useUserStore();
  const router = useRouter();
  
  const { loading, withdraw } = useProfile();
  const [recheck, setRecheck] = useState(false);

  const handleQuitClick = async () => {
    await withdraw();
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 mt-12 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-primary-purple">회원 탈퇴</h2>
      <p className="text-gray-600 mb-8 text-sm leading-relaxed">
        <span className="font-semibold text-gray-900">{user?.username}</span> 님, 정말{" "}
        <span className="text-primary-purple font-semibold">빌려요</span>를 탈퇴하시겠습니까? <br />
        <span className="text-red-500 mt-2 block">
          ※ 탈퇴 시 작성하신 게시글 및 상품이 모두 삭제되며 복구되지 않습니다.
        </span>
      </p>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-3">
        {!recheck ? (
          <>
            <button
              type="button"
              onClick={() => router.push("/mypage")}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
            >
              아니요
            </button>
            <button
              type="button"
              onClick={() => setRecheck(true)}
              className="px-6 py-3 rounded-xl bg-gray-100 text-gray-900 font-semibold hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
            >
              네, 그만둘래요
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setRecheck(false)}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
            >
              취소
            </button>
            <button
              onClick={handleQuitClick}
              disabled={loading}
              className={`px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all shadow-md shadow-red-100 ${
                loading ? "opacity-60 cursor-not-allowed" : "active:scale-95"
              }`}
            >
              {loading ? "처리 중..." : "최종 탈퇴하기"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}