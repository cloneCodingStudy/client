"use client";

import { useEffect, useState, useMemo } from "react";
import {
  HomeIcon, UserIcon, HeartIcon, TicketIcon,
  TruckIcon, WrenchScrewdriverIcon, TvIcon,
} from "@heroicons/react/24/outline";
import ProductCard from "@/components/common/ProductCard";
import { useRouter } from "next/navigation"; 
import { useProducts } from "@/hooks/domain/useProducts";
import useLocationStore from "@/store/useLocationStore";
import useUserStore from "@/store/useUserStore"; 
import toast from "react-hot-toast";

export default function ProductsPage() {
  const router = useRouter();
  const { location } = useLocationStore();
  const { user } = useUserStore(); 
  
  const { items: products, loading, fetchProducts } = useProducts();

  const [sort, setSort] = useState("latest");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("전체");

  const categories = [
    { icon: HomeIcon, label: "생활용품" },
    { icon: UserIcon, label: "의류/잡화" },
    { icon: HeartIcon, label: "육아" },
    { icon: TicketIcon, label: "레저/ hobby" },
    { icon: HeartIcon, label: "반려동물" },
    { icon: TruckIcon, label: "자동차/정비" },
    { icon: TvIcon, label: "전자기기" },
    { icon: WrenchScrewdriverIcon, label: "수리/공구/인테리어" },
  ];

  useEffect(() => {
    const position = location?.lat && location?.lng 
      ? { lat: location.lat, lng: location.lng, distance: 3000 } 
      : undefined;
    
    fetchProducts(0, 40, position);
  }, [location, fetchProducts]);

  const handleWriteClick = () => {
    if (!user) {
      toast.error("로그인이 필요한 서비스입니다.");
      router.push("/login?returnUrl=/products/new");
      return;
    }
    router.push("/products/new");
  };

  const displayProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== "전체") {
      result = result.filter((p: any) => p.category === activeCategory);
    }
    if (availableOnly) {
      result = result.filter((p) => !p.isRented);
    }
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(keyword));
    }

    if (sort === "price_low") result.sort((a, b) => a.price - b.price);
    else if (sort === "price_high") result.sort((a, b) => b.price - a.price);
    else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [products, activeCategory, availableOnly, searchKeyword, sort]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* 검색 바 */}
      <div className="mb-12 relative group">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="어떤 물건이 필요하신가요?"
          className="w-full px-8 py-5 text-lg border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white transition-all group-hover:border-purple-200"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">검색</div>
      </div>

      {/* 카테고리 섹션 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(prev => prev === cat.label ? "전체" : cat.label)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
              activeCategory === cat.label 
                ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-100 scale-105" 
                : "bg-white border-gray-100 text-gray-500 hover:border-purple-200 hover:bg-purple-50"
            }`}
          >
            <cat.icon className={`w-6 h-6 mb-2 ${activeCategory === cat.label ? "text-white" : "text-gray-400"}`} />
            <span className="text-xs font-bold whitespace-nowrap">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* 상단 컨트롤 바 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-100 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">
            <span className="text-purple-600">[{location?.neighborhood || "전국"}]</span> {activeCategory === "전체" ? "전체 상품" : activeCategory}
          </h2>
          <p className="text-sm text-gray-400 mt-1">총 {displayProducts.length}개의 상품이 있습니다.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 cursor-pointer">
            <input 
              type="checkbox" 
              checked={availableOnly} 
              onChange={(e) => setAvailableOnly(e.target.checked)} 
              className="w-4 h-4 accent-purple-600" 
            />
            대여 가능만
          </label>
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)} 
            className="text-sm font-bold border-none bg-transparent focus:ring-0 text-gray-700 cursor-pointer"
          >
            <option value="latest">최신순</option>
            <option value="price_low">낮은가격순</option>
            <option value="price_high">높은가격순</option>
          </select>
          <button 
            onClick={handleWriteClick} 
            className="px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-purple-600 transition-all shadow-xl shadow-gray-100 active:scale-95"
          >
            + 상품 등록
          </button>
        </div>
      </div>

      {/* 리스트 영역 */}
      {loading && products.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-medium">동네 물건들을 찾고 있어요...</p>
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="py-32 text-center border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/50">
          <p className="text-gray-400 text-lg">찾으시는 상품이 아직 없네요.</p>
          <button 
            onClick={() => { setActiveCategory("전체"); setSearchKeyword(""); }}
            className="mt-4 text-purple-600 font-bold hover:underline"
          >
            필터 초기화하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}