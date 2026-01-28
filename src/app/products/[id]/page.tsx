"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { 
  MapPinIcon, ChevronLeftIcon, ShareIcon, EllipsisHorizontalIcon,
  HeartIcon as HeartOutlineIcon, BookmarkIcon as BookmarkOutlineIcon
} from "@heroicons/react/24/outline";
import { 
  HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon 
} from "@heroicons/react/24/solid";

import { useProducts } from "@/hooks/domain/useProducts";
import { chatService } from "@/services/chatService";
import useUserStore from "@/store/useUserStore";
import StaticGoogleMap from "@/components/domain/map/staticGoogleMap";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUserStore();

  const { 
    product, 
    loading, 
    fetchProductDetail, 
    handleToggleLike, 
    handleToggleBookmark 
  } = useProducts();

  useEffect(() => {
    if (id) {
      fetchProductDetail(Number(id)).then((success) => {
        if (!success) router.push("/products");
      });
    }
  }, [id, fetchProductDetail, router]);

  const onChatClick = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return router.push("/login");
    }
    if (!product) return;

    try {
      const roomId = await chatService.createRoom(product.title, product.seller.id, user.id);
      
      const query = new URLSearchParams({
        opponent: product.seller.nickname,
        title: product.title,
        productId: product.id.toString(),
        price: product.price.toString(),
      }).toString();

      router.push(`/chat/${roomId}?${query}`);
    } catch (error) {
      toast.error("채팅방 연결에 실패했습니다.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-purple"></div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="max-w-2xl mx-auto pb-24 bg-white min-h-screen shadow-sm">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-gray-50">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div className="flex gap-1">
          <button onClick={() => handleToggleBookmark(product.id)} className="p-2 hover:bg-gray-100 rounded-full transition">
            {product.isBookmarked ? <BookmarkSolidIcon className="w-6 h-6 text-yellow-500" /> : <BookmarkOutlineIcon className="w-6 h-6 text-gray-700" />}
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition"><ShareIcon className="w-6 h-6" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition"><EllipsisHorizontalIcon className="w-6 h-6" /></button>
        </div>
      </div>

      {/* 이미지 영역 */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
        <img src={product.image || "/images/공구.jpg"} alt={product.title} className="w-full h-full object-cover" />
      </div>

      {/* 판매자 정보 */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600 border border-purple-200">
            {product.seller.nickname?.[0]}
          </div>
          <div>
            <p className="font-bold text-base text-gray-900">{product.seller.nickname}</p>
            <p className="text-sm text-gray-500">{product.location}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-purple-600">매너온도 36.5℃</p>
          <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
             <div className="h-full bg-purple-500" style={{ width: `36.5%` }}></div>
          </div>
        </div>
      </div>

      {/* 상품 본문 */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] rounded-md font-semibold">{product.category}</span>
          <span className="text-xs text-gray-400">{new Date(product.createdAt).toLocaleDateString()}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.title}</h1>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap min-h-[120px]">{product.description}</p>
        <div className="text-gray-400 text-xs">
          관심 {product.likeCount} ∙ 조회 {product.viewCount || 0} ∙ 리뷰 {product.reviews || 0}
        </div>
      </div>

      {/* 지도 영역 */}
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-purple-600" />
            <span className="font-bold text-lg text-gray-900">거래 희망 지역</span>
          </div>
        </div>
        {product.latitude && product.longitude && (
          <div className="w-full h-64 rounded-2xl overflow-hidden border">
            <StaticGoogleMap lat={product.latitude} lng={product.longitude} neighborhood={product.location} />
          </div>
        )}
      </div>

      {/* 하단 플로팅 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button onClick={() => handleToggleLike(product.id)} className={`transition-transform active:scale-125 ${product.isLiked ? "text-red-500" : "text-gray-300"}`}>
              {product.isLiked ? <HeartSolidIcon className="w-8 h-8" /> : <HeartOutlineIcon className="w-8 h-8" />}
            </button>
            <div className="border-l pl-5">
              <p className="font-bold text-xl text-gray-900">{product.price.toLocaleString()}원</p>
              <p className="text-[10px] text-purple-600 font-bold">Per Day</p>
            </div>
          </div>
          <button 
            disabled={product.isRented}
            onClick={onChatClick}
            className={`px-10 py-3.5 rounded-xl font-bold text-white shadow-lg ${product.isRented ? "bg-gray-300" : "bg-purple-600 hover:bg-purple-700"}`}
          >
            {product.isRented ? "대여 중" : "채팅하기"}
          </button>
        </div>
      </div>
    </div>
  );
}