"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Product } from "@/types/product";
import { getProduct } from "@/data/actions/products.api";

export default function RentPage() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      const data = await getProduct(Number(id));

      if (!data) {
        toast.error("상품 정보를 불러오지 못했습니다.");
        router.push(`/products/${id}`);
        return;
      }

      setProduct(data);
    }

    fetchData();
  }, [id, router]);

  const handleRent = () => {
    if (!product) return;

    // TODO: 포트원 결제 연동 예정
    toast.success("포트원 결제 연동 예정");
  };

  if (!product) return <p className="text-center mt-20">불러오는 중...</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">대여 주문서</h1>

      {/* 상품 정보 */}
      <div className="border rounded-xl p-6 flex items-start gap-6 shadow-sm mb-8 bg-white">
        <div className="w-28 h-28 bg-gray-200 rounded-lg overflow-hidden" />
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold">{product.title}</span>
          <span className="text-gray-500 text-sm">{product.location}</span>
          <span className="text-3xl font-bold text-[var(--color-primary)] mt-2">
            {product.price.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={handleRent}
        className="w-full py-4 rounded-xl bg-primary-purple text-white font-semibold hover:bg-primary-purple-alt transition text-lg"
      >
        결제하고 빌려요
      </button>
    </div>
  );
}
