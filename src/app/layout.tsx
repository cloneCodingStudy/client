import Header from "@/components/_common/Header";
import "./globals.css";
import Footer from "@/components/_common/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-[var(--color-background-main)] text-[var(--color-text-primary)] font-basic">
        <div className="flex min-h-screen flex-col">
          {/* 헤더 */}
          <Header />

          {/* 메인 */}
          <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-8">{children}</main>

          {/* 푸터 */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
