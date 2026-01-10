"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; 
import useUserStore from "@/store/useUserStore";
import {
  HomeIcon,
  UserIcon,
  HeartIcon,
  TicketIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  ChevronRightIcon,
  StarIcon,
  TvIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import LocationSection from "@/components/LocationSection";

export default function HomePage() {
  const router = useRouter();
  const { user } = useUserStore(); 

  const categories = [
    { icon: HomeIcon, label: "생활용품", href: "/category/lifestyle" },
    { icon: UserIcon, label: "의류/잡화", href: "/category/beauty" },
    { icon: HeartIcon, label: "육아", href: "/category/childcare" },
    { icon: TicketIcon, label: "레저/취미", href: "/category/leisure" },
    { icon: HeartIcon, label: "반려동물", href: "/category/pet" },
    { icon: TruckIcon, label: "자동차/정비", href: "/category/car" },
    { icon: TvIcon, label: "전자기기", href: "/category/car" },
    { icon: WrenchScrewdriverIcon, label: "수리/공구/인테리어", href: "/category/repair" },
  ];

  const productList = [
    { id: 1, title: "아파트 베란다 인테리어 공구 빌려주세요", location: "성북구 성북동", price: "50,000원", rating: 4.8, reviews: 12, tags: ["인테리어", "베란다"], image: "/images/공구.jpg" },
    { id: 2, title: "아파트 베란다 인테리어 공구 빌려주세요", location: "성북구 동선동", price: "30,000원", rating: 4.9, reviews: 24, tags: ["인테리어", "베란다"], image: "/images/공구.jpg" },
  ];

  const communityPostList = [
    { date: "2024-03-15", title: "길 잃은 고양이 찾아드려요" },
    { date: "2024-03-14", title: "길 잃은 고양이 보셨나요?ㅜㅜ" },
  ];

  const handleChatClick = (e: React.MouseEvent) => {
    const token = localStorage.getItem("accessToken");
    
    if (!user || !token) {
      e.preventDefault(); 
      toast.error("로그인이 필요한 서비스입니다.");
      router.push("/login?returnUrl=/chat");
    }
  };

  return (
    <div className="relative space-y-12 pb-20">
      <LocationSection />

      {/* 플로팅 채팅 버튼 */}
      <Link
        href="/chat"
        onClick={handleChatClick} // 클릭 시 로그인 체크
        className="fixed bottom-10 right-10 z-50 flex items-center gap-2 px-6 py-4 bg-primary-purple text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 shadow-purple-200"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
        <span className="font-bold">채팅 목록</span>
      </Link>

      {/* Category Section */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">실시간 인기 검색어</h2>
        <p className="text-[var(--color-text-secondary)] mb-8">#자전거 #캠핑의자 #유아용품</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link key={index} href={category.href} className="flex flex-col items-center p-6 bg-white rounded-xl border border-[var(--color-border)] hover:shadow-md hover:bg-[#FAFAFF] transition-all group">
              <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[var(--color-primary)]/20">
                <category.icon className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <span className="text-sm font-medium text-center">{category.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">우리 동네 인기 물건 빌려요</h2>
          <Link href="/products" className="flex items-center text-[var(--color-primary)] font-medium">
            더보기 <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productList.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40 bg-gray-200">
                <Image src={product.image} alt={product.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>
                <div className="flex items-center text-sm text-[var(--color-text-secondary)] mb-2"><MapPinIcon className="w-4 h-4 mr-1" />{product.location}</div>
                <div className="flex items-center justify-between font-bold text-[var(--color-primary)]">{product.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">커뮤니티</h2>
          <Link 
            href="/chat" 
            onClick={handleChatClick} 
            className="flex items-center gap-1 text-sm font-semibold text-primary-purple bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-all"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" /> 내 채팅 목록
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <div className="space-y-4">
            {communityPostList.map((post, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-b-0">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[var(--color-success)] rounded-full mr-3"></div>
                  <span>{post.title}</span>
                </div>
                <span className="text-sm text-gray-400">{post.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}