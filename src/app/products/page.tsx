"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  HomeIcon,
  UserIcon,
  HeartIcon,
  TicketIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  StarIcon,
  TvIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

type Product = {
  id: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  isRented: boolean;
  category: string;
  createdAt: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState("latest");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("전체");

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

  //더미
  const dummy: Product[] = [
    {
      id: 1,
      title: "캠핑용 의자 세트",
      location: "성북구",
      price: 15000,
      rating: 4.9,
      reviews: 12,
      image: "/images/공구.jpg",
      isRented: false,
      category: "레저/취미",
      createdAt: "2025-10-18",
    },
    {
      id: 2,
      title: "전동 드릴 세트",
      location: "성북구",
      price: 8000,
      rating: 4.8,
      reviews: 20,
      image: "/images/공구.jpg",
      isRented: true,
      category: "수리/공구/인테리어",
      createdAt: "2025-10-16",
    },
    {
      id: 3,
      title: "프로젝터 대여합니다",
      location: "마포구 연남동",
      price: 30000,
      rating: 5.0,
      reviews: 9,
      image: "/images/공구.jpg",
      isRented: false,
      category: "전자기기",
      createdAt: "2025-10-15",
    },
    {
      id: 4,
      title: "프로젝터 대여합니다",
      location: "마포구 연남동",
      price: 10000,
      rating: 4.7,
      reviews: 18,
      image: "/images/공구.jpg",
      isRented: true,
      category: "전자기기",
      createdAt: "2025-10-12",
    },
  ];

  //초기에 한번만 가져오기
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProducts(dummy);
      setLoading(false);
    }, 500);
  }, []);

  //검색
  const handleSearch = () => {
    const filtered = dummy.filter((item) =>
      item.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setProducts(filtered);
  };

  //정렬
  const handleSort = (value: string) => {
    setSort(value);
    let sorted = [...products];

    if (value === "price_low") sorted.sort((a, b) => a.price - b.price);
    else if (value === "price_high") sorted.sort((a, b) => b.price - a.price);
    else if (value === "rating") sorted.sort((a, b) => b.rating - a.rating);
    else if (value === "latest") {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else sorted = [...dummy];

    setProducts(sorted);
  };

  //필터
  const filterProducts = products.filter((p) => {
    const filterAvailable = available ? !p.isRented : true;
    const filterCategory = activeCategory === "전체" ? true : p.category === activeCategory;
    return filterAvailable && filterCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* 검색창 */}
      <div className="mx-auto mb-10 relative">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="검색어를 입력해주세요"
          className="w-full px-6 py-4 text-lg border border-[var(--color-border)] rounded-full 
                     focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 
                     focus:ring-[var(--color-primary)]/20 bg-white shadow-sm"
        />
        <button
          onClick={handleSearch}
          className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 
                     px-6 py-2 rounded-full text-[var(--color-primary)] "
        >
          검색
        </button>
      </div>
      {/* 카테고리 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {categories.map((category) => (
          <button
            key={category.label}
            onClick={() =>
              setActiveCategory((prev) => (prev === category.label ? "전체" : category.label))
            }
            className={`flex flex-col items-center justify-center p-6 rounded-xl border border-[var(--color-border)] transition cursor-pointer
        ${
          activeCategory === category.label
            ? "bg-primary-purple-alt text-white border-white"
            : "bg-white text-[var(--color-text-primary)] hover:bg-[#FAFAFF]"
        }`}
          >
            <div
              className={`w-12 h-12 mb-3 flex items-center justify-center rounded-xl transition
          ${activeCategory === category.label ? " text-white" : ""}`}
            >
              <category.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">{category.label}</span>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          성북구 {activeCategory === "전체" ? "전체" : activeCategory} 물품 빌려요
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          내 근처에서 인기 있는 다양한 물건을 바로 대여 하세요.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-3">
        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />
          대여가능만 보기
        </label>

        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="latest">최신순</option>
          <option value="price_low">가격 낮은순</option>
          <option value="price_high">가격 높은순</option>
          <option value="rating">별점 높은순</option>
        </select>
      </div>

      {/* 상품 리스트 */}
      {loading ? (
        <p className="text-center text-gray-400 mt-10">불러오는 중...</p>
      ) : filterProducts.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">상품이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filterProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-shadow relative"
            >
              <div className="relative h-44">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className={`object-cover transition ${
                    product.isRented ? "opacity-60" : "opacity-100"
                  }`}
                />
                {/* 대여중일때 */}
                {product.isRented && (
                  <div className="absolute top-3 left-3 bg-primary-purple text-white px-3 py-1 text-xs rounded-md">
                    대여중
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-2 line-clamp-2">
                  {product.title}
                </h3>

                <div className="flex items-center text-sm text-[var(--color-text-secondary)] mb-2">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {product.location}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium ml-1">{product.rating}</span>
                    <span className="text-sm text-[var(--color-text-secondary)] ml-1">
                      ({product.reviews})
                    </span>
                  </div>
                  <span className="text-[var(--color-primary)] font-bold">
                    {product.price.toLocaleString()}원
                  </span>
                </div>

                <div className="text-xs text-gray-400 ml-1">
                  {new Date(product.createdAt).toLocaleDateString("ko-KR")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
