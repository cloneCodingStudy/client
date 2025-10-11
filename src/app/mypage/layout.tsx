"use client";

import useUserStore from "@/store/useUserStore";
import Link from "next/link";

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
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
          <Link href="/mypage/grade" className="hover:text-primary-purple">
            내 회원 등급
          </Link>
          <Link href="/mypage/quit" className="hover:text-primary-purple">
            회원 탈퇴
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-10 bg-white">{children}</main>
    </div>
  );
}
