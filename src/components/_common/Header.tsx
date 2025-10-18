"use client";

import useUserStore from "@/store/useUserStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Header() {
  const { user, resetUser } = useUserStore();
  const router = useRouter();

  //로그아웃 핸들러
  const handleLogout = () => {
    resetUser();
    toast.success("로그아웃 되었습니다.");
    router.push("/");
  };
  return (
    <header className="w-full border-b border-[var(--color-border)] bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-10">
          {/* 로고 */}
          <Link
            href="/"
            className="cursor-pointer text-xl font-logo font-bold text-[var(--color-primary-purple)]"
          >
            Billioyo
          </Link>

          {/* 네비게이션 메뉴 */}
          <nav className="flex space-x-6 text-[var(--color-text-primary)] font-medium">
            <Link href="/products">대여하기</Link>
            <Link href="/community">커뮤니티</Link>
          </nav>
        </div>

        {/* 로그인/회원가입 버튼 */}
        <div className="flex space-x-3">
          {user ? ( //로그인 된 상태일때는 -> 로그아웃, 마이페이지
            <>
              <button
                onClick={handleLogout}
                type="button"
                className="rounded-full cursor-pointer border border-[var(--color-border)] bg-gray-100 px-4 py-1 text-sm text-[var(--color-text-secondary)] hover:bg-gray-200 transition"
              >
                로그아웃
              </button>
              <Link
                href="/mypage"
                type="button"
                className="rounded-full cursor-pointer  bg-[var(--color-primary-purple)] px-4 py-1 text-sm text-white hover:bg-[var(--color-hover-purple)] transition"
              >
                마이페이지
              </Link>
            </>
          ) : (
            //로그아웃 된 상태일때는 -> 로그인, 회원가입
            <>
              <Link
                href="/login"
                type="button"
                className="rounded-full cursor-pointer border border-[var(--color-border)] bg-gray-100 px-4 py-1 text-sm text-[var(--color-text-secondary)] hover:bg-gray-200 transition"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                type="button"
                className="rounded-full cursor-pointer  bg-[var(--color-primary-purple)] px-4 py-1 text-sm text-white hover:bg-[var(--color-hover-purple)] transition"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
