"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { MapPinIcon, StarIcon } from "@heroicons/react/24/outline";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);

  //dummy
  useEffect(() => {
    const dummy: Product = {
      id: 1,
      title: "새상품",
      description: "설명어쩌고 상품설명",
      price: 37000,
      location: "성북동",
      image: "/images/공구.jpg",
      isRented: false,
      rating: 4.85,
      reviews: 26,
      createdAt: "2025-10-20",
      category: "수리/공구/인테리어",
      seller: {
        email: "yujin@gmail.com",
        name: "정유진",
        nickname: "별명",
        accessToken: "",
        refreshToken: "",
      },
    };

    //판매자 다른 상품 더미
    const dummy2: Product[] = [
      {
        id: 2,
        title: "새상품",
        description: "설명어쩌고 상품설명",
        price: 30400,
        location: "성북동",
        image: "/images/공구.jpg",
        isRented: false,
        rating: 4.85,
        reviews: 26,
        createdAt: "2025-10-20",
        category: "수리/공구/인테리어",
        seller: {
          email: "yujin@gmail.com",
          name: "정유진",
          nickname: "별명",
          accessToken: "",
          refreshToken: "",
        },
      },
      {
        id: 3,
        title: "새상품",
        description: "설명어쩌고 상품설명",
        price: 2320,
        location: "성북동",
        image: "/images/공구.jpg",
        isRented: true,
        rating: 4.85,
        reviews: 26,
        createdAt: "2025-10-20",
        category: "수리/공구/인테리어",
        seller: {
          email: "yujin@gmail.com",
          name: "정유진",
          nickname: "별명",
          accessToken: "",
          refreshToken: "",
        },
      },
      {
        id: 4,
        title: "새상품",
        description: "설명어쩌고 상품설명",
        price: 3721,
        location: "성북동",
        image: "/images/공구.jpg",
        isRented: false,
        rating: 4.85,
        reviews: 26,
        createdAt: "2025-10-20",
        category: "수리/공구/인테리어",
        seller: {
          email: "yujin@gmail.com",
          name: "정유진",
          nickname: "별명",
          accessToken: "",
          refreshToken: "",
        },
      },
    ];
    setProduct(dummy);
    setSellerProducts(dummy2);
    setPopularProducts(dummy2);
  }, [id]);

  //로딩페이지
  if (!product) return <p className="text-center mt-10">상품을 불러오는 중...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
        {/* 상품 이미지 */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-[var(--color-border)] ">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className={`object-cover transition ${product.isRented ? "opacity-60" : "opacity-100"}`}
          />
          {product.isRented && (
            <div className="absolute top-3 left-3 bg-primary-purple text-white text-sm px-3 py-1 rounded-md">
              대여중
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-500 mb-6">{product.description}</p>

          <div className="text-3xl font-bold text-[var(--color-primary)] mb-3">
            {product.price.toLocaleString()}원
          </div>

          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <MapPinIcon className="w-5 h-5" />
            {product.location}
          </div>

          <div className="flex items-center gap-1 mb-6">
            <StarIcon className="w-5 h-5 text-yellow-500 fill-current " />
            <span className="font-medium">{product.rating}</span>
            <span className="text-gray-500 text-sm">({product.reviews})</span>
          </div>

          <div className="text-sm text-gray-400">
            등록일 {new Date(product.createdAt).toLocaleDateString("ko-KR")}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button className="cursor-pointer flex-1 sm:max-w-[200px] bg-gray-100 border border-[var(--color-border)] text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
              1:1 채팅하기
            </button>
            <button
              disabled={product.isRented}
              className={`flex-1 sm:max-w-[200px] py-3 rounded-lg font-semibold transition ${
                product.isRented
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-primary-purple cursor-pointer text-white hover:bg-primary-purple-alt"
              }`}
            >
              {product.isRented ? "대여중" : "바로 빌려요"}
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-[var(--color-border)]  mb-8 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center  ">
            프로필
          </div>
          <div>
            <p className="font-medium">{product.seller.nickname}</p>
            <p className="text-sm text-gray-500">{product.seller.email}</p>
          </div>
        </div>
      </div>

      {/* 상품 더보기 */}
      <div className="border-b border-[var(--color-border)] mb-8 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-semibold">
            {product.seller.nickname} 님의 대여상품
          </h3>
          <Link href="/" className="text-primary-purple text-sm font-medium cursor-pointer">
            더보기 &gt;
          </Link>
        </div>
        {sellerProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {sellerProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">판매자의 다른 상품이 없습니다.</p>
        )}
      </div>

      {/* 카테고리 인기 매물 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{product.category} 인기매물</h3>
        <Link href="/products" className="text-primary-purple text-sm font-medium hover:underline">
          더보기 &gt;
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {popularProducts.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
