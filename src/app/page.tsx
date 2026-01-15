"use client";

import { useEffect, useState } from "react";
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
  TvIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import LocationSection from "@/components/LocationSection";

// API 함수 임포트
import { getProducts } from "@/data/actions/products.api"; 
import { getCommunityPosts } from "@/data/actions/community.api";
import { ProductListItem } from "@/types/product";
import { CommunityPost } from "@/types/community";

export default function HomePage() {
  const router = useRouter();
  const { user } = useUserStore();

  // 상태 관리
  const [productList, setProductList] = useState<ProductListItem[]>([]);
  const [communityPostList, setCommunityPostList] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { icon: HomeIcon, label: "생활용품", href: "/category/lifestyle" },
    { icon: UserIcon, label: "의류/잡화", href: "/category/beauty" },
    { icon: HeartIcon, label: "육아", href: "/category/childcare" },
    { icon: TicketIcon, label: "레저/취미", href: "/category/leisure" },
    { icon: HeartIcon, label: "반려동물", href: "/category/pet" },
    { icon: TruckIcon, label: "자동차/정비", href: "/category/car" },
    { icon: TvIcon, label: "전자기기", href: "/category/electronics" },
    { icon: WrenchScrewdriverIcon, label: "수리/공구", href: "/category/repair" },
  ];

  // 데이터 페칭
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 메인 페이지이므로 0페이지, 4개씩만 가져오도록 설정
        const [products, community] = await Promise.all([
          getProducts(0, 4),
          getCommunityPosts(0, 5)
        ]);

        if (products) setProductList(products.content);
        if (community) setCommunityPostList(community.content);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
        onClick={handleChatClick}
        className="fixed bottom-10 right-10 z-50 flex items-center gap-2 px-6 py-4 bg-primary-purple text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 shadow-purple-200"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
        <span className="font-bold">채팅 목록</span>
      </Link>

      {/* Category Section */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">카테고리별 탐색</h2>
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
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center py-10">로딩 중...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productList.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40 bg-gray-200">
                  <Image 
                    src={product.image || "/images/공구.jpg"} 
                    alt={product.title} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-1">{product.title}</h3>
                  <div className="flex items-center text-sm text-[var(--color-text-secondary)] mb-2">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {product.seller?.nickname || "익명"}
                  </div>
                  <div className="flex items-center justify-between font-bold text-[var(--color-primary)]">
                    {product.price.toLocaleString()}원
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Community Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">커뮤니티</h2>
          <Link 
            href="/community" 
            className="flex items-center text-[var(--color-primary)] font-medium"
          >
            더보기 <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <div className="space-y-4">
            {communityPostList.length > 0 ? (
              communityPostList.map((post) => (
                <Link 
                  href={`/community/${post.id}`} 
                  key={post.id} 
                  className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center overflow-hidden">
                    <div className="w-2 h-2 bg-[var(--color-success)] rounded-full mr-3 shrink-0"></div>
                    <span className="line-clamp-1 text-[var(--color-text-primary)]">{post.title}</span>
                  </div>
                  <span className="text-sm text-gray-400 shrink-0 ml-4">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">등록된 게시글이 없습니다.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}