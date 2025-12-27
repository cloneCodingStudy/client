"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  HomeIcon, UserIcon, HeartIcon, TicketIcon,
  TruckIcon, WrenchScrewdriverIcon, TvIcon,
} from "@heroicons/react/24/outline";
import ProductCard from "@/components/ProductCard";
import { ProductListItem } from "@/types/product";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { getProducts } from "@/data/actions/products.api"; 
import useLocationStore from "@/store/useLocationStore";
import useUserStore from "@/store/useUserStore"; 
import toast from "react-hot-toast";

export default function ProductsPage() {
  const router = useRouter();
  const { location } = useLocationStore();
  const { user } = useUserStore(); 
  
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [sort, setSort] = useState("latest");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(false);
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    const position = location?.lat && location?.lng 
      ? { lat: location.lat, lng: location.lng, distance: 3000 } 
      : undefined;

    const data = await getProducts(0, 20, position);
    
    if (data && data.content) {
      setProducts(data.content);
    } else {
      setProducts([]);
    }
    setLoading(false);
  }, [location]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleWriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); 

    const token = localStorage.getItem("accessToken");
    
    if (!token || !user) {
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
    if (available) {
      result = result.filter((p) => !p.isRented);
    }
    if (searchKeyword.trim()) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
    if (sort === "price_low") result.sort((a, b) => a.price - b.price);
    else if (sort === "price_high") result.sort((a, b) => b.price - a.price);
    else if (sort === "latest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [products, activeCategory, available, searchKeyword, sort]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* 검색창 */}
      <div className="mx-auto mb-10 relative">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="검색어를 입력해주세요"
          className="w-full px-6 py-4 text-lg border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white"
        />
      </div>

      {/* 카테고리 리스트 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(prev => prev === cat.label ? "전체" : cat.label)}
            className={`flex flex-col items-center justify-center p-6 rounded-xl border transition ${
              activeCategory === cat.label ? "bg-purple-600 text-white" : "bg-white hover:bg-purple-50"
            }`}
          >
            <cat.icon className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* 헤더 및 필터 컨트롤 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            <span className="text-purple-600">{location?.neighborhood || "전국"}</span> {activeCategory === "전체" ? "" : activeCategory} 물품 빌려요
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} className="accent-purple-600" />
            대여가능만
          </label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-sm border-none bg-transparent">
            <option value="latest">최신순</option>
            <option value="price_low">낮은가격순</option>
            <option value="price_high">높은가격순</option>
          </select>
          {/* Link 대신 버튼처럼 작동하도록 핸들러 연결 */}
          <button 
            onClick={handleWriteClick} 
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 transition"
          >
            글쓰기
          </button>
        </div>
      </div>

      {/* 결과 리스트 */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">불러오는 중...</div>
      ) : displayProducts.length === 0 ? (
        <div className="py-20 text-center text-gray-400 border-2 border-dashed rounded-3xl">등록된 상품이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}