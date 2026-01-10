"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProductCard from "@/components/ProductCard";
import { ProductListItem } from "@/types/product";
import { getMyInteractions } from "@/data/actions/user.api";

type TabType = "likes" | "bookmarks";

export default function WishlistPage() {
  const [activeTab, setActiveTab] = useState<TabType>("likes");
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      const data = await getMyInteractions(activeTab);
      
      if (data && data.content) {
        setProducts(data.content);
      } else {
        setProducts([]);
      }
      setIsLoading(false);
    };

    fetchWishlist();
  }, [activeTab]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">관심 목록</h1>

      {/* 탭 메뉴 */}
      <div className="flex border-b border-gray-200 mb-10">
        <button
          onClick={() => setActiveTab("likes")}
          className={`px-8 py-4 font-bold text-sm transition-all relative ${
            activeTab === "likes" ? "text-purple-600" : "text-gray-400"
          }`}
        >
          찜한 상품
          {activeTab === "likes" && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`px-8 py-4 font-bold text-sm transition-all relative ${
            activeTab === "bookmarks" ? "text-purple-600" : "text-gray-400"
          }`}
        >
          북마크
          {activeTab === "bookmarks" && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-t-full" />
          )}
        </button>
      </div>

      {/* 리스트 영역 */}
      {isLoading ? (
        <div className="py-20 text-center text-gray-400 text-lg">목록을 불러오는 중...</div>
      ) : products.length === 0 ? (
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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}