"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MapPinIcon, StarIcon, FlagIcon } from "@heroicons/react/24/outline";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Review } from "@/types/review";
import { getProduct } from "@/data/actions/products.api";
import ReportModal from "@/components/reportModal";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      const data = await getProduct(Number(id));

      if (!data) return;
      setProduct(data);

      setSellerProducts([]);
      setPopularProducts([]);
      setReviews([]);
    }

    fetchData();
  }, [id]);

  if (!product) return <p className="text-center mt-10">상품을 불러오는 중...</p>;

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
          {/* 상품 이미지 */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-[var(--color-border)] ">
            <Image
              src={product.image || "/images/공구.jpg"}
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
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-bold flex-1">{product.title}</h1>
              {/* 신고하기 버튼 */}
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors text-sm"
                title="신고하기"
              >
                <FlagIcon className="w-5 h-5" />
                <span>신고</span>
              </button>
            </div>

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

            {/* 버튼 */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <button
                onClick={() => router.push(`/chat/${product.seller.id}`)}
                className="cursor-pointer flex-1 sm:max-w-[200px] bg-gray-100 border border-[var(--color-border)] text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                1:1 채팅하기
              </button>
              <button
                disabled={product.isRented}
                onClick={() => router.push(`/rent/${product.id}`)}
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

        {/* 리뷰  */}
        <section className="mb-12">
          <h3 className="text-lg font-semibold mb-4">리뷰 {reviews.length}건</h3>

          {reviews.length > 0 ? (
            <ul className="space-y-6">
              {reviews.map((review) => (
                <li key={review.id} className="border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{review.writer}</span>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">아직 등록된 리뷰가 없습니다.</p>
          )}
        </section>

        {/* 상품 더보기 */}
        <section className="border-b border-[var(--color-border)] mb-8 pb-8">
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
        </section>

        {/* 카테고리 인기 매물 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">{product.category} 인기매물</h3>
            <Link
              href="/products"
              className="text-primary-purple text-sm font-medium hover:underline"
            >
              더보기 &gt;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {popularProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </div>

      {/* 신고하기 모달 */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetId={product.id}
        targetTitle={product.title}
        targetType="product"
      />
    </>
  );
}
