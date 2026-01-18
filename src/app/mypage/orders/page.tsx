"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { ProductListItem } from "@/types/product";
import { getMyOrders } from "@/data/actions/mypage.api";

export default function MyOrdersPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const result = await getMyOrders(0, 20);
        if (result && result.content) {
          setProducts(result.content);
        }
      } catch (error) {
        toast.error("주문 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleReturn = (id: number) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;

    if (!item.isRented) {
      toast.error("대여 중인 상품만 반납할 수 있습니다.");
      return;
    }

    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, isRented: false } : product
      )
    );
    toast.success("반납 요청이 접수되었습니다.");
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-400">
        정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">내 주문 관리</h1>
        <button
          onClick={() => router.push("/products")}
          className="bg-primary-purple text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm active:scale-95"
        >
          + 상품 둘러보기
        </button>
      </div>

      {products.length === 0 ? (
        <div className="py-32 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30">
          <p className="text-gray-400 mb-4">대여한 상품이 없습니다.</p>
          <button
            onClick={() => router.push("/products")}
            className="text-primary-purple font-bold hover:underline"
          >
            대여 가능한 상품을 찾아보세요!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="group p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 bg-white"
            >
              <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
                <Image
                  src={item.imageUrl ? item.imageUrl : "/images/공구.jpg"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.isRented && (
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 text-[10px] font-bold rounded-full border border-white/20">
                    대여 중
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-lg text-gray-900 truncate">
                  {item.title}
                </h3>
                <div className="text-primary-purple font-extrabold text-xl">
                  {item.price.toLocaleString()}원
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50">
                <div className="flex justify-between items-center text-[11px] text-gray-400 mb-4">
                  <span>판매자: {item.seller.nickname}</span>
                  <span>
                    {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>

                <button
                  onClick={() => handleReturn(item.id)}
                  disabled={!item.isRented}
                  className={`w-full py-3 text-sm font-bold rounded-xl transition-all ${
                    item.isRented
                      ? "bg-primary-purple text-white hover:bg-opacity-90 active:scale-95"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  반납하기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}