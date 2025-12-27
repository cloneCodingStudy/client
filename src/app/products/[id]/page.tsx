"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProduct, deleteProduct } from "@/data/actions/products.api";
import { Product } from "@/types/product";
import { 
  MapPinIcon, 
  ChevronLeftIcon, 
  ShareIcon, 
  EllipsisHorizontalIcon 
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import StaticGoogleMap from "@/components/staticGoogleMap"; 

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. 데이터 불러오기
  useEffect(() => {
    async function fetchDetail() {
      if (!id) return;
      setLoading(true);
      const data = await getProduct(Number(id));
      if (data) {
        setProduct(data);
      } else {
        toast.error("상품 정보를 찾을 수 없습니다.");
        router.push("/products");
      }
      setLoading(false);
    }
    fetchDetail();
  }, [id, router]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="max-w-2xl mx-auto pb-24 bg-white">
      {/* 상단 네비게이션 바 */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition"><ShareIcon className="w-6 h-6" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition"><EllipsisHorizontalIcon className="w-6 h-6" /></button>
        </div>
      </div>

      {/* 상품 이미지 */}
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        <img 
          src={product.image || "/images/공구.jpg"} 
          alt={product.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* 판매자 프로필 */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600">
            {product.seller.nickname?.[0] || "U"}
          </div>
          <div>
            <p className="font-bold text-base">{product.seller.nickname}</p>
            <p className="text-sm text-gray-500">{product.location}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-purple-600">매너온도 36.5℃</p>
          <div className="w-20 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
             <div className="w-1/2 h-full bg-purple-500"></div>
          </div>
        </div>
      </div>

      {/* 상품 상세 내용 */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
            {product.category}
          </span>
          <span className="text-xs text-gray-400">{product.createdAt}</span>
        </div>
        
        <h1 className="text-2xl font-bold">{product.title}</h1>
        
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap min-h-[150px]">
          {product.description}
        </p>

        <div className="flex items-center gap-1 text-gray-400 text-sm">
          <span>관심 0</span> ∙ <span>조회 12</span>
        </div>
      </div>

      <hr className="mx-4 border-gray-100" />

      {/* 2. 위치 정보 안내 및 지도 추가 */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-purple-600" />
            <span className="font-bold text-lg">거래 희망 지역</span>
          </div>
          <span className="text-gray-600 text-sm font-medium">{product.location}</span>
        </div>

        {/* 좌표 데이터가 있을 때만 지도 표시 */}
        {product.latitude && product.longitude ? (
          <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <StaticGoogleMap 
              lat={product.latitude} 
              lng={product.longitude} 
              neighborhood={product.location} 
            />
          </div>
        ) : (
          <div className="w-full h-32 bg-gray-50 rounded-2xl flex items-center justify-center border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm font-medium">거래 장소 정보가 없습니다.</p>
          </div>
        )}
        <p className="text-xs text-gray-400">
          * 대여자와 채팅을 통해 상세 거래 장소를 확정해 주세요.
        </p>
      </div>

      {/* 하단 고정 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-red-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
            <div className="border-l pl-4">
              <p className="font-bold text-lg">{product.price.toLocaleString()}원</p>
              <p className="text-xs text-purple-600 font-medium">1일 대여 기준</p>
            </div>
          </div>
          <button 
            disabled={product.isRented}
            className={`px-8 py-3 rounded-xl font-bold text-white transition-all active:scale-95 ${
              product.isRented ? "bg-gray-300 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200"
            }`}
          >
            {product.isRented ? "대여 중" : "채팅하기"}
          </button>
        </div>
      </div>
    </div>
  );
}