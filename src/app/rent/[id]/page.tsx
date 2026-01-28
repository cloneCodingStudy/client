"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useRent } from "@/hooks/pages/useRent";

export default function RentPage() {
  const { id } = useParams();
  const { product, isRequesting, handleRent } = useRent(id ?? "");

  if (!product) return <p className="text-center mt-20">불러오는 중...</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">대여 주문서</h1>

      {/* 상품 정보 카드 */}
      <div className="border rounded-xl p-6 flex items-start gap-6 shadow-sm mb-8 bg-white">
        <div className="relative w-28 h-28 bg-gray-100 rounded-lg overflow-hidden shrink-0">
          <Image
            src={product.image || "/images/공구.jpg"}
            alt={product.title}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>

        <div className="flex flex-col gap-1 justify-center self-stretch">
          <span className="text-lg font-semibold line-clamp-1">{product.title}</span>
          <span className="text-gray-500 text-sm">{product.location}</span>
          <span className="text-3xl font-bold text-primary-purple mt-auto">
            {product.price.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={handleRent}
        disabled={isRequesting}
        className="w-full py-4 rounded-xl bg-primary-purple text-white font-semibold hover:bg-primary-purple-alt transition text-lg disabled:opacity-60"
      >
        {isRequesting ? "결제 처리 중..." : "결제하고 빌려요"}
      </button>
    </div>
  );
}