"use client";

import useUserStore from "@/store/useUserStore";
import Link from "next/link";

export default function MyPage() {
  const { user } = useUserStore();

  return (
    <div className="flex w-full max-w-7xl mx-auto min-h-screen">
      <aside className="w-64 bg-gray-50 border-r p-6 flex flex-col gap-4">
        <div className="mb-8">
          <h1 className="text-3xl font-logo text-primary-purple font-bold">My Page</h1>

          <p className="text-gray-500">{user?.email}</p>
        </div>

        <nav className="flex flex-col gap-2 text-gray-700">
          <Link href="/mypage/profile" className="hover:text-primary-purple">
            회원정보 수정
          </Link>
          <Link href="/mypage/products" className="hover:text-primary-purple">
            내 상품 관리
          </Link>
          <Link href="/mypage/orders" className="hover:text-primary-purple">
            내 주문 관리
          </Link>
          <Link href="/mypage/bookmarks" className="hover:text-primary-purple">
            내 찜/북마크
          </Link>
          <Link href="/mypage/address" className="hover:text-primary-purple">
            내 주소 관리
          </Link>
          <Link href="/mypage/grade" className="hover:text-primary-purple">
            내 회원 등급
          </Link>
          <Link href="/mypage/quit" className="hover:text-primary-purple">
            회원 탈퇴
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <h2 className="text-2xl font-bold mb-6">마이페이지</h2>

        {/* 회원 등급 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">현재 {user?.name} 회원님의 등급은</h2>
          <p className="text-gray-700">
            <span className="font-bold text-primary-purple">브론즈</span> 등급입니다. 다음 등급까지{" "}
            <span className="font-bold">n건</span>의 거래가 필요합니다.
          </p>
        </div>

        {/* 대시보드 */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">빌려준 상품</h3>
            <p className="text-2xl font-bold text-primary-purple">n건</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">빌린 상품</h3>
            <p className="text-2xl font-bold text-primary-purple">n건</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">누적 정산금</h3>
            <p className="text-2xl font-bold text-primary-purple">₩125,000</p>
          </div>
        </div>
      </main>
    </div>
  );
}
