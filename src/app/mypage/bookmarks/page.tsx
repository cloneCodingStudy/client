"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/common/ProductCard";
import { useMyPage } from "@/hooks/pages/useMyPage";

type TabType = "likes" | "bookmarks";

export default function WishlistPage() {
  const [activeTab, setActiveTab] = useState<TabType>("likes");
  const router = useRouter();
  
  const { list, loading, loadListData } = useMyPage();

  useEffect(() => {
    loadListData(activeTab);
  }, [activeTab, loadListData]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">관심 목록</h1>

      {/* 탭 메뉴 */}
      <div className="flex border-b border-gray-200 mb-10">
        {(["likes", "bookmarks"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 font-bold text-sm transition-all relative ${
              activeTab === tab ? "text-purple-600" : "text-gray-400"
            }`}
          >
            {tab === "likes" ? "찜한 상품" : "북마크"}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* 리스트 영역: list와 loading 상태 활용 */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-lg">목록을 불러오는 중...</div>
      ) : list.length === 0 ? (
        <div className="py-32 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
          <p className="text-gray-400 mb-6 text-lg">
            {activeTab === "likes" ? "찜한 상품이 없습니다." : "북마크한 상품이 없습니다."}
          </p>
          <button
            onClick={() => router.push("/products")}
            className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            상품 둘러보기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}