"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import ImageUpload from "@/components/common/ImageUpload";
import MapModal from "@/components/common/mapModal";
import { useCommunity } from "@/hooks/domain/useCommunity";

export default function CommunityPostWrite() {
  const router = useRouter();
  
  const { loading, handleCreatePost } = useCommunity();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const max = 60;
  
  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    setLocation(address);
    setCoords({ lat, lng });
  };

  const handleMapConfirm = () => {
    if (location && coords) {
      setShowMapModal(false);
      toast.success("위치가 설정되었습니다.");
    } else {
      toast.error("위치를 선택해주세요.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category) return toast.error("게시판을 선택해주세요.");
    if (!location) return toast.error("위치를 설정해주세요.");
    if (!title.trim()) return toast.error("제목을 입력해주세요.");
    if (!content.trim()) return toast.error("내용을 입력해주세요.");

    const result = await handleCreatePost({
      title,
      content,
      category,
      location,
      lat: coords?.lat,
      lng: coords?.lng,
    }, []); 

    if (result) {
      router.push("/community");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs text-purple-600 font-semibold mb-2 px-1">
        📍 현재 위치: {location || "위치 정보 없음"}
      </div>
      
      <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg mb-8">
        ⚠️ 건전한 커뮤니티 환경을 위해 일부 글은 운영 정책에 따라 노출이 제한되거나 삭제될 수 있습니다.
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm w-1/2 focus:ring-purple-500 focus:outline-none"
        >
          <option value="" disabled hidden>게시판을 선택해주세요 (필수)</option>
          <option value="INFO">동네생활</option>
          <option value="TIP">꿀팁</option>
          <option value="PET">반려동물 🐈</option>
          <option value="BBANG">붕어빵 위치</option>
          <option value="LOST">분실물</option>
        </select>

        <div className="flex items-center justify-between border-b border-gray-300 py-3 my-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요."
            maxLength={60}
            className="w-full text-lg focus:outline-none bg-transparent"
          />
          <span className="text-sm text-gray-400 ml-2">{title.length}/{max}</span>
        </div>

        <section className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
          <label className="text-sm font-bold text-purple-700 block mb-3">어디서 글을 쓰시나요?</label>
          <button
            type="button"
            onClick={() => setShowMapModal(true)}
            className="w-full py-4 bg-white border-2 border-purple-200 border-dashed rounded-xl text-purple-600 hover:border-purple-400 transition-all flex items-center justify-center gap-2 mb-3"
          >
            <span>📍</span>
            <span className="font-semibold">{location ? "위치 변경하기" : "지도로 위치 선택하기"}</span>
          </button>
          {location && (
            <div className="bg-purple-100/50 px-4 py-2 rounded-lg text-sm text-purple-800 font-medium">
              ✅ {location}
            </div>
          )}
        </section>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력해주세요."
          rows={12}
          className="resize-none w-full rounded-lg p-4 text-sm focus:outline-none bg-gray-50/30"
        />

        {/* 사진 업로드 컴포넌트 */}
        <ImageUpload imageUrls={imageUrls} setImageUrls={setImageUrls} />

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-bold shadow-lg disabled:bg-gray-400"
          >
            {loading ? "올리는 중..." : "글 올리기"}
          </button>
        </div>
      </form>

      <MapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onConfirm={handleMapConfirm}
        onLocationSelect={handleLocationSelect}
        currentLocation={location}
        initialCenter={coords || undefined}
      />
    </div>
  );
}