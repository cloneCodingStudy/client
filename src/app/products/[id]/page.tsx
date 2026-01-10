"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { getProduct, toggleProductLike, toggleProductBookmark } from "@/data/actions/products.api";
import { Product } from "@/types/product";
import { 
  MapPinIcon, 
  ChevronLeftIcon, 
  ShareIcon, 
  EllipsisHorizontalIcon,
  HeartIcon as HeartOutlineIcon,
  BookmarkIcon as BookmarkOutlineIcon
} from "@heroicons/react/24/outline";
import { 
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon 
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import StaticGoogleMap from "@/components/staticGoogleMap"; 
import useUserStore from "@/store/useUserStore"; 

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUserStore(); 
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 기능 관련 로컬 상태
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 데이터 불러오기
  useEffect(() => {
    async function fetchDetail() {
      if (!id) return;
      setLoading(true);
      const data = await getProduct(Number(id));
      if (data) {
        setProduct(data);
        setIsLiked(data.isLiked);
        setLikeCount(data.likeCount || 0);
      } else {
        toast.error("상품 정보를 찾을 수 없습니다.");
        router.push("/products");
      }
      setLoading(false);
    }
    fetchDetail();
  }, [id, router]);

  // 찜하기 토글
  const handleLikeToggle = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    const updatedCount = await toggleProductLike(Number(id));
    if (updatedCount !== null) {
      const newStatus = !isLiked;
      setIsLiked(newStatus);
      setLikeCount(updatedCount);
      toast.success(newStatus ? "관심 목록에 추가되었습니다." : "관심 목록에서 제거되었습니다.");
    }
  };

  // 북마크 토글
  const handleBookmarkToggle = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    const result = await toggleProductBookmark(Number(id));
    if (result) {
      setIsBookmarked(!isBookmarked);
      toast.success(result);
    }
  };

  // 채팅방 생성 및 이동
  const handleChatWithSeller = async () => {
    if (!product || !user) {
      if (!user) {
        toast.error("로그인이 필요합니다.");
        router.push("/login");
      }
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/rooms`, 
        {
          title: product.title,
          userIds: [user.id, product.seller.id] 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const realChatRoomId = response.data; 
      const query = new URLSearchParams({
        opponent: product.seller.nickname,
        title: product.title,
        email: product.seller.email,
      }).toString();

      router.push(`/chat/${realChatRoomId}?${query}`);
    } catch (error) {
      toast.error("채팅방 연결 중 오류가 발생했습니다.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="max-w-2xl mx-auto pb-24 bg-white min-h-screen shadow-sm">
      {/* 상단 네비게이션 바 */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-gray-50">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div className="flex gap-1">
          <button onClick={handleBookmarkToggle} className="p-2 hover:bg-gray-100 rounded-full transition">
            {isBookmarked ? <BookmarkSolidIcon className="w-6 h-6 text-yellow-500" /> : <BookmarkOutlineIcon className="w-6 h-6 text-gray-700" />}
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition"><ShareIcon className="w-6 h-6" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition"><EllipsisHorizontalIcon className="w-6 h-6" /></button>
        </div>
      </div>

      {/* 상품 이미지 */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
        <img 
          src={product.image || "/images/공구.jpg"} 
          alt={product.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* 판매자 프로필 */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600 border border-purple-200">
            {product.seller.nickname?.[0] || "U"}
          </div>
          <div>
            <p className="font-bold text-base text-gray-900">{product.seller.nickname}</p>
            <p className="text-sm text-gray-500">{product.location}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-purple-600">매너온도 36.5℃</p>
          <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
             <div className="w-1/2 h-full bg-purple-500"></div>
          </div>
        </div>
      </div>

      {/* 상품 상세 내용 */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] rounded-md font-semibold tracking-tight">
            {product.category}
          </span>
          <span className="text-xs text-gray-400">
            {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "등록일 정보 없음"}
          </span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.title}</h1>
        
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap min-h-[120px] text-base">
          {product.description}
        </p>

        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <span>관심 {likeCount}</span> ∙ <span>조회 12</span>
        </div>
      </div>

      <hr className="mx-6 border-gray-50" />

      {/* 위치 정보 안내 */}
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-purple-600" />
            <span className="font-bold text-lg text-gray-900">거래 희망 지역</span>
          </div>
          <span className="text-gray-600 text-sm font-medium">{product.location}</span>
        </div>

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
      </div>

      {/* 하단 고정 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-20 pb-safe">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button 
              onClick={handleLikeToggle}
              className={`transition-transform active:scale-125 ${isLiked ? "text-red-500" : "text-gray-300 hover:text-red-400"}`}
            >
              {isLiked ? <HeartSolidIcon className="w-8 h-8" /> : <HeartOutlineIcon className="w-8 h-8" />}
            </button>
            <div className="border-l border-gray-100 pl-5">
              <p className="font-bold text-xl text-gray-900">{product.price.toLocaleString()}원</p>
              <p className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Per Day</p>
            </div>
          </div>
          <button 
            disabled={product.isRented}
            onClick={handleChatWithSeller}
            className={`px-10 py-3.5 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg ${
              product.isRented 
                ? "bg-gray-300 cursor-not-allowed shadow-none" 
                : "bg-purple-600 hover:bg-purple-700 shadow-purple-100"
            }`}
          >
            {product.isRented ? "대여 중" : "채팅하기"}
          </button>
        </div>
      </div>
    </div>
  );
}