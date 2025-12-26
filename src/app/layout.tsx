import Header from "@/components/_common/Header";
import "./globals.css";
import Footer from "@/components/_common/Footer";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

export const metadata: Metadata = {
  title: "빌려요 Billioyo",
  description: "쉐어링 커뮤니티 빌려요 입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="afterInteractive" />
        {/* Google Maps 스크립트로 변경 */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=ko&region=KR`}
          strategy="beforeInteractive"
        />
        {/* PortOne 결제 스크립트 */}
        <Script src="https://cdn.iamport.kr/v1/iamport.js" strategy="afterInteractive" />
      </head>
      <body className="bg-[var(--color-background-main)] text-[var(--color-text-primary)] font-basic">
        <div className="flex min-h-screen flex-col">
          {/* 헤더 */}
          <Header />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 5000,
              style: {
                background: "#fff",
                color: "#333",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                borderRadius: "8px",
                padding: "16px",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
          {/* 메인 */}
          <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-8">{children}</main>

          {/* 푸터 */}
          <Footer />
        </div>
      </body>
    </html>
  );
}