import Link from "next/link";

export default function Header() {
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
            <a href="#">대여하기</a>
            <a href="#">커뮤니티</a>
          </nav>
        </div>

        {/* 로그인/회원가입 버튼 */}
        <div className="flex space-x-3">
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
        </div>
      </div>
    </header>
  );
}
