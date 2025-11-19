"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { ProductListItem } from "@/types/product";
import { deleteProduct } from "@/data/actions/products.api";

export default function MyProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const router = useRouter();

  // 더미
  useEffect(() => {
    const dummy: ProductListItem[] = [
      {
        id: 1,
        title: "전동 드릴",
        price: 5000,
        isRented: false,
        createdAt: "2025-01-12",
        seller: {
          id: 10,
          nickname: "유진",
          email: "yj@example.com",
        },
      },
      {
        id: 2,
        title: "대여합니다",
        price: 3000,
        isRented: true,
        createdAt: "2025-01-10",
        seller: {
          id: 10,
          nickname: "유진",
          email: "yj@ㅇㅇ",
        },
      },
    ];

    setProducts(dummy);
  }, []);

  // 대여중이면 수정 불가
  const handleEdit = (id: number) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;

    if (item.isRented) {
      toast.error("대여중인 상품은 수정할 수 없습니다.");
      return;
    }

    router.push(`/products/edit/${id}`);
  };

  // 대여중이면 삭제 불가
  const handleDelete = async (id: number) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;

    if (item.isRented) {
      toast.error("대여중인 상품은 삭제할 수 없습니다.");
      return;
    }

    const ok = confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    try {
      const success = await deleteProduct(id);

      if (!success) {
        toast.error("상품 삭제에 실패했습니다.");
        return;
      }

      // 화면에서 제거
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("상품이 삭제되었습니다.");
    } catch (err) {
      console.error(err);
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">내 상품 관리</h1>

      {products.length === 0 ? (
        <p className="text-gray-400">등록한 상품이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map((item) => (
            <div key={item.id} className="p-4 rounded-lg shadow-sm flex flex-col gap-3">
              {/* 이미지 */}
              <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
                <Image src={"/images/공구.jpg"} alt={item.title} fill className="object-cover" />

                {/* 대여중 */}
                {item.isRented && (
                  <div className="absolute top-3 left-3 bg-primary-purple text-white px-3 py-1 text-xs rounded-md">
                    대여중
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-lg">{item.title}</h3>

              <div className="text-gray-600 text-sm">{item.price.toLocaleString()}원</div>

              <div className="text-gray-400 text-xs">
                등록일: {new Date(item.createdAt).toLocaleDateString("ko-KR")}
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  수정하기
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  삭제하기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
