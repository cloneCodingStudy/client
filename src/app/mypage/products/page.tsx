"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { ProductListItem } from "@/types/product";
import { deleteProduct } from "@/data/actions/products.api";
import { getMyProducts } from "@/data/actions/mypage.api";

export default function MyProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const result = await getMyProducts(0, 20);
        if (result && result.content) {
          setProducts(result.content);
        }
      } catch (error) {
        toast.error("상품 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleEdit = (id: number) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;

    if (item.isRented) {
      toast.error("대여 중인 상품은 수정할 수 없습니다.");
      return;
    }

    router.push(`/products/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;

    if (item.isRented) {
      toast.error("대여 중인 상품은 삭제할 수 없습니다.");
      return;
    }

    if (!confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    try {
      const success = await deleteProduct(id);
      if (success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success("게시글이 삭제되었습니다.");
      } else {
        toast.error("삭제 실패: 권한이 없거나 오류가 발생했습니다.");
      }
    } catch (err) {
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-400">정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">내 상품 관리</h1>
        {/* 상품 등록 버튼 경로 수정: /products/new */}
        <button 
          onClick={() => router.push('/products/new')}
          className="bg-primary-purple text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm active:scale-95"
        >
          + 상품 등록하기
        </button>
      </div>

      {products.length === 0 ? (
        <div className="py-32 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30">
          <p className="text-gray-400 mb-4">등록된 상품이 없습니다.</p>
          {/* 하단 안내 버튼 경로 수정: /products/new */}
          <button 
            onClick={() => router.push('/products/new')}
            className="text-primary-purple font-bold hover:underline"
          >
            첫 번째 상품을 등록해 보세요!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map((item) => (
            <div key={item.id} className="group p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 bg-white">
              {/* 이미지 영역 */}
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

              {/* 콘텐츠 영역 */}
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-lg text-gray-900 truncate">{item.title}</h3>
                <div className="text-primary-purple font-extrabold text-xl">
                  {item.price.toLocaleString()}원
                </div>
              </div>

              {/* 하단 버튼 및 정보 */}
              <div className="pt-4 border-t border-gray-50">
                <div className="flex justify-between items-center text-[11px] text-gray-400 mb-4">
                  <span>판매자: {item.seller.nickname}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString("ko-KR")}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="flex-1 py-3 text-sm font-bold border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    수정하기
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 py-3 text-sm font-bold bg-red-50 text-red-500 rounded-xl hover:bg-red-100 active:scale-95 transition-all"
                  >
                    삭제하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}